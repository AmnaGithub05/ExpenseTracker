import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, Trash2, Calendar, Tag, PieChart } from 'lucide-react';

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [type, setType] = useState('expense');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('money_tracker_expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('money_tracker_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const categories = [
    { value: 'food', label: 'Food', color: 'bg-orange-500' },
    { value: 'transport', label: 'Transport', color: 'bg-blue-500' },
    { value: 'entertainment', label: 'Entertainment', color: 'bg-purple-500' },
    { value: 'bills', label: 'Bills', color: 'bg-red-500' },
    { value: 'shopping', label: 'Shopping', color: 'bg-pink-500' },
    { value: 'health', label: 'Health', color: 'bg-green-500' },
    { value: 'other', label: 'Other', color: 'bg-gray-500' }
  ];

  const addTransaction = () => {
    if (description.trim() && amount && parseFloat(amount) > 0) {
      const newExpense = {
        id: Date.now(),
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        type,
        date: new Date().toISOString()
      };
      setExpenses([newExpense, ...expenses]);
      setDescription('');
      setAmount('');
    }
  };

  const deleteTransaction = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const filteredExpenses = expenses.filter(e => {
    if (filter === 'all') return true;
    if (filter === 'expense') return e.type === 'expense';
    if (filter === 'income') return e.type === 'income';
    return true;
  });

  const totalIncome = expenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = expenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpenses;

  const getCategoryStats = () => {
    const stats = {};
    expenses
      .filter(e => e.type === 'expense')
      .forEach(e => {
        stats[e.category] = (stats[e.category] || 0) + e.amount;
      });
    return Object.entries(stats)
      .map(([cat, amt]) => ({
        category: cat,
        amount: amt,
        percentage: totalExpenses > 0 ? (amt / totalExpenses * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const categoryStats = getCategoryStats();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryColor = (cat) => {
    return categories.find(c => c.value === cat)?.color || 'bg-gray-500';
  };

  const getCategoryLabel = (cat) => {
    return categories.find(c => c.value === cat)?.label || 'Other';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">MoneyTracker</h1>
          <p className="text-gray-600">Take control of your finances</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <TrendingUp size={24} />
              </div>
              <span className="text-lg font-medium">Income</span>
            </div>
            <div className="text-4xl font-bold">${totalIncome.toFixed(2)}</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <TrendingDown size={24} />
              </div>
              <span className="text-lg font-medium">Expenses</span>
            </div>
            <div className="text-4xl font-bold">${totalExpenses.toFixed(2)}</div>
          </div>

          <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-2xl shadow-xl p-6 text-white`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <DollarSign size={24} />
              </div>
              <span className="text-lg font-medium">Balance</span>
            </div>
            <div className="text-4xl font-bold">${balance.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Transaction</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Grocery shopping"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={addTransaction}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Transaction
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('income')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'income' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setFilter('expense')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Expenses
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <PieChart size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No transactions yet</p>
                </div>
              ) : (
                filteredExpenses.map(exp => (
                  <div
                    key={exp.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className={`w-12 h-12 ${getCategoryColor(exp.category)} rounded-lg flex items-center justify-center text-white`}>
                      <Tag size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{exp.description}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar size={14} />
                        {formatDate(exp.date)} • {getCategoryLabel(exp.category)}
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${exp.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {exp.type === 'income' ? '+' : '-'}${exp.amount.toFixed(2)}
                    </div>
                    <button
                      onClick={() => deleteTransaction(exp.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Spending by Category</h2>
            <div className="space-y-4">
              {categoryStats.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No expenses yet</p>
                </div>
              ) : (
                categoryStats.map((stat, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{getCategoryLabel(stat.category)}</span>
                      <span className="text-sm font-bold text-gray-800">${stat.amount.toFixed(2)}</span>
                    </div>
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getCategoryColor(stat.category)} transition-all duration-500`}
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{stat.percentage}% of total</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Built with React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}