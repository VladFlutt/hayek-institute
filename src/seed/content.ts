/**
 * Adds school-written materials to existing courses without touching anything editors changed:
 * a lesson is created only if its slug is not in the course yet.
 *   pnpm content
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { READING_NOTE, TWELVE_RULES_GUIDES } from './twelve-rules'

const payload = await getPayload({ config })
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
payload.logger.info(`Content: ${added} reading guides added to «12 правил экономики»`)
process.exit(0)
