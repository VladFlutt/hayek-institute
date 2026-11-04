import type { Endpoint } from 'payload'
import { canOpenLesson } from '../access/lessonAccess'

/** POST /api/progress { lesson, done } — marks a lesson as completed (or not) for the signed-in user. */
export const progressEndpoint: Endpoint = {
  path: '/progress',
  method: 'post',
  handler: async (req) => {
    if (!req.user || req.user.collection !== 'users') {
      return Response.json({ ok: false, error: 'login' }, { status: 401 })
    }
    const body = (await req.json?.()) as { lesson?: number | string; done?: boolean } | undefined
    const lessonId = Number(body?.lesson)
    if (!Number.isInteger(lessonId) || lessonId <= 0) return Response.json({ ok: false, error: 'lesson' }, { status: 400 })

    const lesson = await req.payload
      .findByID({ collection: 'lessons', id: lessonId, depth: 0, overrideAccess: true, select: { free: true, course: true } })
      .catch(() => null)
    if (!lesson) return Response.json({ ok: false, error: 'lesson' }, { status: 404 })

    const user = await req.payload.findByID({ collection: 'users', id: req.user.id, depth: 0, overrideAccess: true })
    const course = typeof lesson.course === 'object' ? lesson.course?.id : lesson.course
    if (!canOpenLesson({ ...user, collection: 'users' } as never, { free: lesson.free, course })) {
      return Response.json({ ok: false, error: 'locked' }, { status: 403 })
    }
    const current = (user.completedLessons ?? []).map((l) => (typeof l === 'object' ? l.id : l))
    const next = body?.done === false ? current.filter((id) => id !== lessonId) : [...new Set([...current, lessonId])]
    await req.payload.update({ collection: 'users', id: user.id, overrideAccess: true, depth: 0, data: { completedLessons: next } })
    return Response.json({ ok: true, done: next.includes(lessonId) })
  },
}
