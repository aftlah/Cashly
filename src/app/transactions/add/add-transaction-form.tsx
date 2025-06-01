"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowUpIcon,
  ArrowDownIcon,
  Calendar,
  DollarSign,
  FileText,
  Tag,
  Loader2,
  CheckCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import Cookies from "js-cookie"
import { createTransaction, type NewTransactionPayload } from "@/lib/service/Transaction"
import { useQueryClient } from "@tanstack/react-query"

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
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<TransactionFormData>({
    type: "expense",
    amount: "",
    description: "",
    date: "",
    category: "",
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: new Date().toISOString().split("T")[0],
    }))
  }, [])

  const validateField = (name: keyof TransactionFormData, value: string) => {
    try {
      const fieldSchema = transactionSchema.shape[name]
      z.object({ [name]: fieldSchema }).parse({ [name]: value })
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
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
      setFieldErrors((prev) => ({ ...prev, category: undefined }))
    }

    const timer = setTimeout(() => {
      validateField(fieldName, value)
    }, 300)
    return () => clearTimeout(timer)
  }

  const formatCurrency = (value: string) => {
    if (!value) return ""
    const number = value.replace(/\D/g, "")
    return new Intl.NumberFormat("id-ID").format(Number(number))
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    setFormData((prev) => ({
      ...prev,
      amount: rawValue,
    }))

    const timer = setTimeout(() => {
      validateField("amount", rawValue)
    }, 300)
    return () => clearTimeout(timer)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)
    const userId = Cookies.get("userId")

    if (!userId) {
      setGeneralError("User not authenticated. Please log in again.")
      setLoading(false)
      return
    }

    try {
      const transactionPayload: NewTransactionPayload = {
        user_id: userId,
        type: formData.type,
        amount: Number(formData.amount),
        description: formData.description,
        date: formData.date,
        category: formData.category,
      }

      const newTransaction = await createTransaction(transactionPayload)

      console.log("Transaction data successfully added:", newTransaction)

      await queryClient.invalidateQueries({ queryKey: ["transactions", userId] })
      await queryClient.invalidateQueries({ queryKey: ["dashboardData", userId] })

      setSuccess(true)
      setTimeout(() => {
        router.push("/transactions")
      }, 2000)
    } catch (error: any) {
      console.error("Error adding transaction:", error)
      setGeneralError(error.message || "Failed to add transaction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[calc(100vh-150px)] flex flex-col justify-center items-center text-center space-y-8 py-8 px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="border-2 border-black bg-emerald-300 p-8 rounded-lg shadow-[6px_6px_0px_0px_#000]"
        >
          <CheckCircle className="h-16 w-16 text-emerald-800 mx-auto" />
        </motion.div>

        <div className="space-y-4 border-2 border-black bg-white p-8 rounded-lg shadow-[6px_6px_0px_0px_#000]">
          <h3 className="font-bold text-2xl text-slate-800 tracking-wide">Transaction Added!</h3>
          <div className="space-y-2 text-slate-700">
            <p className="text-lg font-bold">
              {formData.type === "income" ? "Income" : "Expense"} of Rp {formatCurrency(formData.amount)}
            </p>
            <p className="text-sm font-medium">has been recorded successfully.</p>
          </div>
        </div>

        <div className="flex items-center justify-center text-slate-600 font-bold border-2 border-black bg-white px-4 py-2 rounded-md shadow-[4px_4px_0px_0px_#000]">
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
          Redirecting...
        </div>
      </motion.div>
    )
  }

  const currentCategories = formData.type === "income" ? incomeCategories : expenseCategories

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-6">
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center gap-2 text-slate-700 hover:text-black font-bold text-sm transition-colors duration-200 mb-8 group border-2 border-black bg-white px-3 py-2 rounded-md shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="text-center mb-10 border-2 border-black bg-white p-6 rounded-lg shadow-[5px_5px_0px_0px_#000]">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Add New Transaction</h1>
        <p className="text-slate-600 font-medium">Record your income or expense</p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit} noValidate>
        <AnimatePresence>
          {generalError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-100 border-2 border-black text-red-800 px-4 py-3 rounded-lg shadow-[4px_4px_0px_0px_#000] font-bold"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-bold">Error</h3>
                  <p className="text-sm mt-1">{generalError}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction Type */}
        <div className="space-y-4 border-2 border-black bg-white p-6 rounded-lg shadow-[4px_4px_0px_0px_#000]">
          <label className="block text-sm font-bold text-slate-800">Transaction Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() =>
                handleInputChange({
                  target: { name: "type", value: "income" },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              className={`flex flex-col items-center justify-center p-6 border-2 border-black rounded-lg font-bold transition-all duration-200 ${formData.type === "income"
                  ? "bg-emerald-200 text-emerald-800 shadow-[4px_4px_0px_0px_#000] translate-x-[1px] translate-y-[1px]"
                  : "bg-white text-slate-700 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]"
                }`}
            >
              <ArrowUpIcon className="h-7 w-7 mb-2" />
              Income
            </button>

            <button
              type="button"
              onClick={() =>
                handleInputChange({
                  target: { name: "type", value: "expense" },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              className={`flex flex-col items-center justify-center p-6 border-2 border-black rounded-lg font-bold transition-all duration-200 ${formData.type === "expense"
                  ? "bg-rose-200 text-rose-800 shadow-[4px_4px_0px_0px_#000] translate-x-[1px] translate-y-[1px]"
                  : "bg-white text-slate-700 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]"
                }`}
            >
              <ArrowDownIcon className="h-7 w-7 mb-2" />
              Expense
            </button>
          </div>
          {fieldErrors.type && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-red-800 text-sm bg-red-100 border-2 border-black px-3 py-2 rounded-md shadow-[2px_2px_0px_0px_#000] font-medium"
            >
              {fieldErrors.type.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </motion.div>
          )}
        </div>

        {/* Amount Field */}
        <div className="space-y-4 border-2 border-black bg-white p-6 rounded-lg shadow-[4px_4px_0px_0px_#000]">
          <label htmlFor="amount" className="block text-sm font-bold text-slate-800">
            Amount (Rp)
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <span className="h-6 w-6 text-slate-600 font-bold text-lg">IDR</span>
            </div>
            <input
              id="amount"
              name="amount"
              type="text"
              value={formatCurrency(formData.amount)}
              onChange={handleAmountChange}
              className={`w-full pl-14 pr-4 py-4 border-2 border-black bg-white text-slate-800 font-bold text-lg rounded-md transition-all duration-200 focus:outline-none shadow-[3px_3px_0px_0px_#000] focus:shadow-[1px_1px_0px_0px_#000] focus:translate-x-[2px] focus:translate-y-[2px] ${fieldErrors.amount ? "bg-red-50" : ""
                }`}
              placeholder="0"
            />
          </div>
          {fieldErrors.amount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-red-800 text-sm bg-red-100 border-2 border-black px-3 py-2 rounded-md shadow-[2px_2px_0px_0px_#000] font-medium"
            >
              {fieldErrors.amount.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </motion.div>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-4 border-2 border-black bg-white p-6 rounded-lg shadow-[4px_4px_0px_0px_#000]">
          <label htmlFor="description" className="block text-sm font-bold text-slate-800">
            Description
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <FileText className="h-6 w-6 text-slate-600" />
            </div>
            <input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full pl-14 pr-4 py-4 border-2 border-black bg-white text-slate-800 font-bold rounded-md transition-all duration-200 focus:outline-none shadow-[3px_3px_0px_0px_#000] focus:shadow-[1px_1px_0px_0px_#000] focus:translate-x-[2px] focus:translate-y-[2px] ${fieldErrors.description ? "bg-red-50" : ""
                }`}
              placeholder="e.g., Lunch with client"
            />
          </div>
          {fieldErrors.description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-red-800 text-sm bg-red-100 border-2 border-black px-3 py-2 rounded-md shadow-[2px_2px_0px_0px_#000] font-medium"
            >
              {fieldErrors.description.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Field */}
          <div className="space-y-4 border-2 border-black bg-white p-6 rounded-lg shadow-[4px_4px_0px_0px_#000]">
            <label htmlFor="date" className="block text-sm font-bold text-slate-800">
              Date
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Calendar className="h-6 w-6 text-slate-600" />
              </div>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full pl-14 pr-4 py-4 border-2 border-black bg-white text-slate-800 font-bold rounded-md transition-all duration-200 focus:outline-none shadow-[3px_3px_0px_0px_#000] focus:shadow-[1px_1px_0px_0px_#000] focus:translate-x-[2px] focus:translate-y-[2px] ${fieldErrors.date ? "bg-red-50" : ""
                  }`}
              />
            </div>
            {fieldErrors.date && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-800 text-sm bg-red-100 border-2 border-black px-3 py-2 rounded-md shadow-[2px_2px_0px_0px_#000] font-medium"
              >
                {fieldErrors.date.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </motion.div>
            )}
          </div>

          {/* Category Field */}
          <div className="space-y-4 border-2 border-black bg-white p-6 rounded-lg shadow-[4px_4px_0px_0px_#000]">
            <label htmlFor="category" className="block text-sm font-bold text-slate-800">
              Category
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Tag className="h-6 w-6 text-slate-600" />
              </div>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full pl-14 pr-4 py-4 border-2 border-black bg-white text-slate-800 font-bold rounded-md transition-all duration-200 focus:outline-none appearance-none shadow-[3px_3px_0px_0px_#000] focus:shadow-[1px_1px_0px_0px_#000] focus:translate-x-[2px] focus:translate-y-[2px] ${fieldErrors.category ? "bg-red-50" : ""
                  }`}
              >
                <option value="" disabled>
                  Select category
                </option>
                {currentCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {fieldErrors.category && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-red-800 text-sm bg-red-100 border-2 border-black px-3 py-2 rounded-md shadow-[2px_2px_0px_0px_#000] font-medium"
              >
                {fieldErrors.category.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={
              loading || Object.values(fieldErrors).some((errorsArray) => errorsArray && errorsArray.length > 0)
            }
            className={`w-full py-5 px-6 font-bold text-lg border-2 border-black rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[5px_5px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] ${formData.type === "income"
                ? "bg-emerald-400 hover:bg-emerald-500 text-emerald-900"
                : "bg-rose-400 hover:bg-rose-500 text-rose-900"
              }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="animate-spin h-6 w-6" />
                Adding...
              </div>
            ) : (
              `Add ${formData.type === "income" ? "Income" : "Expense"}`
            )}
          </button>
        </div>
      </form>

      <div className="text-center pt-10 mt-5 border-t-2 border-black">
        <p className="text-slate-600 font-bold text-base">Track • Manage • Grow</p>
      </div>
    </div>
  )
}
