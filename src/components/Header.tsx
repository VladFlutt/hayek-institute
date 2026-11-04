import Link from 'next/link'
import { getUser } from '@/lib/server'
import { getDict, type Locale } from '@/i18n/dict'
import { Logo } from './Logo'
import { LangSwitch, MenuToggle } from './HeaderClient'

export async function Header({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const user = await getUser()
  const staff = user && user.role !== 'student'
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href={`/${locale}`} className="brand">
          <Logo />
          <span>{t.school}</span>
        </Link>
        <MenuToggle />
        <nav className="nav" id="site-nav">
          <Link href={`/${locale}#program`}>{t.nav.courses}</Link>
          <Link href={`/${locale}/library`}>{t.nav.library}</Link>
          <Link href={`/${locale}/glossary`}>{t.nav.glossary}</Link>
          <Link href={`/${locale}/tutor`}>{t.nav.tutor}</Link>
          {staff ? <a href="/admin">{t.nav.admin}</a> : null}
          <Link href={`/${locale}/account`}>{user ? t.nav.account : t.nav.login}</Link>
          <LangSwitch locale={locale} />
        </nav>
      </div>
    </header>
  )
}
