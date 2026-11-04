import { ResetForm } from '@/components/AuthForms'
import { getDict, type Locale } from '@/i18n/dict'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  return { title: getDict(locale).auth.resetTitle, robots: { index: false } }
}

export default async function ResetPage({ params, searchParams }: { params: Promise<{ locale: Locale }>; searchParams: Promise<{ token?: string }> }) {
  const { locale } = await params
  const { token } = await searchParams
  return (
    <div className="wrap" style={{ padding: '40px 20px', maxWidth: 460 }}>
      <ResetForm locale={locale} token={token || ''} />
    </div>
  )
}
