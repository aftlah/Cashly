import { createClient } from '@/lib/supabase/server';
import { DashboardPage } from "@/components/Dashboard";
import { Layouts } from '@/components/Layouts';

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();


  return (
      <DashboardPage />
  )
}
