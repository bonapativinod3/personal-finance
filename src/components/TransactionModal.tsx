import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Tag, FileText, IndianRupee, Utensils, Car, ShoppingBag, Building2, GraduationCap, Film, HeartPulse, Zap, Wallet, MoreHorizontal } from 'lucide-react';
import { CATEGORIES, Transaction, TransactionType } from '../types';
import { cn } from '../lib/utils';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  initialData?: Transaction;
  initialCategory?: string;
}

export default function TransactionModal({ isOpen, onClose, onSave, initialData, initialCategory }: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense');
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [category, setCategory] = useState(initialData?.category || initialCategory || 'Food');
  const [date, setDate] = useState(initialData?.date.split('T')[0] || new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState(initialData?.note || '');

  // Update category if initialCategory changes (e.g. when opening from FAB)
  React.useEffect(() => {
    if (initialCategory && !initialData) {
      setCategory(initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1).toLowerCase());
    }
  }, [initialCategory, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;

    onSave({
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(date).toISOString(),
      note
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[32px] p-8 z-[70] shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold text-slate-800">
                {initialData ? 'Edit Transaction' : 'New Transaction'}
              </h2>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selector */}
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={cn(
                    "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                    type === 'expense' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                  )}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={cn(
                    "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                    type === 'income' ? "bg-white text-green-600 shadow-sm" : "text-slate-500"
                  )}
                >
                  Income
                </button>
              </div>

              {/* Amount Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <IndianRupee size={24} />
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-3xl font-display font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
                  autoFocus
                />
              </div>

              {/* Category Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Tag size={14} /> Category
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(CATEGORIES).map(([name, cat]) => {
                    const Icon = (cat as any).iconComponent || Tag;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setCategory(name)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2",
                          category === name 
                            ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm scale-105" 
                            : "border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm",
                          cat.color
                        )}>
                          {/* We'll use a helper to get the icon component */}
                          {name === 'Food' && <Utensils size={20} />}
                          {name === 'Petrol' && <Car size={20} />}
                          {name === 'Shopping' && <ShoppingBag size={20} />}
                          {name === 'Rent' && <Building2 size={20} />}
                          {name === 'School' && <GraduationCap size={20} />}
                          {name === 'Entertainment' && <Film size={20} />}
                          {name === 'Health' && <HeartPulse size={20} />}
                          {name === 'Utilities' && <Zap size={20} />}
                          {name === 'Salary' && <Wallet size={20} />}
                          {name === 'Other' && <MoreHorizontal size={20} />}
                        </div>
                        <span className="text-[10px] font-bold truncate w-full text-center">{name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={14} /> Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium border-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} /> Note
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Lunch, Rent, etc."
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium border-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all"
              >
                Save Transaction
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
