'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp as ArrowUpIcon, ArrowDown as ArrowDownIcon } from 'lucide-react'
import { formatDateShort } from '@/utils/dateUtils'
import { formatCurrency } from '@/utils/format'
import { Button } from '@/components/ui/button'

const transactions = [
  { id: '1', date: '2024-03-20', amount: 4000, type: 'income', description: 'Salary' },
  { id: '2', date: '2024-03-19', amount: 2400, type: 'expense', description: 'Groceries' },
  { id: '3', date: '2024-03-18', amount: 3000, type: 'income', description: 'Freelance' },
  { id: '4', date: '2024-03-17', amount: 1398, type: 'expense', description: 'Transport' },
  { id: '5', date: '2024-03-16', amount: 500, type: 'expense', description: 'Coffee' },
]

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
    const transactionDate = new Date(transaction.date)
    const isAfterStart = !startDate || transactionDate >= new Date(startDate)
    const isBeforeEnd = !endDate || transactionDate <= new Date(endDate)
    
    return matchesSearch && isAfterStart && isBeforeEnd
  })

  const handleUpdate = (id: string) => {
    // Handle update logic here
    console.log('Update transaction:', id)
  }

  const handleDelete = (id: string) => {
    // Handle delete logic here
    console.log('Delete transaction:', id)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Transactions History</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
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
                    <motion.p
                      whileHover={{ scale: 1.05 }}
                      className={`text-sm font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}Rp {formatCurrency(transaction.amount)}
                    </motion.p>
                    <p className="text-xs text-gray-500">
                      {formatDateShort(new Date(transaction.date))}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdate(transaction.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Update
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
