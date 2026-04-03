import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie 
} from 'recharts';
import { Transaction, CATEGORIES } from '../types';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';

interface ChartsProps {
  transactions: Transaction[];
}

export function SpendingTrend({ transactions }: ChartsProps) {
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), i);
    return {
      date,
      display: format(date, 'EEE'),
      amount: 0
    };
  }).reverse();

  last7Days.forEach(day => {
    const dayTotal = transactions
      .filter(t => t.type === 'expense' && isSameDay(new Date(t.date), day.date))
      .reduce((sum, t) => sum + t.amount, 0);
    day.amount = dayTotal;
  });

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={last7Days}>
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-800 text-white px-3 py-1 rounded-lg text-xs font-bold">
                    ₹{payload[0].value}
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="amount" 
            radius={[4, 4, 0, 0]} 
            fill="#6366f1"
          >
            {last7Days.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.amount > 0 ? '#6366f1' : '#e2e8f0'} 
              />
            ))}
          </Bar>
          <XAxis 
            dataKey="display" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPie({ transactions }: ChartsProps) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryTotals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    color: CATEGORIES[name]?.color.replace('bg-', '#').replace('-500', '') || '#94a3b8'
  })).sort((a, b) => b.value - a.value);

  const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.slice(0, 4).map((item, i) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-xs font-medium text-slate-600 truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
