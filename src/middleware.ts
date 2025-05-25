import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  let pathName = ['/auth/login', '/auth/register', '/auth/callback']

  if (!session && !pathName.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (session && pathName.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // if (session && request.nextUrl.pathname === '/') {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
