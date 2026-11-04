'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getDict, type Locale } from '@/i18n/dict'

export function ProgressButton({ locale, lessonId, initialDone, loggedIn, loginHref }: { locale: Locale; lessonId: number; initialDone: boolean; loggedIn: boolean; loginHref: string }) {
  const t = getDict(locale)
  const router = useRouter()
  const [done, setDone] = useState(initialDone)
  const [busy, setBusy] = useState(false)

  if (!loggedIn) return <p className="faint progress-mark"><Link href={loginHref}>{t.lesson.loginToTrack}</Link></p>

  async function toggle() {
    setBusy(true)
    try {
      const r = await fetch('/api/progress', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lesson: lessonId, done: !done }),
      })
      const d = await r.json().catch(() => ({}))
      if (r.ok && d.ok) {
        setDone(Boolean(d.done))
        router.refresh()
      }
    } finally {
      setBusy(false)
    }
  }

  return done ? (
    <p className="progress-mark">
      <span className="tag gold">✓ {t.lesson.done}</span>
      <button className="btn ghost small" onClick={toggle} disabled={busy}>{t.lesson.undo}</button>
    </p>
  ) : (
    <p className="progress-mark">
      <button className="btn" onClick={toggle} disabled={busy}>✓ {t.lesson.markDone}</button>
    </p>
  )
}
