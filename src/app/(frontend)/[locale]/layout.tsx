import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'
import { Header } from '@/components/Header'
import { getDict, isLocale, LOCALES } from '@/i18n/dict'
import './globals.css'

const serif = Cormorant_Garamond({ subsets: ['latin', 'cyrillic'], weight: ['500', '600', '700'], variable: '--font-serif' })
const sans = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-sans' })

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = getDict(isLocale(locale) ? locale : 'ru')
  return {
    title: { default: t.school, template: `%s — ${t.school}` },
    description: t.motto,
    alternates: { languages: { ru: '/ru', en: '/en' } },
  }
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Header locale={locale} />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <span>© {new Date().getFullYear()} {t.school}</span>
            <span>{t.footer}</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
