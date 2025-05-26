"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft } from "lucide-react"
import { z } from "zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Zod validation schema
const registerBaseSchema = z.object({
    username: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
    // password: z
    //     .string()
    //     .min(6, "Password must be at least 6 characters")
    //     .max(100, "Password must be less than 100 characters")
    //     .regex(
    //         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    //         "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    //     ),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must be less than 100 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
})

const registerSchema = registerBaseSchema.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

interface FieldErrors {
    username?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
}

export default function RegisterForm() {
    const router = useRouter()
    const [formData, setFormData] = useState<RegisterFormData>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    const [generalError, setGeneralError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const validateField = (name: keyof RegisterFormData, value: string) => {
        try {
            // Gunakan base schema untuk pick
            const fieldSchema = registerBaseSchema.shape[name]
            z.object({ [name]: fieldSchema }).parse({ [name]: value })

            setFieldErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }))
        } catch (error) {
            if (error instanceof z.ZodError) {
                setFieldErrors((prev) => ({
                    ...prev,
                    [name]: error.errors.map((err) => err.message),
                }))
            }
        }
    }

    const validateForm = (): boolean => {
        try {
            registerSchema.parse(formData)
            setFieldErrors({})
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: FieldErrors = {}
                error.errors.forEach((err) => {
                    const field = err.path[0] as keyof RegisterFormData
                    if (!errors[field]) {
                        errors[field] = []
                    }
                    errors[field]!.push(err.message)
                })
                setFieldErrors(errors)
            }
            return false
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const fieldName = name as keyof RegisterFormData

        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }))

        // Validate field on change (debounced validation)
        setTimeout(() => {
            validateField(fieldName, value)
        }, 300)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setGeneralError(null)
        setLoading(true)

        // Validate entire form
        if (!validateForm()) {
            setLoading(false)
            return
        }

        try {
            const supabase = createClientComponentClient()
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            })

            if (!error) {
                const { error: profileError } = await supabase
                    .from("profiles")
                    .insert([{ email: formData.email, username: formData.username }]);

                if (profileError) {
                    throw profileError;
                }
            }

            if (error) {
                throw error
            }

            setSuccess(true)
            setTimeout(() => {
                router.push("/auth/login")
            }, 2000)
        } catch (error: any) {
            setGeneralError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleBackToLogin = () => {
        router.push("/auth/login")
    }

    if (success) {
        return (
            <div className="text-center space-y-6">
                <div className="bg-emerald-100 border-4 border-emerald-400 text-emerald-800 px-6 py-6 font-black shadow-[6px_6px_0px_0px_#059669]">
                    <h3 className="font-black text-2xl mb-3 uppercase">SUCCESS!</h3>
                    <p className="font-bold text-lg">Check your email to verify your account!</p>
                </div>
                <p className="text-slate-600 font-bold text-lg uppercase">Redirecting to login...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Back to Login */}
            <button
                type="button"
                onClick={handleBackToLogin}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-black text-lg uppercase transition-colors duration-100"
            >
                <ArrowLeft className="h-6 w-6" />
                Back to Login
            </button>

            {/* Register Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
                {generalError && (
                    <div className="bg-red-100 border-4 border-red-400 text-red-800 px-6 py-4 font-bold shadow-[4px_4px_0px_0px_#dc2626]">
                        <span className="font-black uppercase">Error:</span> {generalError}
                    </div>
                )}

                {/* Username Field */}
                <div>
                    <label htmlFor="username" className="block text-lg font-black text-slate-700 uppercase mb-2">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 border-4 bg-white text-slate-800 font-bold text-lg shadow-[4px_4px_0px_0px_#64748b] focus:outline-none focus:shadow-[6px_6px_0px_0px_#475569] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-100 ${fieldErrors.username ? "border-red-400" : "border-slate-800"
                            }`}
                        placeholder="Your Username"
                    />
                    {fieldErrors.username && (
                        <div className="mt-2 bg-red-50 border-2 border-red-300 px-3 py-2">
                            {fieldErrors.username.map((error, index) => (
                                <p key={index} className="text-red-700 font-bold text-sm uppercase">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Email Field */}
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
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 border-4 bg-white text-slate-800 font-bold text-lg shadow-[4px_4px_0px_0px_#64748b] focus:outline-none focus:shadow-[6px_6px_0px_0px_#475569] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-100 ${fieldErrors.email ? "border-red-400" : "border-slate-800"
                            }`}
                        placeholder="your@email.com"
                    />
                    {fieldErrors.email && (
                        <div className="mt-2 bg-red-50 border-2 border-red-300 px-3 py-2">
                            {fieldErrors.email.map((error, index) => (
                                <p key={index} className="text-red-700 font-bold text-sm uppercase">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-lg font-black text-slate-700 uppercase mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 border-4 bg-white text-slate-800 font-bold text-lg shadow-[4px_4px_0px_0px_#64748b] focus:outline-none focus:shadow-[6px_6px_0px_0px_#475569] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-100 ${fieldErrors.password ? "border-red-400" : "border-slate-800"
                            }`}
                        placeholder="••••••••"
                    />
                    {fieldErrors.password && (
                        <div className="mt-2 bg-red-50 border-2 border-red-300 px-3 py-2">
                            {fieldErrors.password.map((error, index) => (
                                <p key={index} className="text-red-700 font-bold text-sm uppercase">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                    {/* {!fieldErrors.password && (
                        <p className="text-slate-600 font-bold text-sm mt-2 uppercase">
                            Must contain: Uppercase, lowercase, number!
                        </p>
                    )} */}
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-lg font-black text-slate-700 uppercase mb-2">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-4 border-4 bg-white text-slate-800 font-bold text-lg shadow-[4px_4px_0px_0px_#64748b] focus:outline-none focus:shadow-[6px_6px_0px_0px_#475569] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-100 ${fieldErrors.confirmPassword ? "border-red-400" : "border-slate-800"
                            }`}
                        placeholder="••••••••"
                    />
                    {fieldErrors.confirmPassword && (
                        <div className="mt-2 bg-red-50 border-2 border-red-300 px-3 py-2">
                            {fieldErrors.confirmPassword.map((error, index) => (
                                <p key={index} className="text-red-700 font-bold text-sm uppercase">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                    {!fieldErrors.confirmPassword && (
                        <p className="text-slate-600 font-bold text-sm mt-2 uppercase">
                            Please confirm your password!
                        </p>
                    )}
                </div>
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || Object.keys(fieldErrors).some((key) => fieldErrors[key as keyof FieldErrors]?.length)}
                        className="w-full py-4 px-6 border-4 border-slate-800 bg-emerald-200 hover:bg-emerald-300 active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[6px_6px_0px_0px_#475569] text-slate-800 font-black text-xl uppercase tracking-wide transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                </div>
            </form>

            {/* Footer */}
            <div className="text-center pt-4">
                <p className="text-slate-600 font-bold text-sm uppercase">Secure • Fast • Reliable</p>
            </div>
        </div>
    )
}
