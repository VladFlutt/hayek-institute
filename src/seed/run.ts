/**
 * Imports the school catalogue: levels, courses, lessons (from Usanov's emails), library, glossary.
 * Idempotent: re-running updates records matched by slug / url.
 *   pnpm seed
 */
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { COURSES, LEVELS } from './catalog'
import { GLOSSARY, LOGIC_LESSONS } from './logic'
import { parseCourseLinks, type ParsedLesson } from './parse'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const KIND_RU = { lecture: 'Лекция', seminar: 'Семинар', guest: 'Гость' } as const
const KIND_EN = { lecture: 'Lecture', seminar: 'Seminar', guest: 'Guest' } as const

function lessonTitles(l: ParsedLesson): { ru: string; en?: string; date?: string } {
  if (l.kind === 'guest' || l.number == null) return { ru: l.label }
  const n = l.number
  const words = l.label.split(/\s+/)
  if (/^\d/.test(l.label)) {
    // "8 февраля (презентация …)" — course 10 labels lessons by date
    return { ru: `${KIND_RU[l.kind]} ${n}`, en: `${KIND_EN[l.kind]} ${n}`, date: l.label.replace(/\s*\(.*\)\s*$/, '') }
  }
  const second = (words[1] || '').toLowerCase().replace(/[,]/g, '')
  if (/^(лекция|семинар)$/.test(second)) {
    const rest = l.label.slice(l.label.indexOf(words[1]) + words[1].length).replace(/^[,\s]+/, '').trim()
    return { ru: `${KIND_RU[l.kind]} ${n}${rest ? ` — ${rest}` : ''}`, en: `${KIND_EN[l.kind]} ${n}` }
  }
  return { ru: l.label, en: `${KIND_EN[l.kind]} ${n}` }
}

async function upsert(payload: Payload, collection: any, where: any, ru: any, en?: any) {
  const found = await payload.find({ collection, where, limit: 1, overrideAccess: true, draft: true, depth: 0 })
  let doc
  if (found.docs[0]) {
    doc = await payload.update({ collection, id: found.docs[0].id, data: ru, locale: 'ru', overrideAccess: true, depth: 0 })
  } else {
    doc = await payload.create({ collection, data: ru, locale: 'ru', overrideAccess: true, depth: 0 })
  }
  if (en) await payload.update({ collection, id: doc.id, data: en, locale: 'en', overrideAccess: true, depth: 0 })
  return doc
}

export async function seed(payload: Payload) {
  const md = readFileSync(path.join(dirname, 'usanov-course-links.md'), 'utf8')
  const sections = parseCourseLinks(md)

  const levelIds: Record<string, number | string> = {}
  for (const lv of LEVELS) {
    const d = await upsert(payload, 'levels', { slug: { equals: lv.slug } },
      { slug: lv.slug, order: lv.order, title: lv.title.ru, description: lv.description.ru },
      { title: lv.title.en, description: lv.description.en })
    levelIds[lv.slug] = d.id
  }

  const courseIds: Record<string, number | string> = {}
  const courseByTitle: Record<string, number | string> = {}
  for (const c of COURSES) {
    const d = await upsert(payload, 'courses', { slug: { equals: c.slug } },
      { slug: c.slug, level: levelIds[c.level], order: c.order, title: c.title.ru, tagline: c.tagline.ru, year: c.year?.ru, coverPrompt: c.coverPrompt, _status: 'published' },
      { title: c.title.en, tagline: c.tagline.en, year: c.year?.en, teacher: 'Pavel Usanov', _status: 'published' })
    courseIds[c.slug] = d.id
    courseByTitle[c.title.ru] = d.id
  }

  // Level 0 reading course
  for (const [i, l] of LOGIC_LESSONS.entries()) {
    await upsert(payload, 'lessons', { and: [{ course: { equals: courseIds['aristotle-logic'] } }, { slug: { equals: l.slug } }] },
      {
        course: courseIds['aristotle-logic'], kind: 'text', number: i + 1, slug: l.slug, order: i + 1,
        free: true, title: l.title.ru, body: l.body,
        questions: l.questions.map((q) => ({ question: q.q, answer: q.a })), _status: 'published',
      },
      { title: l.title.en, _status: 'published' })
  }

  let lessonCount = 0
  let resourceCount = 0
  const pendingCross: { courseId: number | string; title: string }[] = []
  for (const s of sections) {
    const meta = COURSES.find((c) => c.section === s.number)
    if (!meta) continue
    const courseId = courseIds[meta.slug]
    const used = new Set<string>()
    let bonus = 0
    let guest = 0
    for (const l of s.lessons) {
      const t = lessonTitles(l)
      let slug = l.kind === 'guest' ? `guest-${++guest}` : l.number == null ? `bonus-${++bonus}` : `${l.kind}-${l.number}`
      while (used.has(slug)) slug = `${slug}-b`
      used.add(slug)
      const order =
        l.kind === 'guest' ? 1000 + guest : l.number == null ? 500 + bonus : l.number * 2 + (l.kind === 'seminar' ? 1 : 0)
      await upsert(payload, 'lessons', { and: [{ course: { equals: courseId } }, { slug: { equals: slug } }] },
        {
          course: courseId, kind: l.kind, number: l.number, slug, order, title: t.ru, date: t.date,
          free: l.kind === 'lecture' && l.number === 1, youtubeUrl: l.url,
          links: l.links.map((x) => ({ label: x.label, url: x.url })), _status: 'published',
        },
        t.en ? { title: t.en, _status: 'published' } : undefined)
      lessonCount++
    }
    for (const [i, r] of s.resources.entries()) {
      if (!r.url) {
        const q = r.title.replace(/[«»]/g, '')
        pendingCross.push({ courseId, title: q.length > 3 ? q : r.label })
        continue
      }
      const volumes = r.links.filter((x) => /^том/i.test(x.label))
      const kind = /youtu/.test(r.url) ? 'video' : /задани/i.test(r.label) ? 'homework' : 'book'
      const extras = r.links.filter((x) => !/^том/i.test(x.label))
      const note = extras.length ? extras.map((x) => `[${x.label}](${x.url})`).join(' · ') : undefined
      const entries = volumes.length ? volumes.map((v) => ({ title: `${r.title} — ${v.label}`, url: v.url })) : [{ title: r.title, url: r.url }]
      for (const e of entries) {
        await upsert(payload, 'resources', { url: { equals: e.url } },
          { title: e.title, author: r.author === r.title ? undefined : r.author, url: e.url, kind, courses: [courseId], note, order: i })
        resourceCount++
      }
    }
  }
  // Books referenced from another course: attach this course too
  for (const p of pendingCross) {
    const words = p.title.split(/[\s«»"]+/).filter((w) => w.length > 4).slice(0, 2)
    if (!words.length) continue
    const found = await payload.find({ collection: 'resources', where: { and: words.map((w) => ({ title: { contains: w } })) }, limit: 1, overrideAccess: true, depth: 0 })
    const doc = found.docs[0]
    if (doc) {
      const ids = new Set([...(doc.courses ?? []).map((c: any) => (typeof c === 'object' ? c.id : c)), p.courseId])
      await payload.update({ collection: 'resources', id: doc.id, data: { courses: [...ids] }, overrideAccess: true })
    }
  }

  for (const g of GLOSSARY) {
    await upsert(payload, 'glossary', { term: { equals: g.term.ru } },
      { term: g.term.ru, definition: g.def.ru, source: g.source },
      { term: g.term.en, definition: g.def.en })
  }
  payload.logger.info(`Seed done: ${COURSES.length} courses, ${lessonCount} lessons from emails + ${LOGIC_LESSONS.length} logic lessons, ${resourceCount} resources, ${GLOSSARY.length} terms`)
}

const payload = await getPayload({ config })
// On deploy the seed runs only into an empty database, so edits made in the admin panel are never overwritten.
// Run `SEED_FORCE=1 pnpm seed` to re-apply the catalog on purpose.
const existing = await payload.count({ collection: 'courses', overrideAccess: true })
if (existing.totalDocs > 0 && !process.env.SEED_FORCE) {
  payload.logger.info(`Seed skipped: ${existing.totalDocs} courses already exist`)
} else {
  await seed(payload)
}
process.exit(0)
