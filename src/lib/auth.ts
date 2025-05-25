import { createClient } from './supabase/server'


export async function getUserFromCookies() {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return user
}
