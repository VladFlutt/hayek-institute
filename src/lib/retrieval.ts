import { sql } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'

export type Excerpt = { course: string; lesson: string; url: string; text: string }

const clip = (s: string | null | undefined, n: number) => (s ? (s.length > n ? s.slice(0, n) + '…' : s) : '')

/** Full-text search over lesson titles, summaries, texts and transcripts (Russian + simple config). */
export async function searchLessons(payload: Payload, query: string, locale: 'ru' | 'en', limit = 6): Promise<Excerpt[]> {
  const db = (payload.db as any).drizzle
  if (!db || !query.trim()) return []
  const q = query.slice(0, 400)
  const result = await db.execute(sql`
    with docs as (
      select l.id, l.slug, c.slug as course_slug,
        coalesce(cl.title, '') as course_title, coalesce(ll.title, '') as title,
        coalesce(ll.summary, '') || ' ' || coalesce(ll.body, '') || ' ' || coalesce(l.transcript, '') as content
      from lessons l
      join courses c on c.id = l.course_id
      left join courses_locales cl on cl._parent_id = c.id and cl._locale = ${locale}
      left join lessons_locales ll on ll._parent_id = l.id and ll._locale = ${locale}
      where l._status = 'published'
    )
    select *, ts_rank(
      setweight(to_tsvector('russian', title), 'A') || to_tsvector('russian', content) ||
      to_tsvector('english', content),
      websearch_to_tsquery('russian', ${q}) || websearch_to_tsquery('english', ${q})
    ) as rank
    from docs
    where (to_tsvector('russian', title || ' ' || content) || to_tsvector('english', title || ' ' || content))
      @@ (websearch_to_tsquery('russian', ${q}) || websearch_to_tsquery('english', ${q}))
    order by rank desc
    limit ${limit}
  `)
  const rows = (result.rows ?? result) as any[]
  return rows
    .filter((r) => r.content.trim().length > 20)
    .map((r) => ({
      course: r.course_title,
      lesson: r.title,
      url: `/${locale}/courses/${r.course_slug}/${r.slug}`,
      text: clip(r.content.trim(), 1500),
    }))
}

export async function searchGlossary(payload: Payload, query: string, locale: 'ru' | 'en') {
  const words = query.toLowerCase().split(/[^\p{L}\d-]+/u).filter((w) => w.length > 4).slice(0, 8)
  if (!words.length) return []
  const { docs } = await payload.find({
    collection: 'glossary',
    locale,
    limit: 5,
    depth: 0,
    where: { or: words.map((w) => ({ term: { contains: w.slice(0, Math.max(5, w.length - 2)) } })) },
  })
  return docs.map((d) => ({ term: d.term, definition: d.definition, source: d.source }))
}
