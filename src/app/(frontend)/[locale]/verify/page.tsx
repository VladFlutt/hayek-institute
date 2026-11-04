import { getDict, type Locale } from '@/i18n/dict'
import { normalizeCertCode } from '@/lib/certificates'
import { getPayloadClient } from '@/lib/server'

export const dynamic = 'force-dynamic'

type P = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ code?: string }> }

export async function generateMetadata({ params }: P) {
  const { locale } = await params
  return { title: getDict(locale).cert.verifyTitle }
}

export default async function VerifyPage({ params, searchParams }: P) {
  const { locale } = await params
  const t = getDict(locale)
  const raw = (await searchParams).code
  const code = raw ? normalizeCertCode(String(raw)).slice(0, 40) : ''
  let result: { name: string; course: string; teacher?: string | null; issuedAt: string } | null = null
  if (code) {
    const payload = await getPayloadClient()
    const cert = (await payload.find({ collection: 'certificates', where: { code: { equals: code } }, limit: 1, depth: 1, locale, overrideAccess: true })).docs[0]
    if (cert) {
      const c = typeof cert.course === 'object' ? cert.course : null
      result = { name: cert.name, course: c?.title ?? '', teacher: c?.teacher, issuedAt: cert.issuedAt }
    }
  }
  const date = (s: string) => new Date(s).toLocaleDateString(locale === 'en' ? 'en-GB' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <div className="wrap narrow" style={{ padding: '40px 20px', maxWidth: 560 }}>
      <h1>{t.cert.verifyTitle}</h1>
      <p className="muted">{t.cert.verifyLead}</p>
      <form method="get" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input name="code" defaultValue={code} placeholder="HI-XXXX-XXXX" style={{ flex: 1, minWidth: 200 }} aria-label={t.cert.number} />
        <button className="btn">{t.cert.verifyBtn}</button>
      </form>
      {code ? (
        result ? (
          <div className="side-box" style={{ marginTop: 20 }}>
            <b style={{ color: 'var(--ok)' }}>✓ {t.cert.valid}</b>
            <p style={{ margin: '8px 0 0' }}><b>{result.name}</b> — «{result.course}»</p>
            <p className="faint" style={{ margin: '4px 0 0' }}>{t.cert.issued}: {date(result.issuedAt)} · {t.cert.number}: {code}</p>
          </div>
        ) : (
          <div className="notice" style={{ marginTop: 20 }}>{t.cert.invalid}</div>
        )
      ) : null}
    </div>
  )
}
