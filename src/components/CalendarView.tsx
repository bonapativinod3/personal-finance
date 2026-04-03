import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Transaction } from '../types';

interface CalendarViewProps {
  transactions: Transaction[];
  onDateSelect?: (date: Date) => void;
}

export default function CalendarView({ transactions, onDateSelect }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getDayTransactions = (day: Date) => {
    return transactions.filter(t => isSameDay(new Date(t.date), day));
  };

  const getDayTotal = (day: Date) => {
    return getDayTransactions(day)
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const selectedDayTransactions = getDayTransactions(selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold text-slate-800">Calendar</h1>
        <div className="flex items-center gap-4 bg-white border border-slate-100 p-1 rounded-2xl shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <ChevronLeft size={20} className="text-slate-400" />
          </button>
          <span className="text-sm font-bold text-slate-700 min-w-[100px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <ChevronRight size={20} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
        <div className="grid grid-cols-7 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            const dayTransactions = getDayTransactions(day);
            const expenseTotal = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const incomeTotal = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameDay(startOfMonth(day), monthStart);
            
            return (
              <button
                key={i}
                onClick={() => {
                  setSelectedDate(day);
                  onDateSelect?.(day);
                }}
                className={cn(
                  "relative aspect-square flex flex-col items-center justify-center rounded-2xl transition-all p-1",
                  !isCurrentMonth && "opacity-20",
                  isSelected ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "hover:bg-slate-50"
                )}
              >
                <span className={cn("text-xs font-bold", isSelected ? "text-white" : "text-slate-700")}>
                  {format(day, 'd')}
                </span>
                <div className="flex gap-0.5 mt-1">
                  {incomeTotal > 0 && (
                    <div className={cn(
                      "w-1 h-1 rounded-full",
                      isSelected ? "bg-white" : "bg-green-400"
                    )} />
                  )}
                  {expenseTotal > 0 && (
                    <div className={cn(
                      "w-1 h-1 rounded-full",
                      isSelected ? "bg-white" : "bg-red-400"
                    )} />
                  )}
                </div>
                {expenseTotal > 0 && isCurrentMonth && !isSelected && (
                  <span className="absolute bottom-1 text-[7px] font-bold text-red-400">
                    ₹{expenseTotal > 999 ? `${(expenseTotal/1000).toFixed(1)}k` : expenseTotal}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Transactions */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-display font-bold text-slate-800">
            {isSameDay(selectedDate, new Date()) ? 'Today' : format(selectedDate, 'MMM dd, yyyy')}
          </h3>
          <div className="bg-slate-100 px-3 py-1 rounded-full">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Total: ₹{getDayTotal(selectedDate).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {selectedDayTransactions.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-8 text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-300 shadow-sm">
                <CalendarIcon size={24} />
              </div>
              <p className="text-slate-400 text-sm font-medium">No transactions for this day</p>
            </div>
          ) : (
            selectedDayTransactions.map((t) => (
              <div key={t.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <CalendarIcon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">{t.note || t.category}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.category}</p>
                </div>
                <p className={cn("font-display font-bold", t.type === 'income' ? "text-green-500" : "text-slate-800")}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
