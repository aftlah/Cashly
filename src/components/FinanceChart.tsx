'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Transaction, ChartData, DateRange } from '@/types';
import { 
  getTodayRange, 
  getThisWeekRange, 
  getThisMonthRange,
  filterTransactionsByDateRange,
  formatDateShort
} from '../utils/dateUtils';
import { format, eachDayOfInterval } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FinanceChartProps {
  transactions: Transaction[];
}

type PeriodType = 'day' | 'week' | 'month';

const FinanceChart = ({ transactions }: FinanceChartProps) => {
  const [activePeriod, setActivePeriod] = useState<PeriodType>('day');
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    income: [],
    expense: [],
  });

  const periods: { label: string; value: PeriodType }[] = [
    { label: 'Hari ini', value: 'day' },
    { label: 'Minggu ini', value: 'week' },
    { label: 'Bulan ini', value: 'month' },
  ];

  useEffect(() => {
    generateChartData(activePeriod);
  }, [activePeriod, transactions]);

  const generateChartData = (period: PeriodType) => {
    let dateRange: DateRange;
    let intervalFn: (range: DateRange) => Date[];
    let formatFn: (date: Date) => string;

    switch (period) {
      case 'day':
        dateRange = getTodayRange();
        intervalFn = (range) => [range.start];
        formatFn = () => 'Today';
        break;
      case 'week':
        dateRange = getThisWeekRange();
        intervalFn = eachDayOfInterval;
        formatFn = formatDateShort;
        break;
      case 'month':
        dateRange = getThisMonthRange();
        intervalFn = eachDayOfInterval;
        formatFn = formatDateShort;
        break;
      default:
        dateRange = getTodayRange();
        intervalFn = (range) => [range.start];
        formatFn = () => 'Today';
    }

    const filteredTransactions = filterTransactionsByDateRange(transactions, dateRange);
    const intervals = intervalFn(dateRange);

    const labels = intervals.map((date) => formatFn(date));
    const income = Array(labels.length).fill(0);
    const expense = Array(labels.length).fill(0);

    filteredTransactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const index = intervals.findIndex((date) => 
        format(date, 'yyyy-MM-dd') === format(transactionDate, 'yyyy-MM-dd')
      );

      if (index !== -1) {
        if (transaction.type === 'income') {
          income[index] += transaction.amount;
        } else {
          expense[index] += transaction.amount;
        }
      }
    });

    setChartData({ labels, income, expense });
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Income',
        data: chartData.income,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        borderRadius: 4,
        maxBarThickness: 40,
      },
      {
        label: 'Expense',
        data: chartData.expense,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        borderRadius: 4,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: `${activePeriod === 'day' ? 'Today' : activePeriod === 'week' ? 'This Week' : 'This Month'}'s Finance`,
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number | string) {
            return `$${Number(value).toLocaleString()}`;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-700">Financial Overview</h3>
        <div className="flex space-x-2">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setActivePeriod(period.value)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                activePeriod === period.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default FinanceChart;
