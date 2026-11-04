'use client'
import Link from 'next/link'
import { marked } from 'marked'
import { useEffect, useRef, useState } from 'react'
import { getDict, type Locale } from '@/i18n/dict'

type Msg = { role: 'user' | 'assistant'; content: string }
const MODES = ['explain', 'check', 'socratic', 'exam'] as const

const ERR: Record<string, { ru: string; en: string }> = {
  limit: { ru: 'Дневной лимит сообщений исчерпан. Возвращайтесь завтра.', en: 'Daily message limit reached. Come back tomorrow.' },
  provider: { ru: 'Сервис ИИ сейчас недоступен. Попробуйте позже.', en: 'The AI service is unavailable right now. Try again later.' },
  disabled: { ru: 'Наставник временно выключен.', en: 'The tutor is temporarily disabled.' },
  login: { ru: 'Войдите, чтобы говорить с наставником.', en: 'Sign in to talk to the tutor.' },
}

export function TutorChat({ locale, loggedIn, lessonId, compact = false }: { locale: Locale; loggedIn: boolean; lessonId?: number | string; compact?: boolean }) {
  const t = getDict(locale)
  const [mode, setMode] = useState<(typeof MODES)[number]>('explain')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const log = useRef<HTMLDivElement>(null)

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight })
  }, [msgs])

  if (!loggedIn) {
    return (
      <div className="notice">
        {t.tutor.needLogin} <Link href={`/${locale}/account`}>{t.nav.login} →</Link>
      </div>
    )
  }

  async function send(text: string) {
    const q = text.trim()
    if (!q || busy) return
    const history: Msg[] = [...msgs, { role: 'user', content: q }]
    setMsgs([...history, { role: 'assistant', content: '' }])
    setInput('')
    setBusy(true)
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history, mode, lessonId, locale }),
      })
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}))
        throw new Error((ERR[data.error] ?? ERR.provider)[locale])
      }
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let acc = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acc += dec.decode(value, { stream: true })
        setMsgs([...history, { role: 'assistant', content: acc }])
      }
    } catch (e) {
      setMsgs([...history, { role: 'assistant', content: `⚠ ${(e as Error).message}` }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="chat" style={compact ? { minHeight: 300 } : undefined}>
      <div className="modes" role="tablist">
        {MODES.map((m) => (
          <button key={m} className={m === mode ? 'on' : ''} onClick={() => setMode(m)} role="tab" aria-selected={m === mode}>
            {t.tutor.modes[m]}
          </button>
        ))}
      </div>
      <div className="chat-log" ref={log} style={compact ? { maxHeight: 380 } : undefined}>
        {msgs.length === 0 ? (
          <div className="chips">
            {t.tutor.examples.map((ex) => (
              <button key={ex} onClick={() => send(ex)}>{ex}</button>
            ))}
          </div>
        ) : (
          msgs.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="msg user">{m.content}</div>
            ) : (
              <div
                key={i}
                className="msg assistant prose"
                dangerouslySetInnerHTML={{ __html: m.content ? (marked.parse(m.content, { async: false }) as string) : `<span class="faint">${t.tutor.thinking}</span>` }}
              />
            ),
          )
        )}
      </div>
      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <textarea
          value={input}
          rows={compact ? 2 : 2}
          placeholder={t.tutor.placeholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send(input)
            }
          }}
        />
        <button className="btn" disabled={busy || !input.trim()}>{t.tutor.send}</button>
      </form>
      <div className="faint" style={{ padding: '0 12px 10px', fontSize: '0.78rem' }}>{t.tutor.disclaimer}</div>
    </div>
  )
}
