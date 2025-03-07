"use client"

import { useState } from 'react';
import MonetaryBetForm from './MonetaryBetForm';
import BetTypeToggle from './BetTypeToggle';
import { DollarSign, ChevronRight, Trophy, Star, AlertCircle, Shield, Plus, X, Minus, RefreshCw } from 'lucide-react';

interface MoneyBet {
  id: number;
  user1: string;
  user2: string;
  bet: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'active' | 'completed' | 'canceled';
  winner?: string;
  category?: string;
  createdAt: string;
  potentialWin: number;
  paymentMethod: string;
}

const MonetaryBetIntegration= () => {
  // State hooks
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  const [showNewBetModal, setShowNewBetModal] = useState<boolean>(false);
  //const [selectedFriend, setSelectedFriend] = useState<string>('');
  
  // Sample money bets data
  const [moneyBets, setMoneyBets] = useState<MoneyBet[]>([
    {
      id: 1,
      user1: "Ava Cook",
      user2: "Alex Johnson",
      bet: "Chiefs to win Super Bowl",
      amount: 50,
      dueDate: "2025-02-11",
      status: 'active',
      category: 'sports',
      createdAt: '2025-01-15',
      potentialWin: 95,
      paymentMethod: "Visa •••• 4242"
    },
    {
      id: 2,
      user1: "Ava Cook",
      user2: "Morgan Lewis",
      bet: "Lakers vs Warriors game",
      amount: 25,
      dueDate: "2025-03-05",
      status: 'pending',
      category: 'sports',
      createdAt: '2025-02-28',
      potentialWin: 47.5,
      paymentMethod: "Mastercard •••• 8888"
    },
    {
      id: 3,
      user1: "Jamie Smith",
      user2: "Ava Cook",
      bet: "Oscar Best Picture winner",
      amount: 20,
      dueDate: "2025-03-10",
      status: 'completed',
      winner: "Jamie Smith",
      category: 'entertainment',
      createdAt: '2025-02-01',
      potentialWin: 38,
      paymentMethod: "Visa •••• 4242"
    },
    {
      id: 4,
      user1: "Ava Cook",
      user2: "Riley Parker",
      bet: "Election debate winner",
      amount: 30,
      dueDate: "2025-04-15",
      status: 'completed',
      winner: "Ava Cook",
      category: 'politics',
      createdAt: '2025-03-01',
      potentialWin: 57,
      paymentMethod: "Visa •••• 4242"
    },
    {
      id: 5,
      user1: "Taylor Reed",
      user2: "Ava Cook",
      bet: "Marathon finishing time",
      amount: 40,
      dueDate: "2025-01-20",
      status: 'canceled',
      category: 'fitness',
      createdAt: '2024-12-15',
      potentialWin: 76,
      paymentMethod: "Mastercard •••• 8888"
    }
  ]);
  
  // Sample friends for creating new bets
  const friends = [
    { id: 1, name: "Alex Johnson" },
    { id: 2, name: "Morgan Lewis" },
    { id: 3, name: "Jamie Smith" },
    { id: 4, name: "Riley Parker" },
    { id: 5, name: "Sarah Williams" }
  ];
  
  // Handle creating a new bet
  const handleCreateBet = (betData: any) => {
    const newBet: MoneyBet = {
      id: Date.now(),
      user1: "Ava Cook",
      user2: betData.opponent,
      bet: betData.description,
      amount: betData.amount,
      dueDate: betData.dueDate,
      status: 'pending',
      category: 'other',
      createdAt: new Date().toISOString().split('T')[0],
      potentialWin: betData.amount * 1.9,
      paymentMethod: `${betData.paymentMethod?.name} •••• ${betData.paymentMethod?.lastFour}`
    };
    
    setMoneyBets([newBet, ...moneyBets]);
    setShowNewBetModal(false);
    alert(`Money bet created successfully! ${betData.opponent} will receive a notification.`);
  };
  
  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>;
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Completed</span>;
      case 'canceled':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Canceled</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Money Bets</h2>
          <p className="text-gray-600">Bet real money with your friends</p>
        </div>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow flex items-center"
          onClick={() => setShowNewBetModal(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          New Money Bet
        </button>
      </div>
      
      {/* Content for money bets would go here */}
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <DollarSign className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h3 className="text-xl font-bold mb-2">Real Money Betting Available!</h3>
        <p className="text-gray-600 mb-4">
          You can now place real money bets with your friends securely through BetPal.
        </p>
        <p className="bg-green-50 p-3 rounded-lg text-green-800 text-sm">
          All transactions are secured with bank-level encryption and our escrow system ensures fair payouts.
        </p>
      </div>
    </div>
  );
};

export default MonetaryBetIntegration;