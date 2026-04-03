export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category?: string;
}

export interface FixedDeposit {
  id: string;
  bankName: string;
  principalAmount: number;
  interestRate: number;
  startDate: string;
  maturityDate: string;
  isMatured: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface Category {
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Record<string, Category> = {
  Food: { name: 'Food', icon: 'Utensils', color: 'bg-orange-500' },
  Petrol: { name: 'Petrol', icon: 'Fuel', color: 'bg-blue-500' },
  Shopping: { name: 'Shopping', icon: 'ShoppingBag', color: 'bg-pink-500' },
  Rent: { name: 'Rent', icon: 'Home', color: 'bg-purple-500' },
  School: { name: 'School', icon: 'GraduationCap', color: 'bg-indigo-500' },
  Entertainment: { name: 'Entertainment', icon: 'Film', color: 'bg-purple-500' },
  Health: { name: 'Health', icon: 'HeartPulse', color: 'bg-red-500' },
  Utilities: { name: 'Utilities', icon: 'Zap', color: 'bg-yellow-500' },
  Salary: { name: 'Salary', icon: 'Wallet', color: 'bg-green-500' },
  Other: { name: 'Other', icon: 'MoreHorizontal', color: 'bg-gray-500' },
};
