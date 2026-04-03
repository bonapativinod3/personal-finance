import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Calendar, MessageCircle, User, Bot, X, Plus, GraduationCap, Home as HomeIcon, Fuel, Utensils, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/utils';
import Chatbot from './Chatbot';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddClick: (category?: string) => void;
}

const CATEGORIES = [
  { id: 'school', label: 'School', icon: GraduationCap, color: 'bg-indigo-500' },
  { id: 'rent', label: 'Rent', icon: HomeIcon, color: 'bg-purple-500' },
  { id: 'petrol', label: 'Petrol', icon: Fuel, color: 'bg-blue-500' },
  { id: 'food', label: 'Food', icon: Utensils, color: 'bg-orange-500' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'bg-pink-500' },
];

export default function Layout({ children, activeTab, setActiveTab, onAddClick }: LayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'chatbot', icon: Bot, label: 'Chatbot' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="mobile-container flex flex-col bg-slate-50">
      {/* Top Ad Banner */}
      <div className="bg-indigo-600/5 p-2 border-b border-indigo-100 flex items-center justify-center gap-2">
        <span className="text-[8px] font-bold bg-indigo-600 text-white px-1 rounded tracking-tighter">AD</span>
        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Get 10% Cashback on Groceries</p>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Floating Chatbot Window */}
        <AnimatePresence>
          {isChatOpen && (
            <Chatbot isFloating onClose={() => setIsChatOpen(false)} />
          )}
        </AnimatePresence>

        {/* Add Expense Menu Overlay */}
        {isAddMenuOpen && (
          <>
            <div 
              onClick={() => setIsAddMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[120]"
            />
            <div className="fixed bottom-[155px] right-4 flex flex-col-reverse items-end gap-3 z-[130]">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onAddClick(cat.id);
                    setIsAddMenuOpen(false);
                  }}
                  className="flex items-center gap-3 group"
                >
                  <span className="bg-white px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-lg border border-slate-100 whitespace-nowrap">
                    {cat.label}
                  </span>
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg",
                    cat.color
                  )}>
                    <cat.icon size={20} />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Static Add Expense Button (Bottom Right FAB) */}
        <div className="fixed bottom-[85px] right-4 z-[150]">
          <button
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className={cn(
              "w-16 h-16 rounded-full shadow-xl flex items-center justify-center",
              isAddMenuOpen 
                ? "bg-slate-800 text-white" 
                : "bg-indigo-600 text-white"
            )}
          >
            <Plus size={32} strokeWidth={2.5} />
          </button>
        </div>
      </main>

      {/* Bottom Ad Banner (Fixed) */}
      <div className="bg-white p-2 border-t border-slate-100 flex items-center justify-center gap-2 safe-area-bottom">
        <span className="text-[8px] font-bold bg-slate-400 text-white px-1 rounded tracking-tighter">AD</span>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personal Loan at 8.99% p.a. - Apply Now</p>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors w-16",
              activeTab === tab.id ? "text-indigo-600" : "text-slate-400"
            )}
          >
            <tab.icon size={22} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
