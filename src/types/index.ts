export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
}

export interface ChartData {
  labels: string[];
  income: number[];
  expense: number[];
}

export interface DateRange {
  start: Date;
  end: Date;
} 