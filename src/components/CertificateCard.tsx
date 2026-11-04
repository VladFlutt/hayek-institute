import { Logo } from '@/components/Logo'
import { getDict, type Locale } from '@/i18n/dict'

export function CertificateCard({ locale, name, course, teacher, issuedAt, code }: { locale: Locale; name: string; course: string; teacher?: string | null; issuedAt: string; code: string }) {
  const t = getDict(locale)
  const date = new Date(issuedAt).toLocaleDateString(locale === 'en' ? 'en-GB' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  return (
    <div className="certificate">
      <div className="cert-inner">
        <div className="cert-logo"><Logo /></div>
        <div className="eyebrow">{t.school}</div>
        <h1 className="cert-title">{t.cert.title}</h1>
        <p className="cert-muted">{t.cert.certifies}</p>
        <p className="cert-name serif">{name}</p>
        <p className="cert-muted">{t.cert.completed}</p>
        <p className="cert-course serif">«{course}»</p>
        <div className="cert-meta">
          {teacher ? <span>{t.cert.teacher}: <b>{teacher}</b></span> : null}
          <span>{t.cert.issued}: <b>{date}</b></span>
          <span>{t.cert.number}: <b>{code}</b></span>
        </div>
        <p className="cert-verify">{t.cert.verifyAt}: {base}/{locale}/verify?code={code}</p>
      </div>
    </div>
  )
}
