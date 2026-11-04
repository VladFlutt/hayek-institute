import 'server-only'
import type { Payload } from 'payload'
import type { Certificate, User } from '@/payload-types'

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const newCode = () => {
  const b = crypto.getRandomValues(new Uint8Array(8))
  const c = Array.from(b, (x) => ALPHABET[x % ALPHABET.length]).join('')
  return `HI-${c.slice(0, 4)}-${c.slice(4)}`
}

export const normalizeCertCode = (raw: string) => raw.trim().toUpperCase().replace(/\s+/g, '')

/** Lessons of a course and how many of them the user marked as completed. */
export async function courseProgress(payload: Payload, user: User, courseId: number) {
  const done = new Set((user.completedLessons ?? []).map((l) => (typeof l === 'object' ? l.id : l)))
  const { docs } = await payload.find({ collection: 'lessons', where: { course: { equals: courseId } }, limit: 1000, depth: 0, select: { slug: true } })
  const total = docs.length
  const completed = docs.filter((l) => done.has(l.id)).length
  return { total, completed, complete: total > 0 && completed === total }
}

export async function findCertificate(payload: Payload, userId: number, courseId: number): Promise<Certificate | null> {
  const { docs } = await payload.find({
    collection: 'certificates',
    where: { and: [{ user: { equals: userId } }, { course: { equals: courseId } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return docs[0] ?? null
}

/** Returns the user's certificate for the course, issuing it on first request once every lesson is completed. */
export async function getOrIssueCertificate(payload: Payload, user: User, courseId: number) {
  const existing = await findCertificate(payload, user.id, courseId)
  if (existing) return { cert: existing, progress: null }
  const progress = await courseProgress(payload, user, courseId)
  if (!progress.complete) return { cert: null, progress }
  const cert = await payload.create({
    collection: 'certificates',
    data: { code: newCode(), user: user.id, course: courseId, name: user.name?.trim() || user.email, issuedAt: new Date().toISOString() },
    overrideAccess: true,
  })
  return { cert, progress }
}
