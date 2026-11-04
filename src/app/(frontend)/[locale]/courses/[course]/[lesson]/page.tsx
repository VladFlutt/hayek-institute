import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LockIcon } from '@/components/Logo'
import { ProgressButton } from '@/components/ProgressButton'
import { RedeemForm } from '@/components/RedeemForm'
import { TutorChat } from '@/components/TutorChat'
import { canOpenLesson } from '@/access/lessonAccess'
import { getDict, type Locale } from '@/i18n/dict'
import { getPayloadClient, getUser, md, youtubeId } from '@/lib/server'

export const dynamic = 'force-dynamic'

type P = { params: Promise<{ locale: Locale; course: string; lesson: string }> }

async function load({ locale, course, lesson }: { locale: Locale; course: string; lesson: string }) {
  const payload = await getPayloadClient()
  const user = await getUser()
  const c = await payload.find({ collection: 'courses', locale, where: { slug: { equals: course } }, limit: 1, depth: 0 })
  const courseDoc = c.docs[0]
  if (!courseDoc) return null
  const l = await payload.find({
    collection: 'lessons',
    locale,
    where: { and: [{ course: { equals: courseDoc.id } }, { slug: { equals: lesson } }] },
    limit: 1,
    depth: 1,
    user: user ?? undefined,
    overrideAccess: false,
  })
  const lessonDoc = l.docs[0]
  if (!lessonDoc) return null
  return { payload, user, courseDoc, lessonDoc }
}

export async function generateMetadata({ params }: P) {
  const p = await params
  const data = await load(p)
  return { title: data ? `${data.lessonDoc.title} · ${data.courseDoc.title}` : undefined }
}

export default async function LessonPage({ params }: P) {
  const p = await params
  const { locale } = p
  const t = getDict(locale)
  const data = await load(p)
  if (!data) notFound()
  const { payload, user, courseDoc: course, lessonDoc: lesson } = data
  const open = canOpenLesson(user as never, { free: lesson.free, course: course.id })

  const siblings = await payload.find({
    collection: 'lessons',
    locale,
    where: { course: { equals: course.id } },
    sort: 'order',
    limit: 300,
    depth: 0,
    select: { title: true, slug: true },
  })
  const idx = siblings.docs.findIndex((s) => s.id === lesson.id)
  const prev = idx > 0 ? siblings.docs[idx - 1] : null
  const next = idx >= 0 && idx < siblings.docs.length - 1 ? siblings.docs[idx + 1] : null
  const vid = open ? youtubeId(lesson.youtubeUrl) : null
  const base = `/${locale}/courses/${course.slug}`

  return (
    <div className="wrap">
      <div className="lesson-layout">
        <article>
          <Link href={base} className="faint">← {course.title}</Link>
          <div className="eyebrow" style={{ marginTop: 14 }}>
            {t.kinds[lesson.kind as keyof typeof t.kinds]}
            {lesson.number ? ` ${lesson.number}` : ''}
            {lesson.date ? ` · ${lesson.date}` : ''}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>{lesson.title}</h1>

          {!open ? (
            <div className="locked">
              <div className="inner">
                <LockIcon />
                <h3 style={{ marginTop: 8 }}>{t.access.locked}</h3>
                <p className="muted">{t.access.lockedText}</p>
                <RedeemForm locale={locale} loggedIn={Boolean(user)} />
                <p className="faint" style={{ marginTop: 10 }}>{t.access.buy}</p>
              </div>
            </div>
          ) : vid ? (
            <>
              <div className="video">
                <iframe
                  src={`https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1&playsinline=1`}
                  title={lesson.title}
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <p className="video-fallback">
                <a className="btn" href={`https://www.youtube.com/watch?v=${vid}`} target="_blank" rel="noopener noreferrer">▶ {t.lesson.watchOnYoutube}</a>
                <span className="faint">{t.lesson.videoHelp}</span>
              </p>
            </>
          ) : null}

          {open && lesson.body ? <div className="prose" style={{ marginTop: 24 }} dangerouslySetInnerHTML={{ __html: md(lesson.body) }} /> : null}

          {open && lesson.summary ? (
            <section style={{ marginTop: 28 }}>
              <h2>{t.lesson.summary}</h2>
              <div className="prose" dangerouslySetInnerHTML={{ __html: md(lesson.summary) }} />
            </section>
          ) : open && !lesson.body ? (
            <p className="faint" style={{ marginTop: 18 }}>{t.lesson.noSummary}</p>
          ) : null}

          {open && lesson.questions?.length ? (
            <section style={{ marginTop: 28 }}>
              <h2>{t.lesson.questions}</h2>
              {lesson.questions.map((q) => (
                <details className="q" key={q.id}>
                  <summary>{q.question}</summary>
                  {q.answer ? <div>{q.answer}</div> : null}
                </details>
              ))}
            </section>
          ) : null}

          {open ? (
            <ProgressButton
              locale={locale}
              lessonId={lesson.id}
              loggedIn={Boolean(user)}
              initialDone={(user?.completedLessons ?? []).some((l) => (typeof l === 'object' ? l.id : l) === lesson.id)}
              loginHref={`/${locale}/account?next=${encodeURIComponent(`${base}/${lesson.slug}`)}`}
            />
          ) : null}

          <div className="pager">
            {prev ? <Link className="btn ghost small" href={`${base}/${prev.slug}`}>← {prev.title}</Link> : <span />}
            {next ? <Link className="btn ghost small" href={`${base}/${next.slug}`}>{next.title} →</Link> : null}
          </div>
        </article>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {open && lesson.timecodes?.length ? (
            <div className="side-box">
              <b className="serif" style={{ fontSize: '1.15rem' }}>{t.lesson.timecodes}</b>
              <ul className="timecodes">
                {lesson.timecodes.map((tc) => (
                  <li key={tc.id}><code>{tc.at}</code><span>{tc.label}</span></li>
                ))}
              </ul>
            </div>
          ) : null}
          {open && lesson.links?.length ? (
            <div className="side-box">
              <b className="serif" style={{ fontSize: '1.15rem' }}>{t.lesson.links}</b>
              <ul style={{ paddingLeft: 18, margin: '8px 0 0' }}>
                {lesson.links.map((l) => (
                  <li key={l.id}><a href={l.url} target="_blank" rel="noreferrer">{l.label || l.url}</a></li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="side-box">
            <b className="serif" style={{ fontSize: '1.15rem' }}>{t.lesson.askTutor}</b>
            <div style={{ marginTop: 10 }}>
              <TutorChat locale={locale} loggedIn={Boolean(user)} lessonId={lesson.id} compact />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
