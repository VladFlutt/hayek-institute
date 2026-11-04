import { getDict, type Locale } from '@/i18n/dict'
import { getPayloadClient } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  return { title: getDict(locale).glossary.title }
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = getDict(locale)
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'glossary', locale, sort: 'term', limit: 500, depth: 0 })
  return (
    <div className="wrap narrow" style={{ padding: '40px 20px' }}>
      <h1>{t.glossary.title}</h1>
      <p className="muted">{t.glossary.lead}</p>
      <dl>
        {docs.map((d) => (
          <div key={d.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--rule)' }}>
            <dt className="serif" style={{ fontSize: '1.3rem', fontWeight: 600 }}>{d.term}</dt>
            <dd style={{ margin: '4px 0 0' }}>
              {d.definition}
              {d.source ? <span className="faint"> — {d.source}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
