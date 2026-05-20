import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/') {
    const lang = request.headers.get('accept-language') ?? ''
    const locale = lang.includes('ko') ? 'kr' : 'en'
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }
}

export const config = {
  matcher: ['/'],
}
