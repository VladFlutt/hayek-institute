'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function LangSwitch({ locale }: { locale: string }) {
  const path = usePathname() || `/${locale}`
  const to = (l: string) => path.replace(/^\/(ru|en)(?=\/|$)/, `/${l}`)
  const set = (l: string) => {
    document.cookie = `locale=${l};path=/;max-age=31536000`
  }
  return (
    <span className="lang" role="group" aria-label="Language">
      <Link href={to('ru')} className={locale === 'ru' ? 'on' : ''} onClick={() => set('ru')}>RU</Link>
      <Link href={to('en')} className={locale === 'en' ? 'on' : ''} onClick={() => set('en')}>EN</Link>
    </span>
  )
}

export function MenuToggle() {
  return (
    <button
      className="menu-toggle"
      aria-controls="site-nav"
      aria-label="Menu"
      onClick={() => document.getElementById('site-nav')?.classList.toggle('open')}
    >
      ☰
    </button>
  )
}
