'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getDict, type Locale } from '@/i18n/dict'

export function AuthForms({ locale, next }: { locale: Locale; next: string }) {
  const t = getDict(locale)
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const f = new FormData(e.currentTarget)
    const email = String(f.get('email'))
    const password = String(f.get('password'))
    try {
      if (mode === 'register') {
        const r = await fetch('/api/users', {
          method: 'POST',
          credentials: 'include',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email, password, name: f.get('name'), locale }),
        })
        if (!r.ok) {
          const d = await r.json().catch(() => ({}))
          throw new Error(d?.errors?.[0]?.data?.errors?.[0]?.message || d?.errors?.[0]?.message || t.auth.error)
        }
      }
      const r = await fetch('/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!r.ok) throw new Error(t.auth.error)
      router.push(next)
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <h1>{mode === 'login' ? t.auth.login : t.auth.register}</h1>
      <form onSubmit={submit}>
        {mode === 'register' ? (
          <div className="field"><label htmlFor="name">{t.auth.name}</label><input id="name" name="name" autoComplete="name" /></div>
        ) : null}
        <div className="field"><label htmlFor="email">{t.auth.email}</label><input id="email" name="email" type="email" required autoComplete="email" /></div>
        <div className="field">
          <label htmlFor="password">{t.auth.password}</label>
          <input id="password" name="password" type="password" required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
        </div>
        {error ? <div className="notice err" style={{ marginBottom: 12 }}>{error}</div> : null}
        <button className="btn" disabled={busy}>{mode === 'login' ? t.auth.submitLogin : t.auth.submitRegister}</button>
      </form>
      <p style={{ marginTop: 18 }}>
        <button
          className="btn ghost small"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError('')
          }}
        >
          {mode === 'login' ? t.auth.noAccount : t.auth.haveAccount}
        </button>
      </p>
    </div>
  )
}

export function LogoutButton({ locale }: { locale: Locale }) {
  const router = useRouter()
  return (
    <button
      className="btn ghost"
      onClick={async () => {
        await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
        router.push(`/${locale}`)
        router.refresh()
      }}
    >
      {getDict(locale).auth.logout}
    </button>
  )
}
