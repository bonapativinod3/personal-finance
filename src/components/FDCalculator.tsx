import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Building2, Calculator, ArrowRight, Info, Percent, Calendar, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';

interface FDCalculatorProps {
  onInvest?: (data: any) => void;
}

export default function FDCalculator({ onInvest }: FDCalculatorProps) {
  const [amount, setAmount] = useState<number>(50000);
  const [rate, setRate] = useState<number>(7.1);
  const [tenure, setTenure] = useState<number>(1); // years

  const calculation = useMemo(() => {
    const principal = amount;
    const r = rate / 100;
    const n = 4; // Quarterly compounding
    const t = tenure;
    
    // Formula: A = P(1 + r/n)^(nt)
    const maturityAmount = principal * Math.pow(1 + r / n, n * t);
    const interestEarned = maturityAmount - principal;
    
    return {
      maturityAmount: Math.round(maturityAmount),
      interestEarned: Math.round(interestEarned),
    };
  }, [amount, rate, tenure]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 bg-indigo-50 p-6 rounded-[32px] border border-indigo-100">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Calculator size={24} />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-slate-800">FD Calculator</h2>
          <p className="text-slate-400 text-sm font-medium">Plan your future returns</p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm space-y-8">
        {/* Amount Input */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Investment Amount</label>
            <span className="text-lg font-display font-bold text-indigo-600">₹{amount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="5000"
            max="1000000"
            step="5000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>₹5K</span>
            <span>₹10L</span>
          </div>
        </div>

        {/* Rate & Tenure */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Interest Rate (%)</label>
            <div className="relative">
              <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Tenure (Years)</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-6 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-2 gap-8">
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Interest Earned</p>
              <p className="text-xl font-display font-bold text-green-400">₹{calculation.interestEarned.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Maturity Value</p>
              <p className="text-xl font-display font-bold">₹{calculation.maturityAmount.toLocaleString()}</p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>

        <button 
          onClick={() => onInvest?.({ amount, rate, tenure, ...calculation })}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
        >
          Invest Now <ArrowRight size={18} />
        </button>
      </div>

      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
        <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          Interest rates are subject to bank policies. Calculation assumes quarterly compounding.
        </p>
      </div>
    </div>
  );
}
