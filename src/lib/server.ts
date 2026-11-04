import 'server-only'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'
import { marked } from 'marked'
import type { User } from '@/payload-types'

export const getPayloadClient = cache(() => getPayload({ config }))

export const getUser = cache(async (): Promise<User | null> => {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  return (user as User) ?? null
})

export const md = (s?: string | null) => (s ? (marked.parse(s, { async: false }) as string) : '')

export const youtubeId = (url?: string | null): string | null => {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|v=|\/live\/|\/embed\/)([\w-]{11})/)
  return m ? m[1] : null
}

export const mediaUrl = (m: unknown, size?: 'card' | 'hero'): string | null => {
  if (!m || typeof m !== 'object') return null
  const o = m as { url?: string; sizes?: Record<string, { url?: string | null }> }
  return (size && o.sizes?.[size]?.url) || o.url || null
}
