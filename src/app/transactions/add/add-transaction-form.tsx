"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowUpIcon, ArrowDownIcon, Calendar, DollarSign, FileText, Tag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"

// Zod validation schema
const transactionSchema = z.object({
    type: z.enum(["income", "expense"], {
        required_error: "Please select transaction type",
    }),
    amount: z
        .string()
        .min(1, "Amount is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Amount must be a positive number",
        }),
    description: z
        .string()
        .min(2, "Description must be at least 2 characters")
        .max(100, "Description must be less than 100 characters"),
    date: z.string().min(1, "Date is required"),
    category: z.string().min(1, "Category is required"),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface FieldErrors {
    type?: string[]
    amount?: string[]
    description?: string[]
    date?: string[]
    category?: string[]
}

const incomeCategories = ["Salary", "Freelance", "Business", "Investment", "Bonus", "Gift", "Other Income"]

const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Other Expense",
]

export default function AddTransactionForm() {
    const router = useRouter()
    const [formData, setFormData] = useState<TransactionFormData>({
        type: "expense",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
    })
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    const [generalError, setGeneralError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const validateField = (name: keyof TransactionFormData, value: string) => {
        try {
            const fieldSchema = transactionSchema.shape[name]
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
            transactionSchema.parse(formData)
            setFieldErrors({})
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: FieldErrors = {}
                error.errors.forEach((err) => {
                    const field = err.path[0] as keyof TransactionFormData
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        const fieldName = name as keyof TransactionFormData

        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }))

        if (name === "type") {
            setFormData((prev) => ({
                ...prev,
                category: "",
            }))
        }

        setTimeout(() => {
            validateField(fieldName, value)
        }, 300)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setGeneralError(null)
        setLoading(true)

        if (!validateForm()) {
            setLoading(false)
            return
        }

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))

            console.log("Transaction data:", {
                ...formData,
                amount: Number(formData.amount),
            })

            setSuccess(true)
            setTimeout(() => {
                router.push("/transactions")
            }, 2000)
        } catch (error: any) {
            setGeneralError("Failed to add transaction. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        router.back()
    }

    const formatCurrency = (value: string) => {
        const number = value.replace(/\D/g, "")
        return new Intl.NumberFormat("id-ID").format(Number(number))
    }

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "")
        setFormData((prev) => ({
            ...prev,
            amount: value,
        }))

        setTimeout(() => {
            validateField("amount", value)
        }, 300)
    }

    if (success) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 py-8">
                <div className="bg-white border-4 border-slate-800 p-8 shadow-[8px_8px_0px_0px_#64748b] rounded-lg">
                    <div
                        className={`p-6 border-3 rounded-lg inline-block mb-6 ${formData.type === "income" ? "bg-emerald-100 border-emerald-400" : "bg-red-100 border-red-400"
                            }`}
                    >
                        {formData.type === "income" ? (
                            <ArrowUpIcon className="h-12 w-12 text-emerald-600" />
                        ) : (
                            <ArrowDownIcon className="h-12 w-12 text-red-600" />
                        )}
                    </div>

                    <h3 className="font-black text-2xl mb-4 uppercase text-slate-800">Transaction Added</h3>

                    <div className="space-y-2 text-slate-700">
                        <p className="font-bold text-lg">
                            {formData.type === "income" ? "Income" : "Expense"} of Rp {formatCurrency(formData.amount)}
                        </p>
                        <p className="font-medium">has been recorded successfully</p>
                    </div>
                </div>

                <p className="text-slate-600 font-bold uppercase">Redirecting to transactions...</p>
            </motion.div>
        )
    }

    const currentCategories = formData.type === "income" ? incomeCategories : expenseCategories

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-black text-lg uppercase transition-colors duration-100"
            >
                <ArrowLeft className="h-6 w-6" />
                Back
            </button>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
                {generalError && (
                    <div className="bg-red-100 border-4 border-red-400 text-red-800 px-6 py-4 font-bold shadow-[4px_4px_0px_0px_#dc2626] rounded-lg">
                        <span className="font-black uppercase">Error:</span> {generalError}
                    </div>
                )}

                {/* Transaction Type */}
                <div>
                    <label className="block text-lg font-black text-slate-700 uppercase mb-4">Transaction Type</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() =>
                                handleInputChange({
                                    target: { name: "type", value: "income" },
                                } as React.ChangeEvent<HTMLInputElement>)
                            }
                            className={`p-6 border-3 rounded-lg font-bold text-lg uppercase transition-all duration-200 ${formData.type === "income"
                                    ? "border-emerald-400 bg-emerald-100 text-emerald-800 shadow-[6px_6px_0px_0px_#059669]"
                                    : "border-slate-600 bg-white text-slate-700 shadow-[4px_4px_0px_0px_#64748b] hover:shadow-[6px_6px_0px_0px_#64748b]"
                                }`}
                        >
                            <ArrowUpIcon className="h-8 w-8 mx-auto mb-3" />
                            Income
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleInputChange({
                                    target: { name: "type", value: "expense" },
                                } as React.ChangeEvent<HTMLInputElement>)
                            }
                            className={`p-6 border-3 rounded-lg font-bold text-lg uppercase transition-all duration-200 ${formData.type === "expense"
                                    ? "border-red-400 bg-red-100 text-red-800 shadow-[6px_6px_0px_0px_#dc2626]"
                                    : "border-slate-600 bg-white text-slate-700 shadow-[4px_4px_0px_0px_#64748b] hover:shadow-[6px_6px_0px_0px_#64748b]"
                                }`}
                        >
                            <ArrowDownIcon className="h-8 w-8 mx-auto mb-3" />
                            Expense
                        </button>
                    </div>
                    {fieldErrors.type && (
                        <div className="mt-2 bg-red-50 border-2 border-red-300 px-3 py-2 rounded-lg">
                            {fieldErrors.type.map((error, index) => (
                                <p key={index} className="text-red-700 font-bold text-sm uppercase">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Amount Field */}
                <div>
                    <label htmlFor="amount" className="block text-lg font-black text-slate-700 uppercase mb-2">
                        Amount (Rp)
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none">
                            <DollarSign className="h-5 w-5 text-slate-600" />
                        </div>
                        <input
                            id="amount"
                            name="amount"
                            type="text"
                            required
                            value={formData.amount ? formatCurrency(formData.amount) : ""}
                            onChange={handleAmountChange}
                            className={`w-full pl-12 pr-4 py-4 border-3 bg-white text-slate-800 font-bold text-lg shadow-[4px_4px_0px_0px_#64748b] focus:outline-none focus:shadow-[6px_6px_0px_0px_#475569] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-100 rounded-lg ${fieldErrors.amount ? "border-red-400" : "border-slate-800"
                                }`}
                            placeholder="0"
                        />
                    </div>
                    {fieldErrors.amount && (
                        <div className="mt-2 bg-red-50 border-2 border-red-300 px-3 py-2 rounded-lg">
                            {fieldErrors.amount.map((error, index) => (
                                <p key={index} className="text-red-700 font-bold text-sm uppercase">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Description Field */}
                <div>
                    <label htmlFor="description" className="block text-lg font-black text-slate-700 uppercase mb-2">
                        Description
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none">
                            <FileText className="h-5 w-5 text-slate-600" />
                        </div>
                        <input
                            id="description"
                            name="description"
                            type="text"
                            required
                            value={formData.description}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 border-3 bg-white text-slate-800 font-bold text-lg shadow-[4px_4px_0px_0px_#64748b] focus:outline-none focus:shadow-[6px_6px_0px_0px_#475569] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-100 rounded-lg ${fieldErrors.description ? "border-red-400" : "border-slate-800"
                                }`}
                            placeholder="What was this transaction for?"
                        />
                    </div>
                    {fieldErrors.description && (
                        <div className="mt-2 bg-red-50 border-2 border-red-300 px-3 py-2 rounded-lg">
                            {fieldErrors.description.map((error, index) => (
                                <p key={index} className="text-red-700 font-bold text-sm uppercase">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Date Field */}
                <div>
                    <label htmlFor="date" className="block text-lg font-black text-slate-700 uppercase mb-2">
                        Date
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none">
                            <Calendar className="h-5 w-5 text-slate-600" />
                        </div>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            required
                            value={formData.date}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 border-3 bg-white text-slate-800 font-bold text-lg shadow-[4px_4px_0px_0px_#64748b] focus:outline-none focus:shadow-[6px_6px_0px_0px_#475569] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-100 rounded-lg ${fieldErrors.date ? "border-red-400" : "border-slate-800"
                                }`}
                        />
                    </div>
                    {fieldErrors.date && (
                        <div className="mt-2 bg-red-50 border-2 border-red-300 px-3 py-2 rounded-lg">
                            {fieldErrors.date.map((error, index) => (
                                <p key={index} className="text-red-700 font-bold text-sm uppercase">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Category Field */}
                <div>
                    <label htmlFor="category" className="block text-lg font-black text-slate-700 uppercase mb-2">
                        Category
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none">
                            <Tag className="h-5 w-5 text-slate-600" />
                        </div>
                        <select
                            id="category"
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-4 border-3 bg-white text-slate-800 font-bold text-lg shadow-[4px_4px_0px_0px_#64748b] focus:outline-none focus:shadow-[6px_6px_0px_0px_#475569] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-100 rounded-lg ${fieldErrors.category ? "border-red-400" : "border-slate-800"
                                }`}
                        >
                            <option value="">Select a category</option>
                            <AnimatePresence>
                                {currentCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </AnimatePresence>
                        </select>
                    </div>
                    {fieldErrors.category && (
                        <div className="mt-2 bg-red-50 border-2 border-red-300 px-3 py-2 rounded-lg">
                            {fieldErrors.category.map((error, index) => (
                                <p key={index} className="text-red-700 font-bold text-sm uppercase">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading || Object.keys(fieldErrors).some((key) => fieldErrors[key as keyof FieldErrors]?.length)}
                        className={`w-full py-4 px-6 border-3 border-slate-800 font-black text-xl uppercase tracking-wide transition-all duration-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${formData.type === "income"
                                ? "bg-emerald-200 hover:bg-emerald-300 shadow-[6px_6px_0px_0px_#475569] active:translate-x-1 active:translate-y-1 active:shadow-none"
                                : "bg-red-200 hover:bg-red-300 shadow-[6px_6px_0px_0px_#475569] active:translate-x-1 active:translate-y-1 active:shadow-none"
                            } text-slate-800`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-800 border-t-transparent"></div>
                                Adding...
                            </div>
                        ) : (
                            `Add ${formData.type === "income" ? "Income" : "Expense"}`
                        )}
                    </button>
                </div>
            </form>

            {/* Footer */}
            <div className="text-center pt-4">
                <p className="text-slate-600 font-bold text-sm uppercase">Track • Manage • Grow</p>
            </div>
        </div>
    )
}
