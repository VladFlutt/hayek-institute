import Link from 'next/link'
import { getDict, type Locale } from '@/i18n/dict'
import { getPayloadClient, md } from '@/lib/server'
import type { Where } from 'payload'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  return { title: getDict(locale).library.title }
}

export default async function LibraryPage({ params, searchParams }: { params: Promise<{ locale: Locale }>; searchParams: Promise<{ q?: string; course?: string }> }) {
  const { locale } = await params
  const { q, course } = await searchParams
  const t = getDict(locale)
  const payload = await getPayloadClient()
  const courses = await payload.find({ collection: 'courses', locale, sort: 'order', limit: 100, depth: 0, select: { title: true, slug: true } })
  const and: Where[] = []
  if (q) and.push({ or: [{ title: { like: q } }, { author: { like: q } }] })
  const selected = courses.docs.find((c) => c.slug === course)
  if (selected) and.push({ courses: { contains: selected.id } })
  const res = await payload.find({ collection: 'resources', locale, where: and.length ? { and } : undefined, sort: 'author', limit: 500, depth: 1 })

  return (
    <div className="wrap narrow" style={{ padding: '40px 20px' }}>
      <h1>{t.library.title}</h1>
      <p className="muted">{t.library.lead}</p>
      <form style={{ display: 'flex', gap: 8, margin: '20px 0', flexWrap: 'wrap' }}>
        <input name="q" defaultValue={q} placeholder={t.library.search} style={{ flex: '2 1 240px' }} />
        <select name="course" defaultValue={course ?? ''} style={{ flex: '1 1 200px' }}>
          <option value="">{t.library.all}</option>
          {courses.docs.map((c) => <option key={c.id} value={c.slug}>{c.title}</option>)}
        </select>
        <button className="btn">→</button>
      </form>
      <p className="faint">{res.totalDocs}</p>
      {res.docs.map((r) => {
        const file = typeof r.file === 'object' ? r.file : null
        const cs = (r.courses ?? []).map((c) => (typeof c === 'object' ? c : null)).filter(Boolean)
        return (
          <div className="res" key={r.id}>
            <div className="t">
              <b>{r.title}</b>
              {r.author ? <span className="a"> — {r.author}</span> : null}
              <div className="faint">
                {cs.map((c, i) => (
                  <span key={c!.id}>{i ? ' · ' : ''}<Link href={`/${locale}/courses/${c!.slug}`}>{c!.title}</Link></span>
                ))}
              </div>
              {r.note ? <div className="faint" dangerouslySetInnerHTML={{ __html: md(r.note) }} /> : null}
            </div>
            {file?.url ? <a className="btn small" href={file.url} target="_blank" rel="noreferrer">{t.library.pdf}</a> : null}
            {r.url ? <a className="btn small ghost" href={r.url} target="_blank" rel="noreferrer">{t.library.open}</a> : null}
          </div>
        )
      })}
    </div>
  )
}
