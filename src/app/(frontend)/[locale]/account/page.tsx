import Link from 'next/link'
import { AuthForms, LogoutButton } from '@/components/AuthForms'
import { RedeemForm } from '@/components/RedeemForm'
import { getDict, type Locale } from '@/i18n/dict'
import { getPayloadClient, getUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  return { title: getDict(locale).nav.account }
}

export default async function AccountPage({ params, searchParams }: { params: Promise<{ locale: Locale }>; searchParams: Promise<{ next?: string }> }) {
  const { locale } = await params
  const { next } = await searchParams
  const t = getDict(locale)
  const user = await getUser()
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : `/${locale}/account`

  if (!user) {
    const settings = await (await getPayloadClient()).findGlobal({ slug: 'school-settings', depth: 0 }).catch(() => null)
    return (
      <div className="wrap" style={{ padding: '40px 20px', maxWidth: 460 }}>
        <AuthForms locale={locale} next={safeNext} emailReset={!!process.env.SMTP_HOST} adminContact={settings?.adminContact || ''} />
      </div>
    )
  }

  const payload = await getPayloadClient()
  const ids = (user.unlockedCourses ?? []).map((c) => (typeof c === 'object' ? c.id : c))
  const courses = ids.length
    ? (await payload.find({ collection: 'courses', locale, where: { id: { in: ids } }, depth: 0, limit: 100 })).docs
    : []

  const doneIds = (user.completedLessons ?? []).map((l) => (typeof l === 'object' ? l.id : l))
  const doneLessons = doneIds.length
    ? (await payload.find({ collection: 'lessons', where: { id: { in: doneIds } }, depth: 0, limit: 1000, select: { course: true } })).docs
    : []
  const perCourse = new Map<number, number>()
  for (const l of doneLessons) {
    const c = typeof l.course === 'object' ? l.course?.id : l.course
    if (c) perCourse.set(c, (perCourse.get(c) ?? 0) + 1)
  }
  const progress = perCourse.size
    ? await Promise.all(
        (await payload.find({ collection: 'courses', locale, where: { id: { in: [...perCourse.keys()] } }, depth: 0, limit: 100 })).docs.map(async (c) => ({
          c,
          done: perCourse.get(c.id) ?? 0,
          total: (await payload.count({ collection: 'lessons', where: { course: { equals: c.id } } })).totalDocs,
        })),
      )
    : []

  return (
    <div className="wrap narrow" style={{ padding: '40px 20px' }}>
      <h1>{t.auth.hello}{user.name ? `, ${user.name}` : ''}</h1>
      <p className="faint">{user.email}</p>
      <h2 style={{ marginTop: 28 }}>{t.auth.myCourses}</h2>
      {user.allAccess || user.role !== 'student' ? (
        <p>{t.auth.allAccess}</p>
      ) : courses.length ? (
        <ul>{courses.map((c) => <li key={c.id}><Link href={`/${locale}/courses/${c.slug}`}>{c.title}</Link></li>)}</ul>
      ) : (
        <p className="muted">{t.auth.none}</p>
      )}
      <h2 style={{ marginTop: 28 }}>{t.auth.myProgress}</h2>
      {progress.length ? (
        progress.map(({ c, done, total }) => (
          <div key={c.id} style={{ marginBottom: 14 }}>
            <Link href={`/${locale}/courses/${c.slug}`}>{c.title}</Link>
            <div className="progress" style={{ marginTop: 6 }}>
              <span className="bar"><i style={{ width: `${Math.round((done / Math.max(total, 1)) * 100)}%` }} /></span>
              <span className="faint">{done} {t.course.of} {total}</span>
            </div>
            {done === total && total > 0 ? (
              <Link className="btn small" style={{ marginTop: 8 }} href={`/${locale}/courses/${c.slug}/certificate`}>🎓 {t.cert.get}</Link>
            ) : null}
          </div>
        ))
      ) : (
        <p className="muted">{t.auth.noProgress}</p>
      )}
      <div className="side-box" style={{ margin: '24px 0' }} id="access">
        <b className="serif" style={{ fontSize: '1.2rem' }}>{t.access.enterCode}</b>
        <div style={{ marginTop: 10 }}><RedeemForm locale={locale} loggedIn /></div>
      </div>
      <LogoutButton locale={locale} />
    </div>
  )
}
