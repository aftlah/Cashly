import Image from "next/image";
import { createClient } from '@/lib/supabase/server';
import { getUserFromCookies } from "@/lib/auth";
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  console.log('Current user:', data)

  // const user = await getUserFromCookies();
  // console.log('Current user:', user);

  return (
    <div>
      <h1>Home</h1>
      <LogoutButton />
    </div>
  )
}
