"use client"

import { ArrowDownRight, ArrowUpRight, Wallet, ArrowUpIcon, ArrowDownIcon, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import Cookies from "js-cookie"

const formatDateShort = (date: Date) => {
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID").format(amount)
}

const transactionData = {
  daily: [
    { name: "00:00", income: 400, expense: 240 },
    { name: "04:00", income: 300, expense: 139 },
    { name: "08:00", income: 200, expense: 980 },
    { name: "12:00", income: 278, expense: 390 },
    { name: "16:00", income: 189, expense: 480 },
    { name: "20:00", income: 239, expense: 380 },
  ],
  weekly: [
    { name: "Sen", income: 4000, expense: 2400 },
    { name: "Sel", income: 3000, expense: 1398 },
    { name: "Rab", income: 2000, expense: 9800 },
    { name: "Kam", income: 2780, expense: 3908 },
    { name: "Jum", income: 1890, expense: 4800 },
    { name: "Sab", income: 2390, expense: 3800 },
    { name: "Min", income: 3000, expense: 2500 },
  ],
  monthly: [
    { name: "Jan", income: 4000, expense: 2400 },
    { name: "Feb", income: 3000, expense: 1398 },
    { name: "Mar", income: 2000, expense: 9800 },
    { name: "Apr", income: 2780, expense: 3908 },
    { name: "Mei", income: 1890, expense: 4800 },
    { name: "Jun", income: 2390, expense: 3800 },
  ],
}

const transactions = [
  { id: "1", date: "2024-03-20", amount: 4000, type: "income", description: "Salary" },
  { id: "2", date: "2024-03-19", amount: 2400, type: "expense", description: "Groceries" },
  { id: "3", date: "2024-03-18", amount: 3000, type: "income", description: "Freelance" },
  { id: "4", date: "2024-03-17", amount: 1398, type: "expense", description: "Transport" },
  { id: "5", date: "2024-03-16", amount: 500, type: "expense", description: "Coffee" },
]

const Dashboard = () => {
  const [chartPeriod, setChartPeriod] = useState<"daily" | "weekly" | "monthly">("daily")
  const [isMobile, setIsMobile] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Add these functions
  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const formatDate = () => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = () => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const cards = [
    {
      title: "Total Balance",
      amount: "$24,500.00",
      icon: <Wallet className="h-6 w-6 text-slate-600" />,
      change: "12%",
      changeIcon: <ArrowUpRight className="h-4 w-4 mr-1" />,
      changeColor: "text-emerald-600",
      bgColor: "bg-slate-100",
      showOnMobile: false,
    },
    {
      title: "Income",
      amount: "$12,750.00",
      icon: <ArrowUpRight className="h-6 w-6 text-emerald-600" />,
      change: "8%",
      changeIcon: <ArrowUpRight className="h-4 w-4 mr-1" />,
      changeColor: "text-emerald-600",
      bgColor: "bg-emerald-100",
      showOnMobile: true,
    },
    {
      title: "Expenses",
      amount: "$8,250.00",
      icon: <ArrowDownRight className="h-6 w-6 text-red-600" />,
      change: "5%",
      changeIcon: <ArrowDownRight className="h-4 w-4 mr-1" />,
      changeColor: "text-red-600",
      bgColor: "bg-red-100",
      showOnMobile: true,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 space-y-6 mb-14 md:mb-12">
      {/* Welcome Header */}
      <div className="bg-white border-3 border-slate-700 rounded-lg p-6 shadow-[6px_6px_0px_0px_#64748b]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{getGreeting()}, {Cookies.get("username")}</h1>
            <p className="text-slate-600 text-sm md:text-base font-medium">
              Welcome to Cashly! Manage your finances wisely every day.
            </p>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 text-slate-700 text-sm font-medium">
              <div className="flex items-center space-x-2 bg-slate-100 px-4 py-2 border-2 border-slate-600 rounded-lg shadow-[3px_3px_0px_0px_#475569]">
                <Calendar size={16} />
                <span>{formatDate()}</span>
              </div>
              <div className="bg-slate-100 px-4 py-2 border-2 border-slate-600 rounded-lg shadow-[3px_3px_0px_0px_#475569] font-semibold text-slate-800">
                {formatTime()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <AnimatePresence>
          {cards.map((card, idx) =>
            !card.showOnMobile && isMobile ? null : (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                whileHover={{
                  y: -2,
                  transition: { duration: 0.2 },
                }}
                className={`bg-white border-3 border-slate-700 rounded-lg shadow-[4px_4px_0px_0px_#475569] hover:shadow-[6px_6px_0px_0px_#475569] p-4 md:p-6 transition-all duration-200 ${!card.showOnMobile ? "hidden md:block" : ""
                  }`}
              >
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className={`p-3 ${card.bgColor} rounded-lg border-2 border-slate-600`}>{card.icon}</div>
                  <span className={`flex items-center ${card.changeColor} text-sm md:text-base font-bold`}>
                    {card.changeIcon}
                    {card.change}
                  </span>
                </div>
                <h3 className="text-sm md:text-base text-slate-600 font-semibold mb-1">{card.title}</h3>
                <p className="text-xl md:text-2xl font-bold text-slate-800">{card.amount}</p>
              </motion.div>
            ),
          )}
        </AnimatePresence>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border-3 border-slate-700 rounded-lg shadow-[6px_6px_0px_0px_#64748b] p-4 md:p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Transaction Chart</h2>
          <div className="border-2 border-slate-600 bg-white rounded-lg shadow-[3px_3px_0px_0px_#64748b]">
            <Select value={chartPeriod} onValueChange={(val) => setChartPeriod(val as "daily" | "weekly" | "monthly")}>
              <SelectTrigger className="w-[140px] border-0 font-semibold text-slate-700 rounded-lg">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent className="border-2 border-slate-600 bg-white rounded-lg shadow-[4px_4px_0px_0px_#64748b]">
                <SelectItem value="daily" className="font-semibold">
                  Daily
                </SelectItem>
                <SelectItem value="weekly" className="font-semibold">
                  Weekly
                </SelectItem>
                <SelectItem value="monthly" className="font-semibold">
                  Monthly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="h-64 border-2 border-slate-600 bg-slate-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={transactionData[chartPeriod]}>
              <XAxis dataKey="name" stroke="#475569" fontSize={12} fontWeight="600" />
              <YAxis stroke="#475569" fontSize={12} fontWeight="600" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "2px solid #475569",
                  borderRadius: "8px",
                  boxShadow: "3px 3px 0px 0px #64748b",
                  fontWeight: "600",
                }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#059669"
                strokeWidth={3}
                dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#059669", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#dc2626"
                strokeWidth={3}
                dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#dc2626", strokeWidth: 2 }}
              />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border-3 border-slate-700 rounded-lg shadow-[6px_6px_0px_0px_#64748b] p-4 md:p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Recent Transactions</h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="py-2 px-4 border-2 border-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-[3px_3px_0px_0px_#475569] hover:shadow-[4px_4px_0px_0px_#475569] text-slate-700 font-semibold text-sm transition-all duration-200"
          >
            <Link href="/transactions">View All</Link>
          </motion.button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {transactions.slice(0, 5).map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{
                  x: 2,
                  transition: { duration: 0.2 },
                }}
                className="flex items-center justify-between p-4 border-2 border-slate-600 bg-slate-50 rounded-lg shadow-[3px_3px_0px_0px_#64748b] hover:shadow-[4px_4px_0px_0px_#64748b] transition-all duration-200"
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
                  <div>
                    <p className="text-base font-semibold text-slate-800">{transaction.description}</p>
                    <p className="text-sm text-slate-600 font-medium">{formatDateShort(new Date(transaction.date))}</p>
                  </div>
                </div>
                <motion.p
                  whileHover={{ scale: 1.02 }}
                  className={`font-bold text-lg ${transaction.type === "income" ? "text-emerald-600" : "text-red-600"}`}
                >
                  {transaction.type === "income" ? "+" : "-"}Rp {formatCurrency(transaction.amount)}
                </motion.p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
