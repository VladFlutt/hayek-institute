import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { CertificateCard } from '@/components/CertificateCard'
import { PrintButton } from '@/components/PrintButton'
import { getDict, type Locale } from '@/i18n/dict'
import { getOrIssueCertificate } from '@/lib/certificates'
import { getPayloadClient, getUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

type P = { params: Promise<{ locale: Locale; course: string }> }

export async function generateMetadata({ params }: P) {
  const { locale } = await params
  return { title: getDict(locale).cert.title, robots: { index: false } }
}

export default async function CertificatePage({ params }: P) {
  const { locale, course: slug } = await params
  const t = getDict(locale)
  const user = await getUser()
  if (!user) redirect(`/${locale}/account?next=${encodeURIComponent(`/${locale}/courses/${slug}/certificate`)}`)
  const payload = await getPayloadClient()
  const course = (await payload.find({ collection: 'courses', locale, where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]
  if (!course) notFound()

  const { cert, progress } = await getOrIssueCertificate(payload, user, course.id)
  const back = <Link href={`/${locale}/courses/${course.slug}`} className="faint">← {course.title}</Link>

  if (!cert) {
    return (
      <div className="wrap narrow" style={{ padding: '40px 20px' }}>
        {back}
        <h1 style={{ marginTop: 14 }}>{t.cert.title}</h1>
        <p>{t.cert.notYet}</p>
        {progress ? <p className="muted">{t.cert.progress} {progress.completed} {t.cert.of} {progress.total}</p> : null}
        <p className="faint">{t.cert.nameHint}</p>
      </div>
    )
  }

  return (
    <div className="wrap" style={{ padding: '28px 20px 40px' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
        {back}
        <PrintButton label={t.cert.print} />
      </div>
      <CertificateCard locale={locale} name={cert.name} course={course.title} teacher={course.teacher} issuedAt={cert.issuedAt} code={cert.code} />
    </div>
  )
}
