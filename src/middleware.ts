import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not /auth/login,
  // redirect the user to /auth/login
  if (!session && request.nextUrl.pathname !== '/auth/login') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If user is signed in and the current path is /auth/login,
  // redirect the user to /
  if (session && request.nextUrl.pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}