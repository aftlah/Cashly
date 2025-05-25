// import { createServerClient, type CookieOptions } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export function createClient(request: NextRequest) {
//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   })

//   return {
//     supabase: createServerClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       {
//         cookies: {
//           get(name: string) {
//             return request.cookies.get(name)?.value
//           },
//           set(name: string, value: string, options: CookieOptions) {
//             response.cookies.set({
//               name,
//               value,
//               ...options,
//             })
//           },
//           remove(name: string, options: CookieOptions) {
//             response.cookies.set({
//               name,
//               value: '',
//               ...options,
//             })
//           },
//         },
//       }
//     ),
//     response
//   }
// } 

// lib/supabase/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { type NextRequest, NextResponse } from 'next/server';

export function createClient(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  return { supabase, response: res };
}
