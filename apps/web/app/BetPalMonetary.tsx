"use client"

import { useState, useEffect } from 'react';
import MonetaryBetForm from './MonetaryBetForm';
import IdentityVerification from './IdentityVerification';
import PaymentSettingsPage from './PaymentSettingsPage';
import { 
  DollarSign, Calendar, ArrowRight, Trophy, AlertCircle, Shield, 
  Users, Wallet, CreditCard, Info, Bell, CheckCircle, X, ChevronRight, 
  Filter, Search, Loader2, Plus, UserCheck
} from 'lucide-react';

// Interface for Monetary Bet
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

// Interface for User
interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  isVerified: boolean;
  balance: number;
  totalBets: number;
  winRate: number;
}

// Main component
const BetPalMonetary = () => {
  // State hooks
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isIdentityVerificationOpen, setIsIdentityVerificationOpen] = useState<boolean>(false);
  const [isPaymentSettingsOpen, setIsPaymentSettingsOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Sample user data
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: "Ava Cook",
    email: "ava.cook@example.com",
    image: "/api/placeholder/40/40",
    isVerified: false,
    balance: 72.50,
    totalBets: 8,
    winRate: 62.5
  });
  
  // Sample bets data
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
  
  // Filter bets by category
  const filteredBets = selectedCategory === 'all' 
    ? moneyBets 
    : moneyBets.filter(bet => bet.category === selectedCategory);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle creating a new bet
  const handleCreateBet = (betData: any) => {
    // If user is not verified, prompt for verification
    if (!currentUser.isVerified) {
      setIsCreateModalOpen(false);
      setIsIdentityVerificationOpen(true);
      return;
    }
    
    const newBet: MoneyBet = {
      id: Date.now(),
      user1: currentUser.name,
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
    setIsCreateModalOpen(false);
  };
  
  // Handle identity verification completion
  const handleVerificationComplete = () => {
    setIsIdentityVerificationOpen(false);
    
    // Update user's verification status
    setCurrentUser({
      ...currentUser,
      isVerified: true
    });
    
    // Show a delayed notification
    setTimeout(() => {
      alert("Identity verification has been submitted successfully! You'll be notified once the verification process is complete.");
    }, 500);
  };
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-700',
          icon: <CheckCircle className="w-4 h-4 mr-1" />
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-700',
          icon: <Info className="w-4 h-4 mr-1" />
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-700',
          icon: <Trophy className="w-4 h-4 mr-1" />
        };
      case 'canceled':
        return {
          color: 'bg-red-100 text-red-700',
          icon: <X className="w-4 h-4 mr-1" />
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700',
          icon: <AlertCircle className="w-4 h-4 mr-1" />
        };
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Money Bets</h1>
          <p className="text-gray-600">Place real money bets with friends securely through BetPal</p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Money Bet
          </button>
          
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center"
            onClick={() => setIsPaymentSettingsOpen(true)}
          >
            <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
            Payment Settings
          </button>
          
          {!currentUser.isVerified && (
            <button
              className="px-4 py-2 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-lg hover:bg-yellow-200 transition-colors shadow-sm flex items-center justify-center"
              onClick={() => setIsIdentityVerificationOpen(true)}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Verify Identity
            </button>
          )}
        </div>
      </div>
      
      {/* Account Overview */}
      <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Wallet className="w-5 h-5 mr-2 text-green-600" />
          Account Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Available Balance</span>
            <span className="text-2xl font-bold text-green-600">{formatCurrency(currentUser.balance)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Total Bets</span>
            <span className="text-2xl font-bold text-gray-900">{currentUser.totalBets}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Win Rate</span>
            <span className="text-2xl font-bold text-gray-900">{currentUser.winRate}%</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Verification Status</span>
            <span className={`flex items-center ${currentUser.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
              {currentUser.isVerified ? (
                <>
                  <Shield className="w-5 h-5 mr-1" />
                  Verified
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 mr-1" />
                  Verification Required
                </>
              )}
            </span>
          </div>
        </div>
      </div>
      
      {/* Filter and Category Selector */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mr-2">Filter by:</div>
        <button
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            selectedCategory === 'all' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          All Categories
        </button>
        <button
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            selectedCategory === 'sports' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedCategory('sports')}
        >
          Sports
        </button>
        <button
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            selectedCategory === 'politics' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedCategory('politics')}
        >
          Politics
        </button>
        <button
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            selectedCategory === 'entertainment' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedCategory('entertainment')}
        >
          Entertainment
        </button>
        <button
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            selectedCategory === 'fitness' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedCategory('fitness')}
        >
          Fitness
        </button>
      </div>
      
      {/* Money Bets List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Your Money Bets
          </h2>
        </div>
        
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
              <p className="text-gray-500">Loading your bets...</p>
            </div>
          </div>
        ) : filteredBets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No money bets found</h3>
            <p className="text-gray-500 mb-6">You haven't placed any money bets in this category yet.</p>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center mx-auto"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Money Bet
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredBets.map(bet => (
              <div key={bet.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${getStatusInfo(bet.status).color} mr-2`}>
                        {getStatusInfo(bet.status).icon}
                        {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                      </span>
                      {bet.category && (
                        <span className="inline-flex items-center text-xs bg-indigo-100 px-2 py-1 rounded-full text-indigo-700">
                          {bet.category.charAt(0).toUpperCase() + bet.category.slice(1)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-lg text-gray-900 mb-1">{bet.bet}</h3>
                    <p className="text-sm text-gray-600">
                      With <span className="font-medium text-gray-800">{bet.user1 === currentUser.name ? bet.user2 : bet.user1}</span>
                      {" • "} Due: {formatDate(bet.dueDate)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-100 text-center">
                      <p className="text-sm text-gray-600">Your Stake</p>
                      <p className="text-lg font-bold text-green-700">{formatCurrency(bet.amount)}</p>
                      <p className="text-xs text-gray-500">Potential win: {formatCurrency(bet.potentialWin)}</p>
                    </div>
                    
                    {bet.status === 'completed' && bet.winner && (
                      <div className="mt-2">
                        <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                          bet.winner === currentUser.name ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {bet.winner === currentUser.name ? (
                            <>
                              <Trophy className="w-3 h-3 mr-1" />
                              You Won
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              You Lost
                            </>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
                  <div>
                    Payment: {bet.paymentMethod}
                  </div>
                  <button className="text-green-600 hover:text-green-800 flex items-center">
                    View Details
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Responsible Gambling Notice */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100 text-sm text-blue-800">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Responsible Gambling</p>
            <p>BetPal is committed to promoting responsible gambling. Set limits, take breaks, and never bet more than you can afford to lose. If you have concerns about your gambling habits, please contact our support team.</p>
          </div>
        </div>
      </div>
      
      {/* Create Bet Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <MonetaryBetForm 
              onSubmit={handleCreateBet}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </div>
        </div>
      )}
      
      {/* Identity Verification Modal */}
      {isIdentityVerificationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <IdentityVerification
            onComplete={handleVerificationComplete}
            onCancel={() => setIsIdentityVerificationOpen(false)}
          />
        </div>
      )}
      
      {/* Payment Settings Modal */}
      {isPaymentSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Payment Settings</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsPaymentSettingsOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <PaymentSettingsPage />
          </div>
        </div>
      )}
    </div>
  );
};

export default BetPalMonetary;