// lib/supabase/client.ts
// import { createBrowserClient } from '@supabase/ssr'

// export function createClient() {
//   return createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )
// } 

'use client'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export function createClient() {
  return createPagesBrowserClient()
}
