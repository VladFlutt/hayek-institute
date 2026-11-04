import type { Endpoint } from 'payload'
import { streamChat, type ChatMessage } from '../lib/ai'
import { buildTutorSystem } from '../lib/tutor'

/** POST /api/tutor { messages, mode, lessonId?, locale } → text/plain stream */
export const tutorEndpoint: Endpoint = {
  path: '/tutor',
  method: 'post',
  handler: async (req) => {
    const { payload } = req
    const user = req.user as any
    if (!user || user.collection !== 'users') return Response.json({ error: 'login' }, { status: 401 })

    const body = ((await req.json?.()) ?? {}) as {
      messages?: { role: string; content: string }[]
      mode?: string
      lessonId?: number | string
      locale?: string
    }
    const locale = body.locale === 'en' ? 'en' : 'ru'
    const history = (body.messages ?? [])
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-12)
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content.slice(0, 4000) }))
    const last = [...history].reverse().find((m) => m.role === 'user')
    if (!last) return Response.json({ error: 'empty' }, { status: 400 })

    const charter = await payload.findGlobal({ slug: 'assistant-charter', locale, overrideAccess: true })
    if (charter.enabled === false) return Response.json({ error: 'disabled' }, { status: 503 })

    // Daily limit per student
    const today = new Date().toISOString().slice(0, 10)
    const fresh = await payload.findByID({ collection: 'users', id: user.id, depth: 0, overrideAccess: true })
    const used = fresh.tutorUsage?.day === today ? fresh.tutorUsage?.count ?? 0 : 0
    const limit = charter.dailyLimit ?? 30
    if (fresh.role === 'student' && used >= limit) return Response.json({ error: 'limit', limit }, { status: 429 })
    await payload.update({
      collection: 'users',
      id: user.id,
      overrideAccess: true,
      data: { tutorUsage: { day: today, count: used + 1 } },
    })

    const system = await buildTutorSystem(payload, {
      locale,
      mode: body.mode,
      question: last.content,
      lessonId: body.lessonId,
      user: { ...fresh, collection: 'users' },
      charter: charter.charter ?? '',
    })

    const messages: ChatMessage[] = [{ role: 'system', content: system }, ...history]
    try {
      const stream = await streamChat(messages)
      return new Response(stream, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } })
    } catch (e) {
      payload.logger.error(e)
      return Response.json({ error: 'provider' }, { status: 502 })
    }
  },
}
