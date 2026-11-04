import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Cover } from '@/components/Cover'
import { LockIcon } from '@/components/Logo'
import { RedeemForm } from '@/components/RedeemForm'
import { canOpenLesson, userHasCourse } from '@/access/lessonAccess'
import { getDict, type Locale } from '@/i18n/dict'
import { getPayloadClient, getUser, md } from '@/lib/server'
import type { Lesson } from '@/payload-types'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; course: string }> }) {
  const { locale, course } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'courses', locale, where: { slug: { equals: course } }, limit: 1, depth: 0 })
  return { title: docs[0]?.title, description: docs[0]?.tagline }
}

export default async function CoursePage({ params }: { params: Promise<{ locale: Locale; course: string }> }) {
  const { locale, course: slug } = await params
  const t = getDict(locale)
  const payload = await getPayloadClient()
  const user = await getUser()
  const { docs } = await payload.find({ collection: 'courses', locale, where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  const course = docs[0]
  if (!course) notFound()

  const [lessons, resources] = await Promise.all([
    payload.find({
      collection: 'lessons',
      locale,
      where: { course: { equals: course.id } },
      sort: 'order',
      limit: 300,
      depth: 0,
      select: { title: true, slug: true, kind: true, number: true, free: true, course: true, date: true },
    }),
    payload.find({ collection: 'resources', locale, where: { courses: { contains: course.id } }, sort: 'order', limit: 200, depth: 1 }),
  ])
  const has = userHasCourse(user as never, course.id)
  const groups: { key: string; title: string; items: Lesson[] }[] = [
    { key: 'text', title: t.course.texts, items: [] },
    { key: 'lecture', title: t.course.lectures, items: [] },
    { key: 'seminar', title: t.course.seminars, items: [] },
    { key: 'bonus', title: t.course.bonus, items: [] },
    { key: 'guest', title: t.course.guests, items: [] },
  ]
  for (const l of lessons.docs as Lesson[]) {
    const key = l.kind === 'lecture' && l.number == null ? 'bonus' : l.kind
    groups.find((g) => g.key === key)?.items.push(l)
  }
  const doneIds = new Set((user?.completedLessons ?? []).map((l) => (typeof l === 'object' ? l.id : l)))
  const doneCount = lessons.docs.filter((l) => doneIds.has(l.id)).length
  const level = typeof course.level === 'object' ? course.level : null

  const list = (g: (typeof groups)[number]) => (
    <div key={g.key}>
      <h3>{g.title}</h3>
      <ol className="lesson-list">
        {g.items.map((l) => {
          const open = canOpenLesson(user as never, { ...l, course: course.id })
          return (
            <li key={l.id}>
              <Link href={`/${locale}/courses/${course.slug}/${l.slug}`}>
                <span className="n">{l.number ?? '•'}</span>
                <span className="t">
                  {l.title}
                  {l.date ? <span className="faint"> · {l.date}</span> : null}
                </span>
                {doneIds.has(l.id) ? <span className="done-mark" title={t.lesson.done}>✓</span> : null}
                {l.free && !has ? <span className="tag gold">{t.course.free}</span> : null}
                <span className="lock" title={open ? t.course.open : t.access.locked}>
                  <LockIcon open={open} />
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
  const nonEmpty = groups.filter((g) => g.items.length)
  const paired = nonEmpty.filter((g) => g.key === 'lecture' || g.key === 'seminar')
  const rest = nonEmpty.filter((g) => g.key !== 'lecture' && g.key !== 'seminar')

  return (
    <div className="wrap">
      <section className="course-hero">
        <div>
          <div className="eyebrow">{level?.title}</div>
          <h1>{course.title}</h1>
          <p className="lead muted" style={{ fontSize: '1.1rem' }}>{course.tagline}</p>
          <div className="facts">
            <span>{t.course.teacher}: <b>{course.teacher}</b></span>
            {course.year ? <span>{t.course.when}: <b>{course.year}</b></span> : null}
            <span><b>{lessons.totalDocs}</b> {t.course.lessons}</span>
          </div>
          {doneCount ? (
            <div className="progress">
              <span className="bar"><i style={{ width: `${Math.round((doneCount / lessons.totalDocs) * 100)}%` }} /></span>
              <span className="faint">{t.course.progress} {doneCount} {t.course.of} {lessons.totalDocs}</span>
            </div>
          ) : null}
          {doneCount && doneCount === lessons.totalDocs ? (
            <p style={{ marginTop: 12 }}><Link className="btn" href={`/${locale}/courses/${course.slug}/certificate`}>🎓 {t.cert.get}</Link></p>
          ) : null}
          {course.description ? <div className="prose" dangerouslySetInnerHTML={{ __html: md(course.description) }} /> : null}
          {course.outcomes?.length ? (
            <ul>{course.outcomes.map((o) => <li key={o.id}>{o.text}</li>)}</ul>
          ) : null}
        </div>
        <div>
          <div className="cover"><Cover media={course.cover} slug={course.slug} title={course.title} size="hero" /></div>
          {!has && course.slug !== 'aristotle-logic' ? (
            <div className="side-box" style={{ marginTop: 16 }} id="access">
              <b className="serif" style={{ fontSize: '1.2rem' }}>{t.access.enterCode}</b>
              <p className="faint">{t.access.lockedText}</p>
              <RedeemForm locale={locale} loggedIn={Boolean(user)} />
            </div>
          ) : null}
        </div>
      </section>

      {paired.length === 2 ? <div className="cols">{paired.map(list)}</div> : paired.map(list)}
      {rest.map(list)}

      {resources.docs.length ? (
        <section>
          <h3>{t.course.library}</h3>
          {resources.docs.map((r) => {
            const file = typeof r.file === 'object' ? r.file : null
            return (
              <div className="res" key={r.id}>
                <div className="t">
                  <b>{r.title}</b>
                  {r.author ? <span className="a"> — {r.author}</span> : null}
                  {r.note ? <div className="faint" dangerouslySetInnerHTML={{ __html: md(r.note) }} /> : null}
                </div>
                {file?.url ? <a className="btn small" href={file.url} target="_blank" rel="noreferrer">{t.library.pdf}</a> : null}
                {r.url ? <a className="btn small ghost" href={r.url} target="_blank" rel="noreferrer">{t.library.open}</a> : null}
              </div>
            )
          })}
        </section>
      ) : null}
    </div>
  )
}
