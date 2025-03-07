"use client"

import BetTypeToggle from './BetTypeToggle';


import { useState, useEffect } from 'react';
import { 
    TrendingUp, DollarSign, Calendar, Bookmark, Filter, Search, 
    ChevronDown, Check, X, Trophy, MessageSquare, Loader2, 
    ArrowRight, ArrowLeft, Clock, AlertCircle, Trash2, Camera, Gift,
    ThumbsUp, Upload, ExternalLink, MoreHorizontal, Award, Share2, Plus
} from 'lucide-react';

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
  evidence?: string[];
  terms?: string;
}

// Define interface for Comment
interface Comment {
  id: number;
  betId: number;
  userId: number;
  userName: string;
  userImage: string;
  text: string;
  createdAt: string;
}

// MyBets Component
const MyBetsPage = () => {
  // State for filters and sorting
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [betsPerPage] = useState<number>(5);
  
  // State for bet details modal
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [isBetDetailsOpen, setIsBetDetailsOpen] = useState<boolean>(false);
  
  // State for loading
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // State for comments in the selected bet
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  
  // State for evidence upload
  const [isUploadingEvidence, setIsUploadingEvidence] = useState<boolean>(false);
  
  // Dummy user data
  const currentUser = {
    id: 1,
    name: "Ava Cook",
    image: "/api/placeholder/40/40"
  };
  
  // Sample bet data
  const [bets, setBets] = useState<Bet[]>([
    { 
      id: 1, 
      user1: "Ava Cook", 
      user2: "Alex Johnson", 
      bet: "Super Bowl Winner", 
      stake: "Dinner at winner's restaurant choice", 
      dueDate: "2025-02-11",
      status: 'active', 
      category: 'sports', 
      createdAt: '2025-01-15',
      terms: "Bet is on which team will win the Super Bowl. The loser buys dinner at any restaurant of the winner's choice with a $100 limit.",
      evidence: ["/api/placeholder/300/200"]
    },
    { 
      id: 2, 
      user1: "Ava Cook", 
      user2: "Morgan Lewis", 
      bet: "Marathon Time", 
      stake: "Coffee for a month", 
      dueDate: "2025-04-15", 
      status: 'active', 
      category: 'fitness', 
      createdAt: '2025-02-01',
      terms: "Morgan bets she can finish the marathon in under 4 hours. Ava bets Morgan won't make that time. Winner gets free coffee every morning for a month."
    },
    { 
      id: 3, 
      user1: "Ava Cook", 
      user2: "Riley Parker", 
      bet: "Election Outcome", 
      stake: "Car wash and detail", 
      dueDate: "2025-11-05", 
      status: 'active', 
      category: 'politics', 
      createdAt: '2025-01-23',
      terms: "Bet on which party will win the Senate majority. Loser has to wash and detail the winner's car."
    },
    { 
      id: 4, 
      user1: "Ava Cook", 
      user2: "Jamie Smith", 
      bet: "Oscar Best Picture", 
      stake: "Movie tickets and dinner", 
      dueDate: "2025-03-10",
      status: 'completed', 
      category: 'entertainment', 
      createdAt: '2025-01-30',
      winner: "Ava Cook",
      terms: "Bet on which nominated film will win Best Picture at the Academy Awards. Loser buys movie tickets and dinner for the winner.",
      evidence: ["/api/placeholder/300/200", "/api/placeholder/300/200"]
    },
    { 
      id: 5, 
      user1: "Taylor Reed", 
      user2: "Ava Cook", 
      bet: "First to Complete Coding Project", 
      stake: "Tech gadget under $50", 
      dueDate: "2025-03-25", 
      status: 'active', 
      category: 'personal', 
      createdAt: '2025-02-15',
      terms: "First person to complete their coding side project wins. The loser buys the winner a tech gadget of their choice under $50."
    },
    { 
      id: 6, 
      user1: "Ava Cook", 
      user2: "Jordan Lee", 
      bet: "Weight Loss Challenge", 
      stake: "New workout outfit", 
      dueDate: "2025-05-01", 
      status: 'active', 
      category: 'fitness', 
      createdAt: '2025-02-10',
      terms: "Who can lose a higher percentage of body weight in 3 months. The loser buys the winner a new workout outfit."
    },
    { 
      id: 7, 
      user1: "Casey Morgan", 
      user2: "Ava Cook", 
      bet: "March Madness Bracket", 
      stake: "Lunch for a week", 
      dueDate: "2025-04-08", 
      status: 'pending', 
      category: 'sports', 
      createdAt: '2025-02-20',
      terms: "Who has a more accurate March Madness bracket. Loser buys lunch for the winner for a week."
    },
    { 
      id: 8, 
      user1: "Ava Cook", 
      user2: "Quinn Taylor", 
      bet: "Fantasy Football Season", 
      stake: "Custom trophy and bragging rights", 
      dueDate: "2025-01-05", 
      status: 'completed', 
      category: 'sports', 
      createdAt: '2024-09-01',
      winner: "Quinn Taylor",
      terms: "Winner of our fantasy football league gets a custom trophy paid for by the loser, plus eternal bragging rights.",
      evidence: ["/api/placeholder/300/200"]
    },
    { 
      id: 9, 
      user1: "Ava Cook", 
      user2: "Sarah Williams", 
      bet: "Who Gets Promoted First", 
      stake: "Fancy dinner", 
      dueDate: "2025-06-30", 
      status: 'active', 
      category: 'personal', 
      createdAt: '2025-01-10',
      terms: "Bet on who gets promoted first at their respective jobs. Loser treats the winner to a fancy dinner celebration."
    },
    { 
      id: 10, 
      user1: "Michael Chen", 
      user2: "Ava Cook", 
      bet: "Music Festival Attendance", 
      stake: "Concert tickets to next event", 
      dueDate: "2025-07-15", 
      status: 'canceled', 
      category: 'entertainment', 
      createdAt: '2025-02-05',
      terms: "Bet on who can attend more performances at the summer music festival. Winner gets tickets to the next major concert, paid by the loser."
    }
  ]);
  
  // Sample comments
  const sampleComments: Comment[] = [
    {
      id: 1,
      betId: 1,
      userId: 2,
      userName: "Alex Johnson",
      userImage: "/api/placeholder/40/40",
      text: "I'm feeling confident about my team! The defense is looking strong this season.",
      createdAt: "2025-01-18T14:22:00"
    },
    {
      id: 2,
      betId: 1,
      userId: 1,
      userName: "Ava Cook",
      userImage: "/api/placeholder/40/40",
      text: "We'll see! My quarterback is having an amazing season so far.",
      createdAt: "2025-01-18T15:45:00"
    },
    {
      id: 3,
      betId: 1,
      userId: 2,
      userName: "Alex Johnson",
      userImage: "/api/placeholder/40/40",
      text: "I've already picked out the restaurant where you'll be buying me dinner! 😁",
      createdAt: "2025-01-25T09:12:00"
    },
    {
      id: 4,
      betId: 4,
      userId: 1,
      userName: "Ava Cook",
      userImage: "/api/placeholder/40/40",
      text: "I told you that film was going to win! Can't wait for our movie night.",
      createdAt: "2025-03-11T10:30:00"
    },
    {
      id: 5,
      betId: 4,
      userId: 3,
      userName: "Jamie Smith",
      userImage: "/api/placeholder/40/40",
      text: "Fair win. I've got to admit, it was a masterpiece. Let me know when you want to collect your prize!",
      createdAt: "2025-03-11T11:15:00"
    }
  ];
  
  // Status options for filter
  const statusOptions = [
    {value: 'all', label: 'All Status'},
    {value: 'active', label: 'Active'},
    {value: 'pending', label: 'Pending'},
    {value: 'completed', label: 'Completed'},
    {value: 'canceled', label: 'Canceled'}
  ];
  
  // Category options for filter
  const categoryOptions = [
    {value: 'all', label: 'All Categories'},
    {value: 'sports', label: 'Sports'},
    {value: 'fitness', label: 'Fitness'},
    {value: 'politics', label: 'Politics'},
    {value: 'entertainment', label: 'Entertainment'},
    {value: 'personal', label: 'Personal'}
  ];
  
  // Sort options
  const sortOptions = [
    {value: 'newest', label: 'Newest First'},
    {value: 'oldest', label: 'Oldest First'},
    {value: 'dueDate', label: 'Due Date'},
    {value: 'alphabetical', label: 'Alphabetical'}
  ];
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter bets based on selected filters
  const filteredBets = bets.filter(bet => {
    // Filter by status
    if (selectedStatus !== 'all' && bet.status !== selectedStatus) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && bet.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !bet.bet.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !bet.user1.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !bet.user2.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort filtered bets
  const sortedBets = [...filteredBets].sort((a, b) => {
    switch(sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'alphabetical':
        return a.bet.localeCompare(b.bet);
      default:
        return 0;
    }
  });
  
  // Pagination logic
  const indexOfLastBet = currentPage * betsPerPage;
  const indexOfFirstBet = indexOfLastBet - betsPerPage;
  const currentBets = sortedBets.slice(indexOfFirstBet, indexOfLastBet);
  const totalPages = Math.ceil(sortedBets.length / betsPerPage);
  
  // Change page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  // Open bet details
  const openBetDetails = (bet: Bet) => {
    setSelectedBet(bet);
    // Get comments for this bet
    const betComments = sampleComments.filter(comment => comment.betId === bet.id);
    setComments(betComments);
    setIsBetDetailsOpen(true);
  };
  
  // Close bet details
  const closeBetDetails = () => {
    setIsBetDetailsOpen(false);
    setSelectedBet(null);
    setNewComment('');
  };
  
  // Add a new comment
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedBet) return;
    
    const newCommentObj: Comment = {
      id: Math.max(...comments.map(c => c.id), 0) + 1,
      betId: selectedBet.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userImage: currentUser.image,
      text: newComment,
      createdAt: new Date().toISOString()
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };
  
  // Handle bet response (accept or decline)
  const handleBetResponse = (accept: boolean) => {
    if (!selectedBet) return;
    
    setBets(bets.map(bet => {
      if (bet.id === selectedBet.id) {
        return {
          ...bet,
          status: accept ? 'active' : 'canceled'
        };
      }
      return bet;
    }));
    
    setSelectedBet(prev => prev ? {
      ...prev,
      status: accept ? 'active' : 'canceled'
    } : null);
  };
  
  // Handle marking a bet as completed
  const handleMarkComplete = (winner: string) => {
    if (!selectedBet) return;
    
    setBets(bets.map(bet => {
      if (bet.id === selectedBet.id) {
        return {
          ...bet,
          status: 'completed',
          winner: winner
        };
      }
      return bet;
    }));
    
    setSelectedBet(prev => prev ? {
      ...prev,
      status: 'completed',
      winner: winner
    } : null);
  };
  
  // Upload evidence (simulated)
  const handleEvidenceUpload = () => {
    if (!selectedBet) return;
    
    setIsUploadingEvidence(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newEvidence = ["/api/placeholder/300/200"];
      
      setBets(bets.map(bet => {
        if (bet.id === selectedBet.id) {
          return {
            ...bet,
            evidence: bet.evidence ? [...bet.evidence, ...newEvidence] : newEvidence
          };
        }
        return bet;
      }));
      
      setSelectedBet(prev => prev ? {
        ...prev,
        evidence: prev.evidence ? [...prev.evidence, ...newEvidence] : newEvidence
      } : null);
      
      setIsUploadingEvidence(false);
    }, 1500);
  };
  
  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-700',
          icon: <TrendingUp className="w-4 h-4 mr-1" />
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-700',
          icon: <Clock className="w-4 h-4 mr-1" />
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-700',
          icon: <Check className="w-4 h-4 mr-1" />
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

  // Add this function near your other utility functions
  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return diffDays > 0 && diffDays <= 7;
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for comments
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Get opponent name (the other person in the bet)
  const getOpponent = (bet: Bet) => {
    return bet.user1 === currentUser.name ? bet.user2 : bet.user1;
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bets</h1>
          <p className="text-gray-600">Track, manage, and review all your friendly wagers in one place.</p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow flex items-center"
          onClick={() => alert("New bet creation coming soon!")}
        >
          <Plus className="w-5 h-5 mr-2" />
          New Bet
        </button>
      </div>
      
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Bets</p>
            <p className="text-2xl font-bold text-gray-900">{bets.filter(b => b.status === 'active').length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{bets.filter(b => b.status === 'pending').length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Wins</p>
            <p className="text-2xl font-bold text-gray-900">{bets.filter(b => b.status === 'completed' && b.winner === currentUser.name).length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Losses</p>
            <p className="text-2xl font-bold text-gray-900">{bets.filter(b => b.status === 'completed' && b.winner !== currentUser.name).length}</p>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-auto md:flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bets, friends..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <button 
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              >
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                Filters
                <ChevronDown className={`ml-2 w-4 h-4 text-gray-500 transition-transform ${isFilterMenuOpen ? 'transform rotate-180' : ''}`} />
              </button>
              
              {isFilterMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categoryOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <button 
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 flex items-center"
              onClick={() => alert("Calendar view coming soon!")}
            >
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              Calendar View
            </button>
          </div>
        </div>
        
        {/* Filter pills/tags for quick filtering */}
        <div className="flex flex-wrap gap-2 mt-4">
          {statusOptions.map(option => (
            option.value !== 'all' && (
              <button
                key={option.value}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedStatus === option.value 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedStatus(option.value)}
              >
                {option.label}
              </button>
            )
          ))}
        </div>
      </div>
      {/* Bets List */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {filteredBets.length === 0 ? 'No bets found' : `Showing ${(currentPage - 1) * betsPerPage + 1} - ${Math.min(currentPage * betsPerPage, filteredBets.length)} of ${filteredBets.length} bets`}
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            {currentBets.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="mb-4 text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-600 font-medium">No bets found with the current filters</p>
                <p className="text-gray-500 mt-1">Try adjusting your filters or creating a new bet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {currentBets.map(bet => (
                  <div 
                    key={bet.id} 
                    className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer relative"
                    onClick={() => openBetDetails(bet)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${getStatusInfo(bet.status).color} mr-2`}>
                            {getStatusInfo(bet.status).icon}
                            {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                          </span>
                          {bet.category && (
                            <span className="inline-flex items-center text-xs bg-indigo-100 px-2 py-1 rounded-full text-indigo-700">
                              <Bookmark className="w-3 h-3 mr-1" />
                              {bet.category.charAt(0).toUpperCase() + bet.category.slice(1)}
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-lg text-gray-900 mb-1">{bet.bet}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          With <span className="font-medium text-gray-800">{getOpponent(bet)}</span>
                        </p>
                      </div>
                      
                      {bet.status === 'completed' && bet.winner && (
                        <div className="flex flex-col items-end">
                          <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                            bet.winner === currentUser.name ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
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
                      
                      {isDueSoon(bet.dueDate) && (
                        <div className="absolute top-3 right-3 animate-pulse">
                          <span className="inline-flex items-center text-xs bg-orange-100 px-2 py-1 rounded-full text-orange-700">
                            <Clock className="w-3 h-3 mr-1" />
                            Due Soon
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center text-xs bg-green-100 px-2 py-1 rounded text-green-700">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Stake: {bet.stake}
                        </span>
                        <span className="inline-flex items-center text-xs bg-blue-100 px-2 py-1 rounded text-blue-700">
                          <Calendar className="w-3 h-3 mr-1" />
                          Due: {formatDate(bet.dueDate)}
                        </span>
                        {bet.evidence && bet.evidence.length > 0 && (
                          <span className="inline-flex items-center text-xs bg-purple-100 px-2 py-1 rounded text-purple-700">
                            <Camera className="w-3 h-3 mr-1" />
                            {bet.evidence.length} Evidence
                          </span>
                        )}
                        {comments.filter(c => c.betId === bet.id).length > 0 && (
                          <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {comments.filter(c => c.betId === bet.id).length} Comments
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Would share bet: ${bet.bet}`);
                          }}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        {bet.status === 'active' && (
                          <button 
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              openBetDetails(bet);
                            }}
                          >
                            View Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-l-md border border-gray-300 ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 border-t border-b border-gray-300 ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-r-md border border-gray-300 ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        )}
      </div>
      
      {/* Bet Details Modal */}
      {isBetDetailsOpen && selectedBet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${getStatusInfo(selectedBet.status).color} mr-2`}>
                      {getStatusInfo(selectedBet.status).icon}
                      {selectedBet.status.charAt(0).toUpperCase() + selectedBet.status.slice(1)}
                    </span>
                    {selectedBet.category && (
                      <span className="inline-flex items-center text-xs bg-indigo-100 px-2 py-1 rounded-full text-indigo-700">
                        <Bookmark className="w-3 h-3 mr-1" />
                        {selectedBet.category.charAt(0).toUpperCase() + selectedBet.category.slice(1)}
                      </span>
                    )}
                    {selectedBet.status === 'completed' && selectedBet.winner && (
                      <span className={`ml-2 inline-flex items-center text-xs px-2 py-1 rounded-full ${
                        selectedBet.winner === currentUser.name ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {selectedBet.winner === currentUser.name ? (
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
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedBet.bet}</h2>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={closeBetDetails}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="overflow-y-auto p-6 max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2 space-y-6">
                  {/* Bet Terms */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Bet Terms</h3>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-700">{selectedBet.terms || "No detailed terms specified for this bet."}</p>
                    </div>
                  </div>
                  
                  {/* Evidence Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Evidence</h3>
                    {selectedBet.evidence && selectedBet.evidence.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {selectedBet.evidence.map((evidence, index) => (
                          <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
                            <img 
                              src={evidence} 
                              alt={`Evidence ${index + 1}`} 
                              className="w-full h-40 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <Camera className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-600">No evidence uploaded yet</p>
                      </div>
                    )}
                    
                    {/* Upload Evidence Button */}
                    {selectedBet.status !== 'canceled' && (
                      <button 
                        className="mt-4 flex items-center justify-center w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                        onClick={handleEvidenceUpload}
                        disabled={isUploadingEvidence}
                      >
                        {isUploadingEvidence ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Evidence
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Bet Details */}
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">Bet Details</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Participants</p>
                        <p className="font-medium">{selectedBet.user1} vs {selectedBet.user2}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Stake</p>
                        <p className="font-medium">{selectedBet.stake}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="font-medium">{formatDate(selectedBet.dueDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="font-medium">{formatDate(selectedBet.createdAt)}</p>
                      </div>
                      {selectedBet.winner && (
                        <div>
                          <p className="text-sm text-gray-500">Winner</p>
                          <p className={`font-medium ${selectedBet.winner === currentUser.name ? 'text-green-600' : 'text-gray-900'}`}>
                            {selectedBet.winner}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Section */}
                  {selectedBet.status === 'pending' && selectedBet.user2 === currentUser.name && (
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900">Respond to Bet</h3>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-4">
                          {selectedBet.user1} has invited you to this bet. Do you accept?
                        </p>
                        <div className="flex space-x-3">
                          <button 
                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            onClick={() => handleBetResponse(true)}
                          >
                            <Check className="w-4 h-4 inline mr-1" /> Accept
                          </button>
                          <button 
                            className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            onClick={() => handleBetResponse(false)}
                          >
                            <X className="w-4 h-4 inline mr-1" /> Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Mark Complete Section */}
                  {selectedBet.status === 'active' && (
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900">Mark as Complete</h3>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-4">
                          Who won this bet? The other participant will need to confirm.
                        </p>
                        <div className="flex space-x-3">
                          <button 
                            className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                            onClick={() => handleMarkComplete(currentUser.name)}
                          >
                            <Trophy className="w-4 h-4 inline mr-1" /> I Won
                          </button>
                          <button 
                            className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            onClick={() => handleMarkComplete(getOpponent(selectedBet))}
                          >
                            <Award className="w-4 h-4 inline mr-1" /> They Won
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Share Button */}
                  <button 
                    className="w-full py-2 flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                    onClick={() => alert("Bet sharing feature coming soon!")}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Bet
                  </button>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Comments</h3>
                
                <div className="space-y-4 mb-6">
                  {comments.length > 0 ? (
                    comments.map(comment => (
                      <div key={comment.id} className="flex space-x-3">
                        <img 
                          src={comment.userImage} 
                          alt={comment.userName} 
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-gray-900">{comment.userName}</p>
                            <p className="text-gray-700">{comment.text}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{formatTime(comment.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-600">No comments yet</p>
                      <p className="text-gray-500 text-sm mt-1">Be the first to comment on this bet</p>
                    </div>
                  )}
                </div>
                
                {/* Add Comment Form */}
                <div className="flex space-x-3">
                  <img 
                    src={currentUser.image} 
                    alt={currentUser.name} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBetsPage;