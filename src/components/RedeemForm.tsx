'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getDict, type Locale } from '@/i18n/dict'

const ERR: Record<string, { ru: string; en: string }> = {
  not_found: { ru: 'Такого кода нет. Проверьте написание.', en: 'No such code. Check the spelling.' },
  used: { ru: 'Этот код уже использован.', en: 'This code has already been used.' },
  expired: { ru: 'Срок действия кода истёк.', en: 'This code has expired.' },
  login: { ru: 'Сначала войдите в аккаунт.', en: 'Please sign in first.' },
  empty: { ru: 'Введите код.', en: 'Enter a code.' },
}

export function RedeemForm({ locale, loggedIn }: { locale: Locale; loggedIn: boolean }) {
  const t = getDict(locale)
  const router = useRouter()
  const [code, setCode] = useState('')
  const [state, setState] = useState<{ kind: 'idle' | 'busy' | 'ok' | 'err'; text?: string }>({ kind: 'idle' })

  if (!loggedIn) {
    return (
      <div className="notice">
        {t.access.needLogin}{' '}
        <Link href={`/${locale}/account?next=${encodeURIComponent('/' + locale + '#access')}`}>{t.nav.login} →</Link>
      </div>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState({ kind: 'busy' })
    const res = await fetch(`/api/redeem?locale=${locale}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    const data = await res.json().catch(() => ({}))
    if (data.ok) {
      const what = data.scope === 'all' ? t.access.allCourses : data.courses.map((c: { title: string }) => c.title).join(', ')
      setState({ kind: 'ok', text: t.access.redeemOk + what })
      setCode('')
      router.refresh()
    } else {
      setState({ kind: 'err', text: (ERR[data.error] ?? ERR.not_found)[locale] })
    }
  }

  return (
    <form onSubmit={submit}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          style={{ flex: '1 1 220px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.05em' }}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={t.access.codePlaceholder}
          aria-label={t.access.enterCode}
          autoComplete="off"
        />
        <button className="btn" disabled={state.kind === 'busy' || !code.trim()}>{t.access.redeem}</button>
      </div>
      {state.text ? <div className={`notice ${state.kind}`} style={{ marginTop: 10 }}>{state.text}</div> : null}
    </form>
  )
}
