import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';
import { DateRange } from '../types';

export const getTodayRange = (): DateRange => ({
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
});

export const getThisWeekRange = (): DateRange => ({
  start: startOfWeek(new Date(), { weekStartsOn: 1 }),
  end: endOfWeek(new Date(), { weekStartsOn: 1 }),
});

export const getThisMonthRange = (): DateRange => ({
  start: startOfMonth(new Date()),
  end: endOfMonth(new Date()),
});

export const filterTransactionsByDateRange = (transactions: any[], dateRange: DateRange) => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= dateRange.start && transactionDate <= dateRange.end;
  });
};

export const formatDateShort = (date: Date): string => {
  return format(date, 'MMM dd');
};

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};
