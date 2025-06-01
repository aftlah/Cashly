"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Cookies from "js-cookie"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()

      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        throw loginError
      }

      const user = loginData.user

      const { data: profileData, error: fetchError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single()

      if (fetchError) {
        throw new Error("Failed to fetch username: " + fetchError.message)
      }

      Cookies.set("username", profileData.username, { expires: 3, path: "/" })
      Cookies.set("userId", user.id, { expires: 3, path: "/" })
      Cookies.set("isNewUser", "false", { expires: 3, path: "/" })

      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = () => {
    router.push("/auth/register")
  }

  return (
    <div className="space-y-6">
      {/* Login Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 border-4 border-red-400 text-red-800 px-6 py-4 font-bold shadow-[4px_4px_0px_0px_#dc2626]">
            <span className="font-black uppercase">Error:</span> {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-lg font-black text-slate-700 uppercase mb-2">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-4 border-4 border-slate-800 bg-white text-slate-800 font-bold text-lg shadow-[4px_4px_0px_0px_#64748b] focus:outline-none focus:shadow-[6px_6px_0px_0px_#475569] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-100"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-lg font-black text-slate-700 uppercase mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-4 border-4 border-slate-800 bg-white text-slate-800 font-bold text-lg shadow-[4px_4px_0px_0px_#64748b] focus:outline-none focus:shadow-[6px_6px_0px_0px_#475569] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-100"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 border-4 border-slate-800 bg-emerald-200 hover:bg-emerald-300 active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[6px_6px_0px_0px_#475569] text-slate-800 font-black text-xl uppercase tracking-wide transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="w-full py-4 px-6 border-4 border-slate-800 bg-blue-200 hover:bg-blue-300 active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[6px_6px_0px_0px_#64748b] text-slate-800 font-black text-xl uppercase tracking-wide transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Account
          </button>
        </div>
      </form>

      {/* Footer Text */}
      <div className="text-center">
        <p className="text-slate-600 font-bold text-sm uppercase">Secure • Fast • Reliable</p>
      </div>
    </div>
  )
}
