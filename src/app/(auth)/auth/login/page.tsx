import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import LoginForm from "./login-form"
import Image from "next/image"

export default async function LoginPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-2 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border-4 border-slate-800 p-3 shadow-[8px_8px_0px_0px_#64748b] mb-8">
          <div className="flex justify-center items-center my-4">
          <Image src="/logo-cashly.png" alt="Cashly Logo" width={250} height={60} />
          </div>
          <h2 className="text-center text-4xl font-black text-slate-800 uppercase tracking-tight">Welcome Back</h2>
          <p className="text-center text-lg font-bold text-slate-600 mt-2">Sign in to your account!</p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border-4 border-slate-800 shadow-[12px_12px_0px_0px_#475569] p-7">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
