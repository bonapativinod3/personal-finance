import React, { useState, useEffect } from 'react';
import { Transaction, Goal, FixedDeposit } from '../types';

const STORAGE_KEY_TRANSACTIONS = 'fincompanion_transactions';
const STORAGE_KEY_GOALS = 'fincompanion_goals';
const STORAGE_KEY_FDS = 'fincompanion_fds';

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 2500, type: 'income', category: 'Salary', date: new Date().toISOString(), note: 'Monthly Salary' },
  { id: '2', amount: 45, type: 'expense', category: 'Food', date: new Date().toISOString(), note: 'Lunch at cafe' },
  { id: '3', amount: 120, type: 'expense', category: 'Shopping', date: new Date().toISOString(), note: 'New shoes' },
];

const INITIAL_GOALS: Goal[] = [
  { id: '1', name: 'New Laptop', targetAmount: 1500, currentAmount: 450, deadline: '2026-12-31' },
];

const INITIAL_FDS: FixedDeposit[] = [
  { 
    id: '1', 
    bankName: 'HDFC Bank', 
    principalAmount: 50000, 
    interestRate: 7.1, 
    startDate: '2025-01-01', 
    maturityDate: '2026-01-01', 
    isMatured: true 
  },
  { 
    id: '2', 
    bankName: 'SBI Bank', 
    principalAmount: 100000, 
    interestRate: 6.8, 
    startDate: '2025-06-01', 
    maturityDate: '2027-06-01', 
    isMatured: false 
  },
];

export function useFinanceData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [fds, setFds] = useState<FixedDeposit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTransactions = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    const savedGoals = localStorage.getItem(STORAGE_KEY_GOALS);
    const savedFds = localStorage.getItem(STORAGE_KEY_FDS);

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
    }

    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      setGoals(INITIAL_GOALS);
    }

    if (savedFds) {
      setFds(JSON.parse(savedFds));
    } else {
      setFds(INITIAL_FDS);
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goals));
    }
  }, [goals, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_FDS, JSON.stringify(fds));
    }
  }, [fds, isLoaded]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addGoal = (g: Omit<Goal, 'id'>) => {
    const newGoal = { ...g, id: Math.random().toString(36).substr(2, 9) };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addFd = (f: Omit<FixedDeposit, 'id'>) => {
    const newFd = { ...f, id: Math.random().toString(36).substr(2, 9) };
    setFds(prev => [...prev, newFd]);
  };

  const updateFd = (id: string, updates: Partial<FixedDeposit>) => {
    setFds(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFd = (id: string) => {
    setFds(prev => prev.filter(f => f.id !== id));
  };

  return {
    transactions,
    goals,
    fds,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    addFd,
    updateFd,
    deleteFd,
    isLoaded
  };
}
