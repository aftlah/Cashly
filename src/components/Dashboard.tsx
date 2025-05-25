'use client'

import {
  ArrowDownRight,
  ArrowUpRight,
  LineChart,
  Wallet,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
} from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
import { formatDateShort } from '@/utils/dateUtils'
import { formatCurrency } from '@/utils/format'

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

const transactions = [
  { id: '1', date: '2024-03-20', amount: 4000, type: 'income', description: 'Salary' },
  { id: '2', date: '2024-03-19', amount: 2400, type: 'expense', description: 'Groceries' },
  { id: '3', date: '2024-03-18', amount: 3000, type: 'income', description: 'Freelance' },
  { id: '4', date: '2024-03-17', amount: 1398, type: 'expense', description: 'Transport' },
  { id: '5', date: '2024-03-16', amount: 500, type: 'expense', description: 'Coffee' },
]

export const DashboardPage = () => {
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    <div className="p-4 md:p-6 space-y-6 mb-14 md:mb-12">
      <h1 className="text-xl md:text-2xl font-bold">Cashly Dashboard</h1>

      {/* Cards */}
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
                    <span className={`flex items-center ${card.changeColor} text-xs md:text-sm`}>
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

      {/* Chart */}
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

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-md md:text-lg font-semibold">Riwayat Terbaru</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/transactions">
              Lihat Semua
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {transactions.slice(0, 5).map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`p-2 rounded-lg ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowUpIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4 text-red-600" />
                    )}
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{formatDateShort(new Date(transaction.date))}</p>
                  </div>
                </div>
                <motion.p
                  whileHover={{ scale: 1.05 }}
                  className={`font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}Rp {formatCurrency(transaction.amount)}
                </motion.p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
