"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpIcon, ArrowDownIcon, Search, Calendar, Filter, Loader2, AlertTriangle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getTransactions, type Transaction } from "@/lib/service/Transaction"
import Cookies from "js-cookie"

const formatDateShort = (date: Date) => {
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID").format(amount)
}

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const userId = Cookies.get("userId");

  const {
    data: transactions = [],
    isLoading,
    isError,
    error,
    // refetch, // Anda bisa menggunakan refetch untuk memuat ulang data secara manual
  } = useQuery<Transaction[], Error>({ // Tipe generik: data adalah Transaction[], error adalah Error
    queryKey: ['transactions', userId], // Kunci query, userId sebagai dependency
    queryFn: () => getTransactions(userId as string), // Pastikan userId bertipe string
    enabled: !!userId, // Hanya jalankan query jika userId ada
    // staleTime: 5 * 60 * 1000, // Data dianggap fresh selama 5 menit
    // refetchOnWindowFocus: false, // Nonaktifkan refetch saat window fokus (sesuai kebutuhan)
  });


  const filteredTransactions = (transactions || []).filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
    // Pastikan transaction.date adalah string tanggal yang valid untuk new Date()
    const transactionDate = new Date(transaction.date)
    const isAfterStart = !startDate || transactionDate >= new Date(startDate)
    const isBeforeEnd = !endDate || transactionDate <= new Date(endDate)

    return matchesSearch && isAfterStart && isBeforeEnd
  });

  const handleUpdate = (id: string) => {
    console.log("Update transaction:", id)
    // Implementasi logic update dengan useMutation dari @tanstack/react-query
    // Setelah update, Anda mungkin ingin invalidate query 'transactions' agar data terbaru di-fetch
    // queryClient.invalidateQueries(['transactions', userId]);
  }

  const handleDelete = (id: string) => {
    console.log("Delete transaction:", id)
    // Implementasi logic delete dengan useMutation
    // queryClient.invalidateQueries(['transactions', userId]);
  }

  const clearFilters = () => {
    setSearchQuery("")
    setStartDate("")
    setEndDate("")
  }

  const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  // --- Handle Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 flex flex-col justify-center items-center space-y-4">
        <Loader2 className="h-12 w-12 text-slate-700 animate-spin" />
        <p className="text-xl text-slate-700 font-semibold">Loading transactions...</p>
      </div>
    )
  }

  // --- Handle Error State ---
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 flex flex-col justify-center items-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-600" />
        <p className="text-xl text-red-600 font-semibold">Error fetching transactions</p>
        {/* Tampilkan pesan error dari objek error */}
        <p className="text-slate-600">{error?.message || "An unknown error occurred."}</p>
        {/* Anda bisa menambahkan tombol untuk mencoba lagi:
        <button onClick={() => refetch()} className="...">Retry</button>
        */}
      </div>
    )
  }

  // --- Render UI Utama ---
  // (Sisa kode JSX Anda dari <div className="min-h-screen..."> dst. tetap sama)
  // Pastikan semua penggunaan `transaction.date` (misal di `formatDateShort(new Date(transaction.date))`)
  // sesuai dengan format tanggal yang Anda terima dari Supabase dan interface Transaction.
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border-3 border-slate-700 rounded-lg p-6 shadow-[4px_4px_0px_0px_#475569]">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Transaction History</h1>
        <p className="text-slate-600 font-medium mt-2">Track and manage all your financial transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-3 border-slate-700 rounded-lg shadow-[4px_4px_0px_0px_#475569] p-4 md:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600">Total Transactions</p>
              <p className="text-2xl font-bold text-slate-800">{filteredTransactions.length}</p>
            </div>
            <div className="p-3 bg-slate-100 border-2 border-slate-600 rounded-lg">
              <Filter className="h-6 w-6 text-slate-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-3 border-slate-700 rounded-lg shadow-[4px_4px_0px_0px_#475569] p-4 md:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600">Total Income</p>
              <p className="text-2xl font-bold text-emerald-600">+Rp {formatCurrency(totalIncome)}</p>
            </div>
            <div className="p-3 bg-emerald-100 border-2 border-slate-600 rounded-lg">
              <ArrowUpIcon className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-3 border-slate-700 rounded-lg shadow-[4px_4px_0px_0px_#475569] p-4 md:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">-Rp {formatCurrency(totalExpense)}</p>
            </div>
            <div className="p-3 bg-red-100 border-2 border-slate-600 rounded-lg">
              <ArrowDownIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border-3 border-slate-700 rounded-lg shadow-[4px_4px_0px_0px_#475569] p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Search className="h-5 w-5 text-slate-600" />
          <h2 className="text-lg font-bold text-slate-800">Filter Transactions</h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-600 rounded-lg bg-white text-slate-800 font-medium shadow-[3px_3px_0px_0px_#64748b] focus:outline-none focus:shadow-[4px_4px_0px_0px_#475569] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-200"
              />
            </div>

            {/* Date Inputs Container */}
            <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
              {/* Start Date */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none">
                    <Calendar className="h-4 w-4 text-slate-600" />
                  </div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Start Date"
                    className="w-full sm:w-[160px] lg:w-[180px] pl-10 pr-4 py-3 border-2 border-slate-600 rounded-lg bg-white text-slate-800 font-medium shadow-[3px_3px_0px_0px_#64748b] focus:outline-none focus:shadow-[4px_4px_0px_0px_#475569] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-200"
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                  End Date
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none">
                    <Calendar className="h-4 w-4 text-slate-600" />
                  </div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="End Date"
                    className="w-full sm:w-[160px] lg:w-[180px] pl-10 pr-4 py-3 border-2 border-slate-600 rounded-lg bg-white text-slate-800 font-medium shadow-[3px_3px_0px_0px_#64748b] focus:outline-none focus:shadow-[4px_4px_0px_0px_#475569] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-200"
                  />
                </div>
              </div>
            </div>

          </div>
          {/* Clear Filters Button */}
          {(searchQuery || startDate || endDate) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearFilters}
              className="px-4 py-2 border-2 border-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-[3px_3px_0px_0px_#475569] hover:shadow-[4px_4px_0px_0px_#475569] text-slate-700 font-semibold text-sm transition-all duration-200"
            >
              Clear Filters
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border-3 border-slate-700 rounded-lg shadow-[4px_4px_0px_0px_#475569] p-6"
      >
        <h2 className="text-lg font-bold text-slate-800 mb-6">All Transactions ({filteredTransactions.length})</h2>

        <div className="space-y-3">
          <AnimatePresence>
            {filteredTransactions.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <div className="p-4 bg-slate-100 border-2 border-slate-600 rounded-lg inline-block mb-4">
                  <Search className="h-8 w-8 text-slate-600" />
                </div>
                <p className="text-slate-600 font-medium">No transactions found</p>
                <p className="text-slate-500 text-sm mt-1">Try adjusting your search criteria or no data exists.</p>
              </motion.div>
            ) : (
              filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{
                    x: 2,
                    transition: { duration: 0.2 },
                  }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-2 border-slate-600 bg-slate-50 rounded-lg shadow-[3px_3px_0px_0px_#64748b] hover:shadow-[4px_4px_0px_0px_#64748b] hover:bg-white transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className={`p-3 border-2 border-slate-600 rounded-lg ${transaction.type === "income" ? "bg-emerald-100" : "bg-red-100"
                        }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpIcon className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ArrowDownIcon className="w-5 h-5 text-red-600" />
                      )}
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-slate-800">{transaction.description}</p>
                      <div className="flex items-center justify-between sm:block">
                        <motion.p
                          whileHover={{ scale: 1.02 }}
                          className={`text-lg font-bold ${transaction.type === "income" ? "text-emerald-600" : "text-red-600"
                            }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}Rp {formatCurrency(transaction.amount)}
                        </motion.p>
                        <p className="text-sm text-slate-600 font-medium">
                          {/* Pastikan transaction.date bisa diparsing oleh new Date() */}
                          {formatDateShort(new Date(transaction.date))}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleUpdate(transaction.id)}
                      className="flex-1 sm:flex-none px-3 py-2 border-2 border-slate-600 bg-blue-100 hover:bg-blue-200 rounded-lg shadow-[2px_2px_0px_0px_#475569] hover:shadow-[3px_3px_0px_0px_#475569] text-blue-700 font-semibold text-sm transition-all duration-200"
                    >
                      Update
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDelete(transaction.id)}
                      className="flex-1 sm:flex-none px-3 py-2 border-2 border-slate-600 bg-red-100 hover:bg-red-200 rounded-lg shadow-[2px_2px_0px_0px_#475569] hover:shadow-[3px_3px_0px_0px_#475569] text-red-700 font-semibold text-sm transition-all duration-200"
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}