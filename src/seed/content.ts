/**
 * Adds school-written materials to existing courses without touching anything editors changed:
 * a lesson is created only if its slug is not in the course yet.
 *   pnpm content
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { COURSE_TEXTS } from './course-texts'
import { READING_NOTE, TWELVE_RULES_GUIDES } from './twelve-rules'
import { READING_NOTE_EN, TWELVE_RULES_GUIDES_EN } from './twelve-rules-en'

const payload = await getPayload({ config })

let described = 0
for (const [slug, t] of Object.entries(COURSE_TEXTS)) {
  const c = (await payload.find({ collection: 'courses', where: { slug: { equals: slug } }, limit: 1, depth: 0, locale: 'ru', overrideAccess: true, draft: true })).docs[0]
  if (!c || c.description) continue
  const ru = await payload.update({
    collection: 'courses', id: c.id, locale: 'ru', overrideAccess: true, depth: 0,
    data: { description: t.description.ru, outcomes: t.outcomes.map((o) => ({ text: o.ru })), _status: 'published' } as never,
  })
  await payload.update({
    collection: 'courses', id: c.id, locale: 'en', overrideAccess: true, depth: 0,
    data: { description: t.description.en, outcomes: (ru.outcomes || []).map((o, i) => ({ id: o.id, text: t.outcomes[i].en })), _status: 'published' } as never,
  })
  described++
}
payload.logger.info(`Content: descriptions added to ${described} courses`)
const course = (await payload.find({ collection: 'courses', where: { slug: { equals: 'twelve-rules' } }, limit: 1, depth: 0, overrideAccess: true, draft: true })).docs[0]
if (!course) {
  payload.logger.warn('Content: course twelve-rules not found')
  process.exit(0)
}
let added = 0
for (const [i, g] of TWELVE_RULES_GUIDES.entries()) {
  const exists = await payload.count({ collection: 'lessons', where: { and: [{ course: { equals: course.id } }, { slug: { equals: g.slug } }] }, overrideAccess: true })
  if (exists.totalDocs > 0) continue
  await payload.create({
    collection: 'lessons',
    locale: 'ru',
    overrideAccess: true,
    depth: 0,
    data: {
      course: course.id,
      kind: 'text',
      number: i + 1,
      slug: g.slug,
      order: i + 1,
      free: Boolean(g.free),
      title: g.title,
      body: `${READING_NOTE}\n\n${g.body}`,
      questions: g.questions.map((q) => ({ question: q.q, answer: q.a })),
      _status: 'published',
    } as never,
  })
  added++
}
let translated = 0
for (const [slug, en] of Object.entries(TWELVE_RULES_GUIDES_EN)) {
  const l = (await payload.find({ collection: 'lessons', where: { and: [{ course: { equals: course.id } }, { slug: { equals: slug } }] }, limit: 1, depth: 0, locale: 'en', fallbackLocale: false, overrideAccess: true, draft: true })).docs[0]
  if (!l || l.title) continue
  await payload.update({
    collection: 'lessons', id: l.id, locale: 'en', overrideAccess: true, depth: 0,
    data: {
      title: en.title,
      body: `${READING_NOTE_EN}\n\n${en.body}`,
      questions: (l.questions || []).map((q, i) => ({ id: q.id, question: en.questions[i]?.q, answer: en.questions[i]?.a })),
      _status: 'published',
    } as never,
  })
  translated++
}
payload.logger.info(`Content: ${translated} reading guides translated to English`)
payload.logger.info(`Content: ${added} reading guides added to «12 правил экономики»`)
process.exit(0)
