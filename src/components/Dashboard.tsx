"use client"

import { ArrowDownRight, ArrowUpRight, Wallet, ArrowUpIcon, ArrowDownIcon, Calendar, Loader2, AlertTriangle } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { getTransactions, Transaction } from "@/lib/service/Transaction" // Import service dan type

// --- Utility Functions ---
const formatDateShort = (dateString: string) => { // Terima string, parse ke Date
  return new Date(dateString).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { localeMatcher: "best fit" }).format(amount) // tambahkan localeMatcher
}

// Helper untuk agregasi chart
const getDayName = (date: Date) => date.toLocaleDateString("id-ID", { weekday: "short" });
const getMonthName = (date: Date) => date.toLocaleDateString("id-ID", { month: "short" });
const getHourString = (date: Date) => `${date.getHours().toString().padStart(2, '0')}:00`;

// --- Dashboard Component ---
const Dashboard = () => {
  const [chartPeriod, setChartPeriod] = useState<"daily" | "weekly" | "monthly">("daily")
  const [isMobile, setIsMobile] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const userId = Cookies.get("userId") || "" // Ambil userId dari cookies
  const username = Cookies.get("username") || "User"

  // --- Fetching Data with useQuery ---
  const {
    data: allTransactions = [],
    isLoading,
    isError,
    error: fetchError,
  } = useQuery<Transaction[], Error>({
    queryKey: ['transactions', userId],
    queryFn: () => getTransactions(userId),
    enabled: !!userId, // Hanya jalankan query jika userId ada
  });

  // --- Derived Data from Transactions ---
  const { totalIncome, totalExpense, totalBalance, recentTransactions } = useMemo(() => {
    if (!allTransactions) return { totalIncome: 0, totalExpense: 0, totalBalance: 0, recentTransactions: [] };

    let income = 0;
    let expense = 0;
    allTransactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });
    return {
      totalIncome: income,
      totalExpense: expense,
      totalBalance: income - expense,
      recentTransactions: allTransactions.slice(0, 5),
    };
  }, [allTransactions]);


  // --- Chart Data Generation ---
  const chartData = useMemo(() => {
    if (!allTransactions || allTransactions.length === 0) {
      return { daily: [], weekly: [], monthly: [] };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // DAILY: data untuk hari ini, per jam
    const dailyDataMap = new Map<string, { name: string; income: number; expense: number }>();
    for (let i = 0; i < 24; i++) { // Inisialisasi semua jam untuk hari ini
      const hourName = `${i.toString().padStart(2, '0')}:00`;
      dailyDataMap.set(hourName, { name: hourName, income: 0, expense: 0 });
    }
    allTransactions.forEach(t => {
      const tDate = new Date(t.date);
      if (tDate >= today && tDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)) { // Hanya transaksi hari ini
        const hourName = getHourString(tDate);
        const entry = dailyDataMap.get(hourName) || { name: hourName, income: 0, expense: 0 };
        if (t.type === 'income') entry.income += t.amount;
        else entry.expense += t.amount;
        dailyDataMap.set(hourName, entry);
      }
    });
    const daily = Array.from(dailyDataMap.values())
      .sort((a, b) => parseInt(a.name.split(':')[0]) - parseInt(b.name.split(':')[0])) // Sort by hour

    // WEEKLY: data untuk minggu ini (Senin - Minggu)
    const weeklyDataMap = new Map<string, { name: string; income: number; expense: number }>();
    const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    dayNames.forEach(name => weeklyDataMap.set(name, { name, income: 0, expense: 0 })); // Inisialisasi hari

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)); // Senin minggu ini
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    allTransactions.forEach(t => {
      const tDate = new Date(t.date);
      if (tDate >= startOfWeek && tDate < endOfWeek) {
        const dayName = getDayName(tDate);
        const entry = weeklyDataMap.get(dayName) || { name: dayName, income: 0, expense: 0 };
        if (t.type === 'income') entry.income += t.amount;
        else entry.expense += t.amount;
        weeklyDataMap.set(dayName, entry);
      }
    });
    const weekly = dayNames.map(name => weeklyDataMap.get(name)!);


    // MONTHLY: data untuk 12 bulan terakhir atau bulan di tahun ini
    const monthlyDataMap = new Map<string, { name: string; income: number; expense: number }>();
    const currentYear = now.getFullYear();
    const monthNamesCurrentYear = [];
    for (let i = 0; i < 12; i++) { // Tampilkan semua bulan dalam setahun ini
      const monthDate = new Date(currentYear, i, 1);
      const monthName = getMonthName(monthDate);
      monthNamesCurrentYear.push(monthName);
      monthlyDataMap.set(monthName, { name: monthName, income: 0, expense: 0 });
    }

    allTransactions.forEach(t => {
      const tDate = new Date(t.date);
      if (tDate.getFullYear() === currentYear) { // Hanya transaksi tahun ini
        const monthName = getMonthName(tDate);
        const entry = monthlyDataMap.get(monthName) || { name: monthName, income: 0, expense: 0 }; // Fallback
        if (t.type === 'income') entry.income += t.amount;
        else entry.expense += t.amount;
        monthlyDataMap.set(monthName, entry);
      }
    });
    const monthly = monthNamesCurrentYear.map(name => monthlyDataMap.get(name)!);


    return { daily, weekly, monthly };
  }, [allTransactions]);


  // --- UI State Effects ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768); // Adjusted breakpoint for md
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);


  // --- Dynamic Cards Data ---
  const cards = [
    {
      title: "Total Balance",
      amount: `Rp ${formatCurrency(totalBalance)}`, // Dinamis
      icon: <Wallet className="h-6 w-6 text-slate-600" />,
      // Change & changeIcon bisa dibuat dinamis jika ada data periode sebelumnya
      change: "", // Kosongkan atau hitung jika ada data pembanding
      changeIcon: null,
      changeColor: "text-slate-600",
      bgColor: "bg-slate-100",
      showOnMobile: false, // Sesuai aturan md:block
    },
    {
      title: "Income",
      amount: `Rp ${formatCurrency(totalIncome)}`, // Dinamis
      icon: <ArrowUpRight className="h-6 w-6 text-emerald-600" />,
      change: "", // Kosongkan atau hitung
      changeIcon: null,
      changeColor: "text-emerald-600",
      bgColor: "bg-emerald-100",
      showOnMobile: true,
    },
    {
      title: "Expenses",
      amount: `Rp ${formatCurrency(totalExpense)}`, // Dinamis
      icon: <ArrowDownRight className="h-6 w-6 text-red-600" />,
      change: "", // Kosongkan atau hitung
      changeIcon: null,
      changeColor: "text-red-600",
      bgColor: "bg-red-100",
      showOnMobile: true,
    },
  ];


  // --- Date and Time Formatting ---
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }
  const formatDateHeader = () => {
    return currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }
  const formatTimeHeader = () => {
    return currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }

  // --- Loading and Error States ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 flex justify-center items-center">
        <Loader2 className="h-12 w-12 text-slate-700 animate-spin" />
        <p className="ml-4 text-xl text-slate-700 font-semibold">Loading dashboard data...</p>
      </div>
    );
  }

  if (isError && userId) { // Hanya tampilkan error jika userId ada (query dijalankan)
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 flex flex-col justify-center items-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-600" />
        <p className="text-xl text-red-600 font-semibold">Error fetching dashboard data</p>
        <p className="text-slate-600">{fetchError?.message || "An unknown error occurred."}</p>
      </div>
    );
  }
  if (!userId) { // Jika tidak ada userId
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 flex flex-col justify-center items-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-orange-500" />
        <p className="text-xl text-orange-600 font-semibold">User Not Found</p>
        <p className="text-slate-600">Please log in to view the dashboard.</p>
        <Link href="/login" className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800">
          Go to Login
        </Link>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 space-y-6 mb-14 md:mb-12">
      {/* Welcome Header */}
      <div className="bg-white border-3 border-slate-700 rounded-lg p-6 shadow-[4px_4px_0px_0px_#475569]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{getGreeting()}, {username}</h1>
            <p className="text-slate-600 text-sm md:text-base font-medium">
              Welcome to Cashly! Manage your finances wisely every day.
            </p>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 text-slate-700 text-sm font-medium">
              <div className="flex items-center space-x-2 bg-slate-100 px-4 py-2 border-2 border-slate-600 rounded-lg shadow-[3px_3px_0px_0px_#475569]">
                <Calendar size={16} />
                <span>{formatDateHeader()}</span>
              </div>
              <div className="bg-slate-100 px-4 py-2 border-2 border-slate-600 rounded-lg shadow-[3px_3px_0px_0px_#475569] font-semibold text-slate-800">
                {formatTimeHeader()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <AnimatePresence>
          {cards.map((card, idx) => {
            // Logika showOnMobile sudah diatur oleh class hidden md:block pada JSX sebelumnya,
            // jadi kita hanya perlu filter jika benar-benar mau tidak render sama sekali di mobile.
            // Namun class Tailwind `hidden md:block` lebih efisien karena CSS-only.
            // Jika `showOnMobile: false`, item akan punya `hidden md:block`
            const cardClasses = `bg-white border-3 border-slate-700 rounded-lg shadow-[4px_4px_0px_0px_#475569] hover:shadow-[6px_6px_0px_0px_#475569] p-4 md:p-6 transition-all duration-200 ${!card.showOnMobile ? "hidden md:block" : "block"
              }`

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className={cardClasses}
              >
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className={`p-3 ${card.bgColor} rounded-lg border-2 border-slate-600`}>{card.icon}</div>
                  {card.change && card.changeIcon && (
                    <span className={`flex items-center ${card.changeColor} text-sm md:text-base font-bold`}>
                      {card.changeIcon}
                      {card.change}
                    </span>
                  )}
                </div>
                <h3 className="text-sm md:text-base text-slate-600 font-semibold mb-1">{card.title}</h3>
                <p className="text-xl md:text-2xl font-bold text-slate-800">{card.amount}</p>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border-3 border-slate-700 rounded-lg shadow-[4px_4px_0px_0px_#475569] p-4 md:p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Transaction Chart</h2>
          <div className="border-2 border-slate-600 bg-white rounded-lg shadow-[3px_3px_0px_0px_#64748b] w-full sm:w-auto">
            <Select value={chartPeriod} onValueChange={(val) => setChartPeriod(val as "daily" | "weekly" | "monthly")}>
              <SelectTrigger className="w-full sm:w-[140px] border-0 font-semibold text-slate-700 rounded-lg">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent className="border-2 border-slate-600 bg-white rounded-lg shadow-[4px_4px_0px_0px_#64748b]">
                <SelectItem value="daily" className="font-semibold">Daily</SelectItem>
                <SelectItem value="weekly" className="font-semibold">Weekly</SelectItem>
                <SelectItem value="monthly" className="font-semibold">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="h-72 md:h-80 border-2 border-slate-600 bg-slate-50 rounded-lg p-2 sm:p-4">
          {chartData[chartPeriod].length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={chartData[chartPeriod]} margin={{ top: 5, right: isMobile ? 0 : 20, left: isMobile ? -25 : -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#475569" fontSize={isMobile ? 10 : 12} fontWeight="600" />
                <YAxis
                  stroke="#475569"
                  fontSize={isMobile ? 10 : 12}
                  fontWeight="600"
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "2px solid #475569",
                    borderRadius: "8px",
                    boxShadow: "3px 3px 0px 0px #64748b",
                    fontWeight: "600",
                  }}
                  formatter={(value: number) => `Rp ${formatCurrency(value)}`}
                />
                <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="income" stroke="#059669" strokeWidth={3} dot={{ fill: "#059669", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={3} dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} name="Expense" />
              </ReLineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-slate-500 font-medium">No transaction data for this period.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border-3 border-slate-700 rounded-lg shadow-[4px_4px_0px_0px_#475569] p-4 md:p-6"
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
          {recentTransactions.length > 0 ? (
            <AnimatePresence>
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ x: 2, transition: { duration: 0.2 } }}
                  className="flex items-center justify-between p-4 border-2 border-slate-600 bg-slate-50 rounded-lg shadow-[3px_3px_0px_0px_#64748b] hover:shadow-[4px_4px_0px_0px_#64748b] hover:bg-white transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className={`p-3 border-2 border-slate-600 rounded-lg ${transaction.type === "income" ? "bg-emerald-100" : "bg-red-100"}`}
                    >
                      {transaction.type === "income" ? <ArrowUpIcon className="w-5 h-5 text-emerald-600" /> : <ArrowDownIcon className="w-5 h-5 text-red-600" />}
                    </motion.div>
                    <div>
                      <p className="text-base font-semibold text-slate-800">{transaction.description}</p>
                      <p className="text-sm text-slate-600 font-medium">{formatDateShort(transaction.date)}</p>
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
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 font-medium">No recent transactions found.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard