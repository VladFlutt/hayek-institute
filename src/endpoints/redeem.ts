import type { Endpoint } from 'payload'
import { normalizeCode } from '../collections/AccessCodes'

/** POST /api/redeem { code } — activates an access code for the signed-in user. */
export const redeemEndpoint: Endpoint = {
  path: '/redeem',
  method: 'post',
  handler: async (req) => {
    if (!req.user || req.user.collection !== 'users') {
      return Response.json({ ok: false, error: 'login' }, { status: 401 })
    }
    const body = (await req.json?.()) as { code?: string } | undefined
    const code = normalizeCode(String(body?.code ?? ''))
    if (!code) return Response.json({ ok: false, error: 'empty' }, { status: 400 })

    const { docs } = await req.payload.find({
      collection: 'access-codes',
      where: { code: { equals: code } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const ac = docs[0]
    if (!ac) return Response.json({ ok: false, error: 'not_found' }, { status: 404 })
    if (ac.expiresAt && new Date(ac.expiresAt) < new Date()) {
      return Response.json({ ok: false, error: 'expired' }, { status: 410 })
    }
    const redeemedBy = (ac.redeemedBy ?? []).map((u) => (typeof u === 'object' ? u.id : u))
    const already = redeemedBy.some((id) => String(id) === String(req.user!.id))
    if (!already && (ac.uses ?? 0) >= (ac.maxUses ?? 1)) {
      return Response.json({ ok: false, error: 'used' }, { status: 409 })
    }

    const user = await req.payload.findByID({ collection: 'users', id: req.user.id, depth: 0, overrideAccess: true })
    const current = (user.unlockedCourses ?? []).map((c) => (typeof c === 'object' ? c.id : c))
    const add = (ac.courses ?? []).map((c) => (typeof c === 'object' ? c.id : c))
    await req.payload.update({
      collection: 'users',
      id: user.id,
      overrideAccess: true,
      data:
        ac.scope === 'all'
          ? { allAccess: true }
          : { unlockedCourses: [...new Set([...current, ...add])] },
    })
    if (!already) {
      await req.payload.update({
        collection: 'access-codes',
        id: ac.id,
        overrideAccess: true,
        data: { uses: (ac.uses ?? 0) + 1, redeemedBy: [...redeemedBy, user.id] },
      })
    }

    let courses: { slug: string; title: string }[] = []
    if (ac.scope !== 'all' && add.length) {
      const res = await req.payload.find({
        collection: 'courses',
        where: { id: { in: add } },
        locale: (req.locale as 'ru' | 'en') || 'ru',
        depth: 0,
        overrideAccess: true,
      })
      courses = res.docs.map((c) => ({ slug: c.slug, title: c.title }))
    }
    return Response.json({ ok: true, scope: ac.scope, courses })
  },
}
