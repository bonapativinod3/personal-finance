import React from 'react';
import { ExternalLink } from 'lucide-react';

interface AdSpaceProps {
  type: 'banner' | 'square' | 'native';
  className?: string;
}

export default function AdSpace({ type, className }: AdSpaceProps) {
  const ads = [
    {
      title: 'Get 10% Cashback on Groceries',
      description: 'Use your FinCard for all grocery purchases this month.',
      cta: 'Apply Now',
      color: 'bg-blue-50 text-blue-700 border-blue-100',
    },
    {
      title: 'Personal Loan at 8.99% p.a.',
      description: 'Instant approval for FinCompanion users. No paperwork.',
      cta: 'Check Eligibility',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    },
    {
      title: 'Upgrade to Premium',
      description: 'Get advanced insights, multi-currency support and no ads.',
      cta: 'Go Premium',
      color: 'bg-amber-50 text-amber-700 border-amber-100',
    }
  ];

  const ad = ads[Math.floor(Math.random() * ads.length)];

  if (type === 'banner') {
    return (
      <div className={`p-4 rounded-2xl border ${ad.color} flex items-center justify-between gap-4 ${className}`}>
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1 block">Sponsored</span>
          <h4 className="text-sm font-bold leading-tight">{ad.title}</h4>
        </div>
        <button className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 shrink-0">
          {ad.cta} <ExternalLink size={12} />
        </button>
      </div>
    );
  }

  if (type === 'square') {
    return (
      <div className={`p-6 rounded-[32px] border ${ad.color} flex flex-col gap-3 ${className}`}>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Sponsored</span>
        <h4 className="text-lg font-display font-bold leading-tight">{ad.title}</h4>
        <p className="text-xs opacity-80 leading-relaxed">{ad.description}</p>
        <button className="w-full py-2.5 bg-white rounded-xl text-sm font-bold shadow-sm mt-2">
          {ad.cta}
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
        <span className="text-[10px] font-bold">AD</span>
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-bold text-slate-800">{ad.title}</h4>
        <p className="text-[10px] text-slate-500 line-clamp-1">{ad.description}</p>
      </div>
      <button className="text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
        {ad.cta}
      </button>
    </div>
  );
}
