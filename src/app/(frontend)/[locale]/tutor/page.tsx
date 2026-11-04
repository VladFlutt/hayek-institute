import { TutorChat } from '@/components/TutorChat'
import { getDict, type Locale } from '@/i18n/dict'
import { getUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  return { title: getDict(locale).tutor.title }
}

export default async function TutorPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = getDict(locale)
  const user = await getUser()
  return (
    <div className="wrap narrow" style={{ padding: '40px 20px' }}>
      <div className="eyebrow">{t.school}</div>
      <h1>{t.tutor.title}</h1>
      <p className="muted">{t.tutor.lead}</p>
      <TutorChat locale={locale} loggedIn={Boolean(user)} />
    </div>
  )
}
