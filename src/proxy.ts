import { NextResponse, type NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/') {
    const cookie = req.cookies.get('locale')?.value
    const accept = req.headers.get('accept-language') || ''
    const locale = cookie === 'en' || cookie === 'ru' ? cookie : /^\s*en/i.test(accept) ? 'en' : 'ru'
    return NextResponse.redirect(new URL(`/${locale}`, req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/'] }
