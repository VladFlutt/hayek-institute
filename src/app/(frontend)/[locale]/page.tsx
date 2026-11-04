import Link from 'next/link'
import { Cover } from '@/components/Cover'
import { RedeemForm } from '@/components/RedeemForm'
import { getDict, type Locale } from '@/i18n/dict'
import { getPayloadClient, getUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = getDict(locale)
  const payload = await getPayloadClient()
  const user = await getUser()
  const [levels, courses] = await Promise.all([
    payload.find({ collection: 'levels', locale, sort: 'order', limit: 20, depth: 1 }),
    payload.find({ collection: 'courses', locale, sort: 'order', limit: 100, depth: 1, select: { title: true, slug: true, tagline: true, level: true, year: true, cover: true } }),
  ])
  const counts = Object.fromEntries(
    await Promise.all(
      courses.docs.map(async (c) => [c.id, (await payload.count({ collection: 'lessons', where: { course: { equals: c.id } } })).totalDocs]),
    ),
  )
  const first = courses.docs.find((c) => c.slug === 'aristotle-logic')
  const heroLevel = levels.docs.find((l) => l.cover)

  return (
    <>
      <div className="wrap">
        <section className="hero">
          <div>
            <div className="eyebrow">{t.motto}</div>
            <h1>{t.school}</h1>
            <p className="lead">{t.heroLead}</p>
            <div className="actions">
              <Link className="btn" href={`/${locale}/courses/twelve-rules`}>{t.startFree}</Link>
              {first ? <Link className="btn ghost" href={`/${locale}/courses/${first.slug}`}>{t.startLogic}</Link> : null}
            </div>
          </div>
          <div className="hero-art">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={(heroLevel?.cover as { url?: string })?.url || '/hero.jpg'} alt="" />
          </div>
        </section>

        <section className="block">
          <h2>{t.how.title}</h2>
          <div className="steps">
            {t.how.steps.map(([title, text]) => (
              <div className="step" key={title}>
                <b>{title}</b>
                <span className="muted">{text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="block" id="program">
          <h2>{t.levels}</h2>
          {levels.docs.map((lv) => {
            const list = courses.docs.filter((c) => (typeof c.level === 'object' ? c.level?.id : c.level) === lv.id)
            if (!list.length) return null
            return (
              <div className="level" key={lv.id}>
                <div className="level-head">
                  <h3>{lv.title}</h3>
                  <span className="muted">{lv.description}</span>
                </div>
                <div className="grid">
                  {list.map((c) => (
                    <Link key={c.id} href={`/${locale}/courses/${c.slug}`} className="card">
                      <div className="cover"><Cover media={c.cover} slug={c.slug} title={c.title} /></div>
                      <div className="body">
                        <h4>{c.title}</h4>
                        <p>{c.tagline}</p>
                        <div className="meta">
                          <span>{counts[c.id]} {t.course.lessons}</span>
                          {c.year ? <span>{c.year}</span> : null}
                          <span className="tag gold">{c.slug === 'aristotle-logic' ? t.course.free : `1 ${t.kinds.lecture.toLowerCase()} — ${t.course.free}`}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </section>

        <section className="block" id="access">
          <div className="side-box narrow">
            <h2>{t.access.title}</h2>
            <p className="muted">{t.access.text}</p>
            <RedeemForm locale={locale} loggedIn={Boolean(user)} />
            <p className="faint" style={{ marginTop: 10 }}>{t.access.buy}</p>
          </div>
        </section>
      </div>
    </>
  )
}
