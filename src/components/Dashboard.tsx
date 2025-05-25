// 'use client'

// import {
//     ArrowDownRight,
//     ArrowUpRight,
//     Wallet,
// } from 'lucide-react'
// import React from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import FinanceChart from './FinanceChart'
// import { Transaction } from '@/types'

// const generateMockTransactions = (): Transaction[] => {
//   const today = new Date()
//   const isoDate = (date: Date) => date.toISOString().split('T')[0]

//   // Buat tanggal 5 hari terakhir (hari ini dan 4 hari sebelumnya)
//   const dates = Array.from({ length: 5 }).map((_, i) => {
//     const d = new Date(today)
//     d.setDate(today.getDate() - i)
//     return isoDate(d)
//   })

//   return [
//     { id: '1', date: dates[4], amount: 4000, type: 'income', category: 'Salary', description: 'Monthly salary' },
//     { id: '2', date: dates[3], amount: 2400, type: 'expense', category: 'Food', description: 'Groceries' },
//     { id: '3', date: dates[2], amount: 3000, type: 'income', category: 'Freelance', description: 'Project payment' },
//     { id: '4', date: dates[1], amount: 1398, type: 'expense', category: 'Transport', description: 'Bus fare' },
//     { id: '5', date: dates[0], amount: 500, type: 'expense', category: 'Coffee', description: 'Cafe' }
//   ]
// }

// export const DashboardPage = () => {
//     const cards = [
//         {
//             title: 'Total Balance',
//             amount: '$24,500.00',
//             icon: <Wallet className="h-6 w-6 text-blue-600" />,
//             change: '12%',
//             changeIcon: <ArrowUpRight className="h-4 w-4 mr-1" />,
//             changeColor: 'text-green-600',
//             bgColor: 'bg-blue-100',
//             showOnMobile: false,
//         },
//         {
//             title: 'Income',
//             amount: '$12,750.00',
//             icon: <ArrowUpRight className="h-6 w-6 text-green-600" />,
//             change: '8%',
//             changeIcon: <ArrowUpRight className="h-4 w-4 mr-1" />,
//             changeColor: 'text-green-600',
//             bgColor: 'bg-green-100',
//             showOnMobile: true,
//         },
//         {
//             title: 'Expenses',
//             amount: '$8,250.00',
//             icon: <ArrowDownRight className="h-6 w-6 text-red-600" />,
//             change: '5%',
//             changeIcon: <ArrowDownRight className="h-4 w-4 mr-1" />,
//             changeColor: 'text-red-600',
//             bgColor: 'bg-red-100',
//             showOnMobile: true,
//         },
//     ]

//     const isMobile = typeof window !== 'undefined' && window.innerWidth < 641

//     const mockTransactions = generateMockTransactions()

//     return (
//         <div className="p-4 md:p-6 space-y-6">
//             <h1 className="text-xl md:text-2xl font-bold">Cashly Dashboard</h1>

//             {/* Cards */}
//             <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible">
//                 <AnimatePresence>
//                     {cards.map((card, idx) =>
//                         !card.showOnMobile && isMobile ? null : (
//                             <motion.div
//                                 key={idx}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -20 }}
//                                 transition={{ duration: 0.3, delay: idx * 0.1 }}
//                                 className={`min-w-[180px] md:min-w-0 bg-white rounded-xl shadow-sm p-4 md:p-6 ${!card.showOnMobile ? 'hidden md:block' : ''
//                                     }`}
//                             >
//                                 <div className="flex items-center justify-between mb-2 md:mb-4">
//                                     <div className={`p-2 ${card.bgColor} rounded-lg`}>
//                                         {card.icon}
//                                     </div>
//                                     <span
//                                         className={`flex items-center ${card.changeColor} text-xs md:text-sm`}
//                                     >
//                                         {card.changeIcon}
//                                         {card.change}
//                                     </span>
//                                 </div>
//                                 <h3 className="text-xs md:text-sm text-gray-500">{card.title}</h3>
//                                 <p className="text-lg md:text-2xl font-semibold">{card.amount}</p>
//                             </motion.div>
//                         )
//                     )}
//                 </AnimatePresence>
//             </div>

//             <FinanceChart transactions={mockTransactions} />
//         </div>
//     )
// }


'use client'

import {
  ArrowDownRight,
  ArrowUpRight,
  LineChart,
  Wallet,
} from 'lucide-react'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

const transactionData = {
  daily: [
    { name: '00:00', income: 400, expense: 240 },
    { name: '04:00', income: 300, expense: 139 },
    { name: '08:00', income: 200, expense: 980 },
    { name: '12:00', income: 278, expense: 390 },
    { name: '16:00', income: 189, expense: 480 },
    { name: '20:00', income: 239, expense: 380 },
  ],
  weekly: [
    { name: 'Sen', income: 4000, expense: 2400 },
    { name: 'Sel', income: 3000, expense: 1398 },
    { name: 'Rab', income: 2000, expense: 9800 },
    { name: 'Kam', income: 2780, expense: 3908 },
    { name: 'Jum', income: 1890, expense: 4800 },
    { name: 'Sab', income: 2390, expense: 3800 },
    { name: 'Min', income: 3000, expense: 2500 },
  ],
  monthly: [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
    { name: 'Mei', income: 1890, expense: 4800 },
    { name: 'Jun', income: 2390, expense: 3800 },
  ],
}

export const DashboardPage = () => {
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const cards = [
    {
      title: 'Total Balance',
      amount: '$24,500.00',
      icon: <Wallet className="h-6 w-6 text-blue-600" />,
      change: '12%',
      changeIcon: <ArrowUpRight className="h-4 w-4 mr-1" />,
      changeColor: 'text-green-600',
      bgColor: 'bg-blue-100',
      showOnMobile: false,
    },
    {
      title: 'Income',
      amount: '$12,750.00',
      icon: <ArrowUpRight className="h-6 w-6 text-green-600" />,
      change: '8%',
      changeIcon: <ArrowUpRight className="h-4 w-4 mr-1" />,
      changeColor: 'text-green-600',
      bgColor: 'bg-green-100',
      showOnMobile: true,
    },
    {
      title: 'Expenses',
      amount: '$8,250.00',
      icon: <ArrowDownRight className="h-6 w-6 text-red-600" />,
      change: '5%',
      changeIcon: <ArrowDownRight className="h-4 w-4 mr-1" />,
      changeColor: 'text-red-600',
      bgColor: 'bg-red-100',
      showOnMobile: true,
    },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-xl md:text-2xl font-bold">Cashly Dashboard</h1>

      {/* Cards with animation */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <AnimatePresence>
          {cards.map((card, idx) =>
            !card.showOnMobile && isMobile
              ? null
              : (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className={`bg-white rounded-xl shadow-sm p-4 md:p-6 ${
                    !card.showOnMobile ? 'hidden md:block' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className={`p-2 ${card.bgColor} rounded-lg`}>
                      {card.icon}
                    </div>
                    <span
                      className={`flex items-center ${card.changeColor} text-xs md:text-sm`}
                    >
                      {card.changeIcon}
                      {card.change}
                    </span>
                  </div>
                  <h3 className="text-xs md:text-sm text-gray-500">{card.title}</h3>
                  <p className="text-lg md:text-2xl font-semibold">{card.amount}</p>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* Transaction Chart */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-md md:text-lg font-semibold">Grafik Transaksi</h2>
          <Select value={chartPeriod} onValueChange={(val) => setChartPeriod(val as 'daily' | 'weekly' | 'monthly')}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Harian</SelectItem>
              <SelectItem value="weekly">Mingguan</SelectItem>
              <SelectItem value="monthly">Bulanan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={transactionData[chartPeriod]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2} />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
