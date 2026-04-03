import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Wallet, ArrowUpRight, ArrowDownLeft, 
  Search, Filter, Trash2, Edit2, ChevronRight, Target, Flame, X,
  Utensils, Car, ShoppingBag, Film, HeartPulse, Zap, MoreHorizontal,
  Building2, Calendar, Percent, Calculator, ArrowRight, Bot, User as UserIcon,
  ShieldCheck, Bell, Settings, CreditCard, Users, Gift, HelpCircle, FileText
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import Layout from './components/Layout';
import TransactionModal from './components/TransactionModal';
import CalendarView from './components/CalendarView';
import AdSpace from './components/AdSpace';
import Chatbot from './components/Chatbot';
import FDCalculator from './components/FDCalculator';
import { SpendingTrend, CategoryPie } from './components/Charts';
import { useFinanceData } from './hooks/useFinanceData';
import { CATEGORIES, Transaction, FixedDeposit } from './types';
import { cn } from './lib/utils';

const ICON_MAP: Record<string, any> = {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  Zap,
  Wallet,
  MoreHorizontal
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileSubScreen, setProfileSubScreen] = useState<string | null>(null);
  const [initialCategory, setInitialCategory] = useState<string | undefined>();
  
  const { 
    transactions, goals, fds, addTransaction, deleteTransaction, updateTransaction, 
    addFd, deleteFd, updateFd, isLoaded 
  } = useFinanceData();

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const entries = Object.entries(categoryTotals) as [string, number][];
    const topCategory = entries.sort((a, b) => b[1] - a[1])[0];

    return {
      income,
      expenses,
      balance,
      savingsRate,
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
      categoryTotals
    };
  }, [transactions]);

  if (!isLoaded) return null;

  const filteredTransactions = transactions.filter(t => 
    t.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveTransaction = (data: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
    setEditingTransaction(undefined);
  };

  const getCategoryIcon = (categoryName: string) => {
    const cat = CATEGORIES[categoryName] || CATEGORIES[categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase()];
    const iconName = cat?.icon || 'MoreHorizontal';
    const IconComponent = ICON_MAP[iconName] || MoreHorizontal;
    return <IconComponent size={20} />;
  };

  const renderHome = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800">Smart Finance</h1>
          <p className="text-slate-400 text-sm font-medium">Welcome back, Vinod</p>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
            <Bell size={20} />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <UserIcon size={20} />
          </div>
        </div>
      </div>

      {/* Balance Card with Gradient */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-1">
            <p className="text-indigo-100 text-sm font-medium">Total Balance</p>
            <ShieldCheck size={20} className="text-white/40" />
          </div>
          <h2 className="text-4xl font-display font-bold mb-8">₹{stats.balance.toLocaleString()}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">
                  <ArrowDownLeft size={14} className="text-green-400" />
                </div>
                <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider">Income</span>
              </div>
              <p className="text-lg font-bold">₹{stats.income.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-red-400/20 flex items-center justify-center">
                  <ArrowUpRight size={14} className="text-red-400" />
                </div>
                <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider">Expenses</span>
              </div>
              <p className="text-lg font-bold">₹{stats.expenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
      </div>

      {/* Top Ad Space */}
      <AdSpace type="banner" />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setActiveTab('investments')}
          className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6 rounded-[32px] shadow-sm flex flex-col gap-3 group active:scale-95 transition-all relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl" />
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
            <Building2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Fixed Deposit</h4>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">High Returns</p>
          </div>
        </button>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm flex flex-col gap-3 group active:scale-95 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <CreditCard size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Add Expense</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Quick Track</p>
          </div>
        </button>
      </div>

      {/* Quick Insights */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-display font-bold text-slate-800">Quick Insights</h3>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-600" />
            <div className="w-2 h-2 rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-bold text-slate-800">Weekly Spending</h4>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-wider">Last 7 Days</span>
            </div>
            <SpendingTrend transactions={transactions} />
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-bold text-slate-800">Category Breakdown</h4>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-wider">This Month</span>
            </div>
            <CategoryPie transactions={transactions} />
          </div>
        </div>
      </section>

      <AdSpace type="banner" />

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-display font-bold text-slate-800">Recent Activity</h3>
          <button onClick={() => setActiveTab('transactions')} className="text-indigo-600 text-xs font-bold uppercase tracking-wider">View All</button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by note or category..." 
            className="flex-1 bg-transparent border-none text-sm font-medium focus:ring-0 p-0"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 p-1">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="space-y-3">
          {(searchQuery ? filteredTransactions : transactions.slice(0, 3)).map((t) => (
            <div key={t.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white", CATEGORIES[t.category]?.color || 'bg-slate-500')}>
                {getCategoryIcon(t.category)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{t.note || t.category}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{format(new Date(t.date), 'MMM dd, yyyy')}</p>
              </div>
              <p className={cn("font-display font-bold", t.type === 'income' ? "text-green-500" : "text-slate-800")}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderInvestments = () => (
    <div className="space-y-8">
      <FDCalculator onInvest={(data) => console.log('Invested:', data)} />
      
      <section className="space-y-4">
        <h3 className="text-lg font-display font-bold text-slate-800 px-1">Your Deposits</h3>
        <div className="space-y-4">
          {fds.map(fd => {
            const totalDays = differenceInDays(new Date(fd.maturityDate), new Date(fd.startDate));
            const daysPassed = differenceInDays(new Date(), new Date(fd.startDate));
            const progress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));

            return (
              <div key={fd.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{fd.bankName}</h3>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">₹{fd.principalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest",
                    fd.isMatured ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                  )}>
                    {fd.isMatured ? 'Matured' : 'Active'}
                  </div>
                </div>

                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );

  const renderProfile = () => {
    if (profileSubScreen === 'rewards') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setProfileSubScreen(null)} className="p-2 -ml-2 text-slate-400">
              <ArrowDownLeft className="rotate-45" size={24} />
            </button>
            <h2 className="text-xl font-display font-bold text-slate-800">Your Rewards</h2>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-purple-100 text-xs font-bold uppercase tracking-widest mb-1">Total Points</p>
              <h3 className="text-4xl font-display font-bold mb-6">2,450</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-wider">Redeem Now</button>
                <button className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-wider">History</button>
              </div>
            </div>
            <Gift size={120} className="absolute -right-8 -bottom-8 text-white/10 rotate-12" />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 px-1">Recent Rewards</h4>
            {[
              { title: 'Referral Bonus', date: 'Mar 28, 2026', points: '+500', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
              { title: 'Cashback - Amazon', date: 'Mar 25, 2026', points: '+120', icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-50' },
              { title: 'Savings Milestone', date: 'Mar 20, 2026', points: '+1000', icon: Target, color: 'text-green-500', bg: 'bg-green-50' },
            ].map((reward, i) => (
              <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", reward.bg, reward.color)}>
                  <reward.icon size={22} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">{reward.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{reward.date}</p>
                </div>
                <p className="font-display font-bold text-indigo-600">{reward.points}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (profileSubScreen === 'refer') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setProfileSubScreen(null)} className="p-2 -ml-2 text-slate-400">
              <ArrowDownLeft className="rotate-45" size={24} />
            </button>
            <h2 className="text-xl font-display font-bold text-slate-800">Refer & Earn</h2>
          </div>

          <div className="bg-indigo-50 rounded-[32px] p-8 text-center space-y-4 border border-indigo-100">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl mx-auto">
              <Users size={40} />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-slate-800">Invite Friends</h3>
              <p className="text-slate-500 text-sm">Earn ₹500 for every friend who joins and makes their first investment.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-dashed border-indigo-200 flex items-center justify-between">
              <span className="font-mono font-bold text-indigo-600 tracking-wider">SMART500</span>
              <button onClick={() => alert('Code copied!')} className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Copy</button>
            </div>
            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-transform">
              Share Link
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-[32px] p-6 space-y-4">
            <h4 className="font-bold text-slate-800">How it works</h4>
            <div className="space-y-4">
              {[
                { step: 1, text: 'Share your unique referral link with friends.' },
                { step: 2, text: 'Friend joins and completes KYC.' },
                { step: 3, text: 'You both get rewards on their first investment!' },
              ].map((step) => (
                <div key={step.step} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {step.step}
                  </div>
                  <p className="text-sm text-slate-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (profileSubScreen === 'support') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setProfileSubScreen(null)} className="p-2 -ml-2 text-slate-400">
              <ArrowDownLeft className="rotate-45" size={24} />
            </button>
            <h2 className="text-xl font-display font-bold text-slate-800">Help & Support</h2>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 px-1">Frequently Asked Questions</h4>
            {[
              { q: 'How do I add a new expense?', a: 'Tap the "+" button at the bottom center of the screen and select a category.' },
              { q: 'How is maturity value calculated?', a: 'We use the formula A = P(1 + r/n)^(nt) with quarterly compounding.' },
              { q: 'Can I export my data?', a: 'Yes, go to Account Statements in your profile to download PDF or CSV reports.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="text-sm font-bold text-slate-700">{faq.q}</span>
                  <ChevronRight size={16} className="text-slate-300 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="bg-indigo-600 rounded-[32px] p-8 text-white space-y-6 shadow-xl">
            <div>
              <h4 className="text-lg font-display font-bold">Still need help?</h4>
              <p className="text-indigo-100 text-xs">Our support team is available 24/7 to assist you.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => alert('Starting chat...')} className="py-3 bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-wider">Chat with us</button>
              <button onClick={() => alert('Opening email...')} className="py-3 bg-white/10 backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-wider">Email support</button>
            </div>
          </div>
        </div>
      );
    }

    if (profileSubScreen === 'statements') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setProfileSubScreen(null)} className="p-2 -ml-2 text-slate-400">
              <ArrowDownLeft className="rotate-45" size={24} />
            </button>
            <h2 className="text-xl font-display font-bold text-slate-800">Account Statements</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search statements..." 
              className="flex-1 bg-transparent border-none text-sm font-medium focus:ring-0 p-0"
            />
            <Filter size={18} className="text-indigo-600" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'March 2026', 'February 2026', 'January 2026', '2025'].map((filter) => (
              <button key={filter} className="px-4 py-2 rounded-xl bg-white border border-slate-100 text-xs font-bold text-slate-600 whitespace-nowrap active:bg-indigo-600 active:text-white active:border-indigo-600 transition-all">
                {filter}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {[
              { month: 'March 2026', size: '1.2 MB', date: 'Apr 01, 2026' },
              { month: 'February 2026', size: '1.5 MB', date: 'Mar 01, 2026' },
              { month: 'January 2026', size: '1.1 MB', date: 'Feb 01, 2026' },
              { month: 'Annual Summary 2025', size: '4.8 MB', date: 'Jan 05, 2026' },
            ].map((stmt, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-sm">{stmt.month}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stmt.size} • {stmt.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => alert(`Downloading PDF for ${stmt.month}...`)} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg" title="Download PDF">
                    <FileText size={18} />
                  </button>
                  <button onClick={() => alert(`Downloading CSV for ${stmt.month}...`)} className="p-2 text-green-600 bg-green-50 rounded-lg" title="Download CSV">
                    <ArrowRight className="rotate-90" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-[40px] bg-indigo-600 p-1 shadow-2xl shadow-indigo-200">
              <img 
                src="https://picsum.photos/seed/vinod/200/200" 
                alt="Profile" 
                className="w-full h-full rounded-[38px] object-cover border-4 border-white"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center text-indigo-600 border border-slate-100">
              <Edit2 size={18} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-800">Vinod Bonapati</h2>
            <p className="text-slate-400 text-sm font-medium">bonapativinod33@gmail.com</p>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">
              Verified
            </div>
            <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
              Premium User
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {[
            { id: 'refer', icon: Users, label: 'Refer & Earn', value: '₹500 Earned', color: 'text-blue-500' },
            { id: 'rewards', icon: Gift, label: 'Rewards', value: '3 New', color: 'text-purple-500' },
            { id: 'support', icon: HelpCircle, label: 'Help & Support', value: '', color: 'text-slate-400' },
            { id: 'statements', icon: FileText, label: 'Account Statements', value: 'PDF/CSV', color: 'text-slate-400' },
            { id: 'settings', icon: Settings, label: 'Settings', value: '', color: 'text-slate-400' },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => {
                if (['refer', 'rewards', 'statements'].includes(item.id)) {
                  setProfileSubScreen(item.id);
                } else if (item.id === 'support') {
                  alert('Connecting to support...');
                } else {
                  alert('Settings coming soon!');
                }
              }}
              className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl active:bg-slate-50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center", item.color)}>
                  <item.icon size={20} />
                </div>
                <span className="font-bold text-slate-700 text-sm">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.value}</span>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setActiveTab('home')} className="p-2 -ml-2 text-slate-400">
          <ArrowDownLeft className="rotate-45" size={24} />
        </button>
        <h2 className="text-xl font-display font-bold text-slate-800">All Transactions</h2>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by note or category..." 
          className="flex-1 bg-transparent border-none text-sm font-medium focus:ring-0 p-0"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-slate-400 p-1">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="space-y-3 pb-24">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((t) => (
            <div key={t.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group active:scale-[0.98] transition-transform">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", CATEGORIES[t.category]?.color || 'bg-slate-500')}>
                {getCategoryIcon(t.category)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-slate-800 text-sm">{t.note || t.category}</p>
                  <p className={cn("font-display font-bold", t.type === 'income' ? "text-green-500" : "text-slate-800")}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{format(new Date(t.date), 'MMM dd, yyyy')}</p>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingTransaction(t); setIsModalOpen(true); }} className="p-1 text-indigo-600 hover:bg-indigo-50 rounded">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => deleteTransaction(t.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <p className="text-slate-500 font-medium">No transactions found</p>
            <p className="text-slate-400 text-xs">Try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onAddClick={(category) => {
        setEditingTransaction(undefined);
        setInitialCategory(category);
        setIsModalOpen(true);
      }}
    >
      {activeTab === 'home' && renderHome()}
      {activeTab === 'transactions' && renderTransactions()}
      {activeTab === 'calendar' && <CalendarView transactions={transactions} />}
      {activeTab === 'investments' && renderInvestments()}
      {activeTab === 'chatbot' && <Chatbot />}
      {activeTab === 'profile' && renderProfile()}

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(undefined);
          setInitialCategory(undefined);
        }}
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
        initialCategory={initialCategory}
      />
    </Layout>
  );
}
