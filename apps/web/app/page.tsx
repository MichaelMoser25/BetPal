"use client"
import MyBetsPage from './MyBetsPage';
import FriendsPage from './FriendsPage';
import EnhancedMyBetsPage from './EnhancedMyBetsPage';
import BetTypeToggle from './BetTypeToggle';
import BetPalMonetary from './BetPalMonetary';

import { Handshake, Trophy, Shield, Users, Award, Zap, ChevronDown, Bell, Search, Menu, X, User, TrendingUp, DollarSign, Calendar, ArrowRight, Bookmark, Camera, ThumbsUp, MessageSquare, PieChart, Filter, Star, Crown, Plus, Gift, Clock, Activity, AlertCircle, HelpCircle, FileText, Settings, Share2, Trash2, LogOut, ChevronRight, Mail, UserPlus, Check, Loader2, Lock } from 'lucide-react';
import { ReactNode, useState, useEffect, useRef } from 'react';

// Define TypeScript interface for FeatureCard props
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

// Define interface for Bet
interface Bet {
  id: number;
  user1: string;
  user2: string;
  bet: string;
  stake: string;
  dueDate: string;
  status: 'pending' | 'active' | 'completed' | 'canceled';
  winner?: string;
  category?: string;
  createdAt: string;
}

// Define interface for User
interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  wins: number;
  losses: number;
  activeBets: number;
  pendingBets: number;
}

// Feature Card Component with type safety
const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
    <div className="flex flex-col items-center text-center space-y-5">
      <div className="p-4 bg-blue-50 rounded-full transform group-hover:scale-110 transition-all duration-300 ring-2 ring-blue-100 group-hover:ring-blue-300">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

// Testimonial component
interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
}

const Testimonial = ({ quote, name, title }: TestimonialProps) => (
  <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
    <div className="flex flex-col space-y-4">
      <div className="text-blue-500 text-4xl font-serif">"</div>
      <p className="text-gray-700 italic">{quote}</p>
      <div className="mt-4">
        <p className="font-bold text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  </div>
);

// Stat component
interface StatProps {
  value: string;
  label: string;
  icon: ReactNode;
}

const Stat = ({ value, label, icon }: StatProps) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
    <div className="text-blue-500 mb-3">{icon}</div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
    <div className="text-gray-600 mt-1">{label}</div>
  </div>
);

// Notification component
interface NotificationProps {
  id: number;
  type: 'bet_request' | 'win' | 'loss' | 'reminder' | 'friend_request';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// Create a live bet display component
const LiveBetDisplay = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  
  const liveBets: Bet[] = [
    { id: 1, user1: "Alex", user2: "Jordan", bet: "Super Bowl Winner", stake: "Dinner", dueDate: "Feb 11", status: 'active', category: 'sports', createdAt: '2025-01-15' },
    { id: 2, user1: "Taylor", user2: "Morgan", bet: "Marathon Time", stake: "Coffee for a month", dueDate: "Apr 15", status: 'active', category: 'fitness', createdAt: '2025-02-01' },
    { id: 3, user1: "Casey", user2: "Riley", bet: "Election Outcome", stake: "Car wash", dueDate: "Nov 5", status: 'active', category: 'politics', createdAt: '2025-01-23' },
    { id: 4, user1: "Jamie", user2: "Quinn", bet: "Oscar Best Picture", stake: "Movie tickets", dueDate: "Mar 10", status: 'active', category: 'entertainment', createdAt: '2025-01-30' },
  ];
  
  const categories = ['all', 'sports', 'fitness', 'politics', 'entertainment', 'personal'];
  
  const filteredBets = selectedCategory === 'all' 
    ? liveBets 
    : liveBets.filter(bet => bet.category === selectedCategory);

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Live Bets Happening Now
        </h3>
        <div className="flex items-center space-x-3">
          <button 
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            onClick={() => setIsFiltering(!isFiltering)}
          >
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </button>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
            See All
          </button>
        </div>
      </div>
      
      {isFiltering && (
        <div className="flex overflow-x-auto pb-3 mb-3 -mx-1 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category}
              className={`px-3 py-1 mx-1 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}
      
      <div className="space-y-4">
        {filteredBets.length > 0 ? (
          filteredBets.map(bet => (
            <div key={bet.id} className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-900">{bet.user1} vs {bet.user2}</div>
                <div className="text-sm text-gray-600">{bet.bet}</div>
                <div className="mt-1 flex items-center space-x-3">
                  <span className="inline-flex items-center text-xs bg-blue-100 px-2 py-1 rounded text-blue-700">
                    <DollarSign className="w-3 h-3 mr-1" /> {bet.stake}
                  </span>
                  <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                    <Calendar className="w-3 h-3 mr-1" /> Due: {bet.dueDate}
                  </span>
                  {bet.category && (
                    <span className="inline-flex items-center text-xs bg-indigo-100 px-2 py-1 rounded text-indigo-700">
                      <Bookmark className="w-3 h-3 mr-1" /> {bet.category}
                    </span>
                  )}
                </div>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors">
                Details
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No bets found for this category
          </div>
        )}
      </div>
    </div>
  );
};

// Create a bet creation form component with enhanced functionality
const QuickBetForm = () => {
  const [category, setCategory] = useState<string>('sports');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [friend, setFriend] = useState<string>('');
  const [betDescription, setBetDescription] = useState<string>('');
  const [stake, setStake] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  
  const categories = ['sports', 'fitness', 'politics', 'entertainment', 'personal'];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      // Reset form
      setFriend('');
      setBetDescription('');
      setStake('');
      setDeadline('');
      setIsCreating(false);
      
      // Show success message
      alert('Bet created successfully! Your friend will receive a notification.');
    }, 1500);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Create a Quick Bet</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Who are you betting with?</label>
          <input 
            type="text" 
            placeholder="Friend's name or email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={friend}
            onChange={(e) => setFriend(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`px-3 py-1 rounded-full text-xs ${
                  category === cat 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">What's the bet?</label>
          <input 
            type="text" 
            placeholder="E.g., Who will win the game tonight?"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={betDescription}
            onChange={(e) => setBetDescription(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stake (non-monetary)</label>
            <input 
              type="text" 
              placeholder="E.g., Lunch, Coffee, etc."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input 
              type="date" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            type="submit"
            disabled={isCreating}
            className={`flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center ${isCreating && 'opacity-70'}`}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Bet'
            )}
          </button>
          <button 
            type="button"
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center">
          You can add evidence or photos to this bet once created
        </p>
      </form>
    </div>
  );
};

// Enhanced leaderboard component
const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'allTime'>('month');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const weeklyLeaders = [
    { rank: 1, name: "Jamie Smith", wins: 8, image: "/api/placeholder/40/40" },
    { rank: 2, name: "Riley Parker", wins: 7, image: "/api/placeholder/40/40" },
    { rank: 3, name: "Casey Morgan", wins: 6, image: "/api/placeholder/40/40" },
    { rank: 4, name: "Taylor Reed", wins: 5, image: "/api/placeholder/40/40" },
    { rank: 5, name: "Jordan Lee", wins: 4, image: "/api/placeholder/40/40" },
  ];
  
  const monthlyLeaders = [
    { rank: 1, name: "Sarah Williams", wins: 32, image: "/api/placeholder/40/40" },
    { rank: 2, name: "Michael Chen", wins: 28, image: "/api/placeholder/40/40" },
    { rank: 3, name: "Alex Johnson", wins: 26, image: "/api/placeholder/40/40" },
    { rank: 4, name: "Jamie Smith", wins: 21, image: "/api/placeholder/40/40" },
    { rank: 5, name: "Taylor Reed", wins: 18, image: "/api/placeholder/40/40" },
  ];
  
  const allTimeLeaders = [
    { rank: 1, name: "Michael Chen", wins: 142, image: "/api/placeholder/40/40" },
    { rank: 2, name: "Sarah Williams", wins: 137, image: "/api/placeholder/40/40" },
    { rank: 3, name: "Alex Johnson", wins: 118, image: "/api/placeholder/40/40" },
    { rank: 4, name: "Taylor Reed", wins: 105, image: "/api/placeholder/40/40" },
    { rank: 5, name: "Jamie Smith", wins: 98, image: "/api/placeholder/40/40" },
  ];
  
  const getLeaders = () => {
    switch(timeframe) {
      case 'week': return weeklyLeaders;
      case 'month': return monthlyLeaders;
      case 'allTime': return allTimeLeaders;
      default: return monthlyLeaders;
    }
  };
  
  const changeTimeframe = (newTimeframe: 'week' | 'month' | 'allTime') => {
    setIsLoading(true);
    setTimeframe(newTimeframe);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-blue-600" />
          Leaderboard
        </h3>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
          Full Rankings
        </button>
      </div>
      
      <div className="flex justify-center mb-4 bg-gray-100 rounded-lg p-1">
        <button 
          className={`px-3 py-1 rounded-lg text-sm ${timeframe === 'week' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-600'}`}
          onClick={() => changeTimeframe('week')}
        >
          This Week
        </button>
        <button 
          className={`px-3 py-1 rounded-lg text-sm ${timeframe === 'month' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-600'}`}
          onClick={() => changeTimeframe('month')}
        >
          This Month
        </button>
        <button 
          className={`px-3 py-1 rounded-lg text-sm ${timeframe === 'allTime' ? 'bg-white shadow-sm text-blue-700' : 'text-gray-600'}`}
          onClick={() => changeTimeframe('allTime')}
        >
          All Time
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="divide-y">
          {getLeaders().map(leader => (
            <div key={leader.rank} className="py-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  leader.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                  leader.rank === 2 ? 'bg-gray-100 text-gray-700' :
                  leader.rank === 3 ? 'bg-amber-100 text-amber-700' : 
                  'bg-blue-50 text-blue-700'
                } font-semibold mr-3`}>
                  {leader.rank}
                </div>
                <div className="flex items-center">
                  <img src={leader.image} alt={leader.name} className="w-10 h-10 rounded-full mr-3" />
                  <span className="font-medium">{leader.name}</span>
                </div>
              </div>
              <div className="text-gray-700 font-medium">
                {leader.wins} {leader.wins === 1 ? 'win' : 'wins'}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Your Rank:</span>
          <span className="font-medium">14th (47 wins)</span>
        </div>
      </div>
    </div>
  );
};

// Notification panel component
const NotificationPanel = ({ onClose }: { onClose: () => void }) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([
    { 
      id: 1, 
      type: 'bet_request', 
      title: 'New Bet Request', 
      message: 'Alex wants to bet on "Lakers vs. Warriors game"',
      time: '2 hours ago',
      read: false
    },
    { 
      id: 2, 
      type: 'win', 
      title: 'You won a bet!', 
      message: 'You won your bet with Taylor about "Marathon Time"',
      time: 'Yesterday',
      read: false
    },
    { 
      id: 3, 
      type: 'reminder', 
      title: 'Bet ending soon', 
      message: 'Your bet with Jordan about "Super Bowl Winner" ends tomorrow',
      time: '2 days ago',
      read: true
    },
    { 
      id: 4, 
      type: 'friend_request', 
      title: 'New friend request', 
      message: 'Morgan wants to connect with you on BetPal',
      time: '3 days ago',
      read: true
    },
  ]);
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };
  
  const getIconForType = (type: string) => {
    switch(type) {
      case 'bet_request': return <Handshake className="w-5 h-5 text-blue-600" />;
      case 'win': return <Trophy className="w-5 h-5 text-green-600" />;
      case 'loss': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'reminder': return <Clock className="w-5 h-5 text-purple-600" />;
      case 'friend_request': return <UserPlus className="w-5 h-5 text-indigo-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="absolute right-0 top-16 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <div className="flex space-x-2">
            <button 
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    {getIconForType(notification.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No notifications yet</p>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <button className="w-full text-sm text-center text-blue-600 hover:text-blue-800">
          View all notifications
        </button>
      </div>
    </div>
  );
};

// User profile menu component
const ProfileMenu = ({ onClose }: { onClose: () => void }) => {
  const user = {
    name: 'Ava Apple',
    email: 'tom@example.com',
    image: '/api/placeholder/40/40'
  };
  
  const menuItems = [
    { icon: <User className="w-4 h-4" />, label: 'Your Profile' },
    { icon: <Trophy className="w-4 h-4" />, label: 'Your Achievements' },
    { icon: <FileText className="w-4 h-4" />, label: 'Your Bet History' },
    { icon: <MessageSquare className="w-4 h-4" />, label: 'Messages' },
    { icon: <Settings className="w-4 h-4" />, label: 'Settings' },
    { icon: <HelpCircle className="w-4 h-4" />, label: 'Help Center' },
  ];

  return (
    <div className="absolute right-0 top-16 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center">
          <img 
            src={user.image} 
            alt={user.name} 
            className="w-10 h-10 rounded-full mr-3" 
          />
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
      
      <div className="py-2">
        {menuItems.map((item, index) => (
          <button 
            key={index} 
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <span className="mr-3 text-gray-500">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
      
      <div className="p-2 border-t border-gray-100">
        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center">
          <LogOut className="w-4 h-4 mr-3" />
          Sign out
        </button>
      </div>
    </div>
  );
};

// Friend Activity Feed component
const FriendActivityFeed = () => {
  const activities = [
    { 
      id: 1, 
      user: 'Sarah Williams',
      action: 'won a bet against',
      target: 'Alex Johnson',
      bet: 'Who would win the Grammy for Best Album',
      time: '2 hours ago',
      image: '/api/placeholder/40/40'
    },
    { 
      id: 2, 
      user: 'Michael Chen',
      action: 'created a new bet with',
      target: 'Riley Parker',
      bet: 'Who will finish the coding project first',
      time: '4 hours ago',
      image: '/api/placeholder/40/40'
    },
    { 
      id: 3, 
      user: 'Casey Morgan',
      action: 'completed a bet with',
      target: 'Taylor Reed',
      bet: 'Who would get more steps this week',
      time: 'Yesterday',
      image: '/api/placeholder/40/40'
    },
    { 
      id: 4, 
      user: 'Jordan Lee',
      action: 'earned the badge',
      target: 'Betting Champion',
      badge: true,
      time: 'Yesterday',
      image: '/api/placeholder/40/40'
    },
  ];
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          Friend Activity
        </h3>
      </div>
      
      <div className="space-y-5">
        {activities.map(activity => (
          <div key={activity.id} className="flex">
            <img 
              src={activity.image} 
              alt={activity.user} 
              className="w-10 h-10 rounded-full mr-3" 
            />
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">{activity.user}</span> {activity.action} {' '}
                {activity.badge ? (
                  <span className="inline-flex items-center px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">
                    <Star className="w-3 h-3 mr-1" />
                    {activity.target}
                  </span>
                ) : (
                  <span className="font-medium text-gray-900">{activity.target}</span>
                )}
                {activity.bet && (
                  <>
                    {' '}on <span className="italic">"{activity.bet}"</span>
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
        View More
      </button>
    </div>
  );
};

// Achievements component
const Achievements = () => {
  const achievements = [
    { id: 1, name: 'First Bet', description: 'Created your first bet', earned: true, icon: <Award className="w-5 h-5 text-yellow-500" /> },
    { id: 2, name: 'Winner', description: 'Won 5 bets', earned: true, icon: <Trophy className="w-5 h-5 text-yellow-500" /> },
    { id: 3, name: 'Social Butterfly', description: 'Connected with 10+ friends', earned: true, icon: <Users className="w-5 h-5 text-yellow-500" /> },
    { id: 4, name: 'Betting Champion', description: 'Won 25 bets', earned: false, icon: <Crown className="w-5 h-5 text-gray-400" /> },
    { id: 5, name: 'Perfect Streak', description: 'Won 10 bets in a row', earned: false, icon: <Zap className="w-5 h-5 text-gray-400" /> },
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-blue-600" />
          Your Achievements
        </h3>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`p-4 rounded-lg flex items-start ${
              achievement.earned ? 'bg-yellow-50 border border-yellow-100' : 'bg-gray-50 border border-gray-100'
            }`}
          >
            <div className="mr-3 mt-1">{achievement.icon}</div>
            <div>
              <h4 className="font-medium text-gray-900">{achievement.name}</h4>
              <p className="text-sm text-gray-600">{achievement.description}</p>
              {achievement.earned ? (
                <span className="inline-flex items-center text-xs text-green-700 mt-1">
                  <Check className="w-3 h-3 mr-1" /> Earned
                </span>
              ) : (
                <span className="inline-flex items-center text-xs text-gray-500 mt-1">
                  <Lock className="w-3 h-3 mr-1" /> Locked
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// Create a navbar component
interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  showMoneyBets?: boolean;
  setShowMoneyBets?: (show: boolean) => void;
}

const Navbar = ({ currentPage, setCurrentPage, showMoneyBets = false, setShowMoneyBets }: NavbarProps) => {  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  const handleNotificationClick = () => {
    setNotificationsOpen(!notificationsOpen);
    if (profileOpen) setProfileOpen(false);
    
    // Reset unread count when opening notifications
    if (!notificationsOpen) setUnreadNotifications(0);
  };
  
  const handleProfileClick = () => {
    setProfileOpen(!profileOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };
  
  const closeNotifications = () => {
    setNotificationsOpen(false);
  };
  
  const closeProfile = () => {
    setProfileOpen(false);
  };
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 mr-2"></div>
              <span className="font-bold text-xl text-gray-900">BetPal</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a 
              onClick={() => setCurrentPage('dashboard')}
              className={`${currentPage === 'dashboard' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}
            >
              Dashboard
            </a>
            <a 
              onClick={() => setCurrentPage('myBets')}
              className={`${currentPage === 'myBets' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}
            >
              My Bets
            </a>
            <a 
              onClick={() => setCurrentPage('friends')}
              className={`${currentPage === 'friends' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}
            >
              Friends
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              Leaderboard
            </a>
            {setShowMoneyBets && (
              <a 
                onClick={() => setShowMoneyBets(!showMoneyBets)}
                className={`${showMoneyBets ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}
              >
                <DollarSign className="w-4 h-4 mr-1" />
                Money Bets
              </a>
            )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none relative"
              onClick={handleNotificationClick}
            >
              <Bell className="h-6 w-6" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            
            {notificationsOpen && <NotificationPanel onClose={closeNotifications} />}
            
            <div className="relative">
              <button 
                className="flex items-center focus:outline-none"
                onClick={handleProfileClick}
              >
                <img 
                  className="h-8 w-8 rounded-full" 
                  src="/api/placeholder/32/32" 
                  alt="User profile"
                />
                <ChevronDown className={`ml-1 h-4 w-4 text-gray-500 transition-transform ${profileOpen ? 'transform rotate-180' : ''}`} />
              </button>
              
              {profileOpen && <ProfileMenu onClose={closeProfile} />}
            </div>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <a href="#" className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            Dashboard
          </a>
          <a href="#" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            My Bets
          </a>
          <a href="#" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            Friends
          </a>
          <a href="#" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            Leaderboard
          </a>
          {setShowMoneyBets && (
            <a 
              onClick={() => setShowMoneyBets(!showMoneyBets)}
              className={`${showMoneyBets ? 'bg-green-50 border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center`}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Money Bets
            </a>
          )}
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <img 
                className="h-10 w-10 rounded-full" 
                src="/api/placeholder/40/40" 
                alt="User profile"
              />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">Ava Cook</div>
              <div className="text-sm font-medium text-gray-500">tom@example.com</div>
            </div>
            <button 
              className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none relative"
              onClick={handleNotificationClick}
            >
              <Bell className="h-6 w-6" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>
          <div className="mt-3 space-y-1">
            <a href="#" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
              Your Profile
            </a>
            <a href="#" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
              Settings
            </a>
            <a href="#" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
              Sign out
            </a>
          </div>
        </div>
      </div>
    )}
  </nav>
);
};

// Create a statistics component with charts
const StatisticsOverview = () => {
  const [activeTab, setActiveTab] = useState('betting');
  const tabs = [
    { id: 'betting', label: 'Betting Stats' },
    { id: 'friends', label: 'Friend Activity' },
    { id: 'categories', label: 'Categories' }
  ];
  
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-blue-600" />
          Your Stats Overview
        </h3>
      </div>
      
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeTab === tab.id 
              ? 'text-blue-600 border-blue-600' 
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {activeTab === 'betting' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 lg:col-span-1">
            <div className="text-center mb-4">
              <h4 className="font-medium text-gray-700">Win/Loss Ratio</h4>
            </div>
            <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="relative h-32 w-32 rounded-full">
                {/* Simulated donut chart */}
                <div className="absolute inset-0 rounded-full border-8 border-blue-500"></div>
                <div className="absolute top-0 right-0 bottom-0 left-[38%] rounded-full border-8 border-gray-300 origin-left"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <div className="text-xl font-bold text-gray-900">68%</div>
                    <div className="text-xs text-gray-500">Win Rate</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-around mt-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">32</div>
                <div className="text-xs text-gray-600">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-600">15</div>
                <div className="text-xs text-gray-600">Losses</div>
              </div>
            </div>
          </div>
          
          <div className="col-span-2 lg:col-span-1">
            <div className="text-center mb-4">
              <h4 className="font-medium text-gray-700">Monthly Performance</h4>
            </div>
            <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="h-32 flex items-end space-x-3 mb-4">
                  <div className="w-10 bg-blue-200 rounded-t-md h-1/3"></div>
                  <div className="w-10 bg-blue-300 rounded-t-md h-1/2"></div>
                  <div className="w-10 bg-blue-400 rounded-t-md h-2/3"></div>
                  <div className="w-10 bg-blue-500 rounded-t-md h-full"></div>
                  <div className="w-10 bg-blue-600 rounded-t-md h-3/4"></div>
                  <div className="w-10 bg-blue-700 rounded-t-md h-5/6"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-around mt-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">18</div>
                <div className="text-xs text-gray-600">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-600">47</div>
                <div className="text-xs text-gray-600">Total Bets</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'friends' && (
        <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Friend activity stats will appear here</p>
        </div>
      )}
      
      {activeTab === 'categories' && (
        <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Category breakdown will appear here</p>
        </div>
      )}
    </div>
  );
};

// Enhanced App Dashboard component
const AppDashboard = () => {
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Ava!</h1>
          <p className="text-gray-600">You have 3 active bets and 2 pending invitations.</p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow flex items-center"
          onClick={() => setIsBetModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          New Bet
        </button>
      </div>
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Win Rate</p>
            <p className="text-2xl font-bold text-gray-900">68.4%</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Bets</p>
            <p className="text-2xl font-bold text-gray-900">3</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Friends</p>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Achievements</p>
            <p className="text-2xl font-bold text-gray-900">7/15</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <LiveBetDisplay />
          <StatisticsOverview />
          <FriendActivityFeed />
        </div>
        <div className="space-y-8">
          <QuickBetForm />
          <Leaderboard />
          <Achievements />
        </div>
      </div>
      {/* New Bet Modal (simplified) */}
      {isBetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Create New Bet</h3>
              <button onClick={() => setIsBetModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-500 mb-4">Use the quick form to the right to create a simple bet, or use this modal for more advanced options.</p>
            <button
              onClick={() => setIsBetModalOpen(false)}
              className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Home component that ties everything together
export default function Home() {
  // State to toggle between pages
  const [showDashboard, setShowDashboard] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'myBets', etc.
  const [showMoneyBets, setShowMoneyBets] = useState(false); // Toggle between regular and money bets

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 relative">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        showMoneyBets={showMoneyBets}
        setShowMoneyBets={setShowMoneyBets}
      />
      
      {showDashboard ? (
        showMoneyBets ? (
          <BetPalMonetary />
        ) : currentPage === 'dashboard' ? (
          <AppDashboard />
        ) : currentPage === 'myBets' ? (
          <EnhancedMyBetsPage /> // Use the enhanced version instead of MyBetsPage
        ) : currentPage === 'friends' ? (
          <FriendsPage />
        ) : (
          <AppDashboard />
        )
      ) : (
        <>
          {/* Demo toggle button */}
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <div className="flex gap-2">
              <button
                onClick={() => setShowDashboard(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                Demo the Dashboard
              </button>
              <button
                onClick={() => {
                  setShowDashboard(true);
                  setShowMoneyBets(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Try Money Bets
              </button>
            </div>
          </div>
          
          {/* Hero Section */}
          <section className="relative px-4 py-24 md:py-32 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
              <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute top-20 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
            <div className="max-w-6xl mx-auto text-center relative z-10">
              <div className="animate-fade-in space-y-8">
                <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-4">
                  Welcome to the future of social betting
                </div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-transparent bg-clip-text mb-8">
                  Bet Together, Win Together!
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Create, track, and enjoy friendly wagers with your social circle —
                  all the excitement without financial risk.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                  <button className="px-10 py-5 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl">
                    Get Started Free
                  </button>
                  <button className="px-10 py-5 text-lg font-semibold text-blue-700 bg-white border-2 border-blue-200 rounded-full hover:bg-blue-50 transform hover:scale-105 transition-all shadow-md hover:shadow-lg">
                    Watch Demo
                  </button>
                </div>
              </div>
            </div>
          </section>        

          {/* Stats Section */}
          <section className="px-4 py-12 mb-12">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Stat
                  value="10,000+"
                  label="Active Users"
                  icon={<Users className="w-8 h-8" />}
                />
                <Stat
                  value="250,000+"
                  label="Bets Created"
                  icon={<Award className="w-8 h-8" />}
                />
                <Stat
                  value="99%"
                  label="Satisfaction Rate"
                  icon={<Zap className="w-8 h-8" />}
                />
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="px-4 py-20 bg-gradient-to-b from-white to-blue-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose BetPal?</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Our platform makes friendly betting fun, social, and completely risk-free.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <FeatureCard
                  icon={<Handshake className="w-12 h-12 text-blue-600" />}
                  title="Social Betting"
                  description="Create fun challenges with friends and track your bets in one convenient dashboard"
                />
                <FeatureCard
                  icon={<Trophy className="w-12 h-12 text-blue-600" />}
                  title="Challenge Friends"
                  description="Compete in friendly wagers and build your reputation with our leaderboard system"
                />
                <FeatureCard
                  icon={<Shield className="w-12 h-12 text-blue-600" />}
                  title="Safe & Fun"
                  description="Enjoy the thrill of betting without any financial risks or gambling concerns"
                />
              </div>
            </div>
          </section>
          
          {/* How It Works Section */}
          <section className="px-4 py-20 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Getting started with BetPal is easy. Follow these simple steps.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Sign Up</h3>
                  <p className="text-gray-600">Create your free account in seconds. No credit card required.</p>
                </div>
                <div className="text-center relative">
                  <div className="hidden md:block absolute left-0 top-8 w-full h-0.5 bg-blue-100 -z-10"></div>
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Invite Friends</h3>
                  <p className="text-gray-600">Connect with friends or make new ones on the platform.</p>
                </div>
                <div className="text-center relative">
                  <div className="hidden md:block absolute left-0 top-8 w-full h-0.5 bg-blue-100 -z-10"></div>
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Handshake className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Create Bets</h3>
                  <p className="text-gray-600">Set up friendly wagers on anything with non-monetary stakes.</p>
                </div>
                <div className="text-center relative">
                  <div className="hidden md:block absolute left-0 top-8 w-full h-0.5 bg-blue-100 -z-10"></div>
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Track & Win</h3>
                  <p className="text-gray-600">Follow your bets, celebrate victories, and climb the leaderboard.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Testimonials */}
          <section className="px-4 py-20 bg-blue-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Join thousands of satisfied users who love the BetPal experience.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Testimonial
                  quote="BetPal transformed how my friends and I enjoy sports. Now we have friendly competitions without the financial stress."
                  name="Alex Johnson"
                  title="Sports Enthusiast"
                />
                <Testimonial
                  quote="I love the clean interface and how easy it is to set up new bets. The leaderboard feature keeps everyone engaged!"
                  name="Sarah Williams"
                  title="Social Group Organizer"
                />
                <Testimonial
                  quote="Perfect for our office pools and friendly wagers. Everyone stays accountable without any money changing hands."
                  name="Michael Chen"
                  title="Team Lead"
                />
              </div>
            </div>
          </section>

          {/* App Preview Section */}
          <section className="px-4 py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">See BetPal in Action</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Our intuitive interface makes creating and tracking bets a breeze.</p>
              </div>
              <div className="relative">
                <div className="absolute -inset-10 bg-blue-100/30 rounded-[100px] rotate-3 transform"></div>
                <div className="relative bg-white rounded-xl shadow-2xl border border-gray-100 p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                          <User className="w-5 h-5 mr-2 text-blue-600" /> My Active Bets
                        </h3>
                        <div className="mt-3 space-y-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="p-3 bg-white rounded-md shadow-sm border border-gray-100">
                              <div className="text-sm font-medium">NFL Finals Prediction</div>
                              <div className="text-xs text-gray-500">vs. Alex Johnson • Due Mar 15</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                          <Bell className="w-5 h-5 mr-2 text-blue-600" /> Recent Activity
                        </h3>
                        <div className="mt-3 space-y-3">
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 mr-3 flex-shrink-0">
                              <Trophy className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm">You won a bet against Sarah!</div>
                              <div className="text-xs text-gray-500">2 hours ago</div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-3 flex-shrink-0">
                              <Handshake className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm">New bet request from Michael</div>
                              <div className="text-xs text-gray-500">Yesterday</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="font-semibold text-gray-900 mb-4">Track Your Bet Results</h3>
                      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-sm text-gray-600">Your Performance</div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Month</button>
                            <button className="px-3 py-1 text-xs font-medium rounded-full text-gray-600">Year</button>
                            <button className="px-3 py-1 text-xs font-medium rounded-full text-gray-600">All Time</button>
                          </div>
                        </div>
                        <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="h-32 flex items-end space-x-3 mb-4">
                              <div className="w-10 bg-blue-200 rounded-t-md h-1/3"></div>
                              <div className="w-10 bg-blue-300 rounded-t-md h-1/2"></div>
                              <div className="w-10 bg-blue-400 rounded-t-md h-2/3"></div>
                              <div className="w-10 bg-blue-500 rounded-t-md h-full"></div>
                              <div className="w-10 bg-blue-600 rounded-t-md h-3/4"></div>
                              <div className="w-10 bg-blue-700 rounded-t-md h-5/6"></div>
                            </div>
                            <div className="text-sm text-gray-500">Monthly Win/Loss Chart</div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">72%</div>
                            <div className="text-xs text-gray-600">Win Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">18</div>
                            <div className="text-xs text-gray-600">Current Streak</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">142</div>
                            <div className="text-xs text-gray-600">Total Bets</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="px-4 py-20 bg-blue-50">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <p className="text-xl text-gray-600">Everything you need to know about BetPal</p>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Is BetPal completely free?</h3>
                  <p className="text-gray-600">Yes! BetPal is 100% free to use. We don't charge any fees and there are no in-app purchases required to access all features.</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Is real money involved?</h3>
                  <p className="text-gray-600">No. BetPal is designed for friendly, non-monetary wagers only. We encourage creative stakes like buying coffee, doing chores, or other friendly forfeits.</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">How do you settle disputes?</h3>
                  <p className="text-gray-600">BetPal includes tools for submitting evidence and verification. For friendly disputes, users can vote or submit proof to determine the outcome.</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">What can I bet on?</h3>
                  <p className="text-gray-600">Almost anything! Sports events, fitness challenges, gaming competitions, trivia contests, or even friendly debates. If you can track it, you can bet on it.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Mobile App Section */}
          <section className="px-4 py-20 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-4">
                    Available on iOS & Android
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">Take BetPal Everywhere You Go</h2>
                  <p className="text-lg text-gray-600 mb-8">Download our mobile app to create and track bets on the go. Get instant notifications when friends challenge you or when bets are settled.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                      <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.178 12.008c-.012-1.349.457-2.644 1.305-3.655-1.194-1.734-3.278-2.797-5.472-2.797-1.561-.021-3.071.548-4.229 1.59-1.123.986-1.845 2.359-1.845 3.886 0 3.177 2.647 5.748 5.971 5.748.64 0 1.257-.104 1.838-.298.48-.16.948-.341 1.406-.542z" />
                        <path d="M20.3 19.487l-4.937-4.61c-.593.348-1.221.644-1.874.879-.967.346-1.999.526-3.042.526-5.006 0-9.027-3.921-9.027-8.798 0-2.322.935-4.449 2.475-6.051C5.658.055 7.967-.363 10.272.213c3.021.76 5.455 3.053 6.376 5.947 1.204 3.799-.275 7.802-3.152 10.148l4.803 4.48z" />
                      </svg>
                      App Store
                    </button>
                    <button className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                      <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.609 20.708a1.96 1.96 0 001.772 1.14c.74 0 1.462-.335 1.98-.92l5.47-5.593-2.863-1.642-6.36 7.015zm0-17.416l6.36 7.015 2.863-1.642-5.47-5.593a2.89 2.89 0 00-1.98-.92 1.96 1.96 0 00-1.772 1.14zm8.3 8.708L5.32 5.992 12 2.14l6.68 3.852-6.68 3.852zm8.482 8.708L13.73 13l-2.863 1.642 5.47 5.593c.518.586 1.24.92 1.98.92.73 0 1.421-.396 1.773-1.14z" />
                      </svg>
                      Google Play
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-100/50 rounded-3xl rotate-3 transform"></div>
                  <div className="relative flex justify-center">
                    <div className="w-64 h-96 bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-800">
                      <div className="h-8 bg-gray-800 flex items-center justify-center">
                        <div className="w-16 h-2 bg-gray-700 rounded-full"></div>
                      </div>
                      <div className="bg-blue-600 h-1/3 flex items-center justify-center">
                        <div className="text-white text-center">
                          <Trophy className="w-12 h-12 mx-auto mb-2" />
                          <p className="font-bold">BetPal Mobile</p>
                        </div>
                      </div>
                      <div className="p-4 bg-white h-2/3">
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <div className="text-xs font-bold">Active Bets (3)</div>
                        </div>
                        <div className="space-y-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="p-2 bg-gray-50 rounded border border-gray-100">
                              <div className="text-xs">Super Bowl Winner</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-4 py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to Start Betting with Friends?</h2>
              <p className="text-xl mb-10 text-blue-100">Join BetPal today and experience the fun of friendly competition without the risk.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <button className="px-10 py-5 text-lg font-semibold text-blue-700 bg-white rounded-full hover:bg-blue-50 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center">
                  Sign Up Now — It's Free! <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowDashboard(true)} 
                  className="px-10 py-5 text-lg font-semibold text-white bg-blue-500/30 backdrop-blur-sm border border-white/20 rounded-full hover:bg-blue-500/50 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center"
                >
                  Try Demo <User className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          </section>
          
          {/* Footer */}
          <footer className="px-4 py-12 bg-gray-900 text-gray-400">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">BetPal</h3>
                <p>Making friendly betting fun since 2024.</p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Features</h4>
                <ul className="space-y-2">
                  <li>Social Betting</li>
                  <li>Leaderboards</li>
                  <li>Challenge Friends</li>
                  <li>Custom Wagers</li>
                  <li>Achievement System</li>
                  <li>Stats Tracking</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>Help Center</li>
                  <li>Blog</li>
                  <li>API</li>
                  <li>Community</li>
                  <li>Mobile Apps</li>
                  <li>Developer Tools</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Press</li>
                  <li>Contact</li>
                  <li>Terms of Service</li>
                  <li>Privacy Policy</li>
                </ul>
              </div>
            </div>
            <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center">
              <p>© 2024 BetPal. All rights reserved.</p>
              <p className="mt-2 text-sm">Not affiliated with any gambling service. For entertainment purposes only.</p>
            </div>
          </footer>
        </>
      )}
    </main>
  );
}