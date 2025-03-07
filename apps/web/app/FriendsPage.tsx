"use client"

import { useState, useEffect } from 'react';
import { 
  User, Users, UserPlus, Search, Filter, Mail, MessageSquare, 
  CheckCircle, XCircle, ChevronDown, Clock, Star, Crown, Trophy, 
  Handshake, Settings, MoreHorizontal, UserX, Loader2, Activity, 
  Bell, Shield, ArrowRight, ArrowLeft, BadgeCheck, Plus, X
} from 'lucide-react';

// Define interfaces
interface FriendUser {
  id: number;
  name: string;
  username: string;
  email: string;
  image: string;
  status: 'online' | 'offline' | 'away';
  lastActive?: string;
  wins: number;
  losses: number;
  activeBets: number;
  winRate: number;
  level: number;
  isFavorite?: boolean;
  mutualFriends?: number;
}

interface FriendRequest {
  id: number;
  user: FriendUser;
  date: string;
  status: 'pending' | 'accepted' | 'declined';
}

// FriendsPage Component
const FriendsPage = () => {
  // States
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMenuOpen, setFilterMenuOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('alphabetical');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<FriendUser[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedFriend, setSelectedFriend] = useState<FriendUser | null>(null);
  const [showFriendProfile, setShowFriendProfile] = useState<boolean>(false);
  
  // Pagination config
  const friendsPerPage = 8;
  
  // Mock friends data
  const [friends, setFriends] = useState<FriendUser[]>([
    { 
      id: 1, 
      name: 'Alex Johnson', 
      username: 'alexj', 
      email: 'alex@example.com', 
      image: '/api/placeholder/72/72', 
      status: 'online', 
      wins: 27,
      losses: 14,
      activeBets: 3,
      winRate: 65.8,
      level: 4,
      isFavorite: true,
      mutualFriends: 8
    },
    { 
      id: 2, 
      name: 'Sarah Williams', 
      username: 'sarahw', 
      email: 'sarah@example.com', 
      image: '/api/placeholder/72/72', 
      status: 'online', 
      lastActive: '10 minutes ago',
      wins: 42,
      losses: 19,
      activeBets: 5,
      winRate: 68.9,
      level: 6,
      mutualFriends: 3
    },
    { 
      id: 3, 
      name: 'Michael Chen', 
      username: 'mikec', 
      email: 'michael@example.com', 
      image: '/api/placeholder/72/72', 
      status: 'offline', 
      lastActive: '3 hours ago',
      wins: 51,
      losses: 20,
      activeBets: 2,
      winRate: 71.8,
      level: 7,
      isFavorite: true,
      mutualFriends: 5
    },
    { 
      id: 4, 
      name: 'Jamie Smith', 
      username: 'jamies', 
      email: 'jamie@example.com', 
      image: '/api/placeholder/72/72', 
      status: 'away', 
      lastActive: '45 minutes ago',
      wins: 16,
      losses: 12,
      activeBets: 4,
      winRate: 57.1,
      level: 3,
      mutualFriends: 2
    },
    { 
      id: 5, 
      name: 'Taylor Reed', 
      username: 'taylorreed', 
      email: 'taylor@example.com', 
      image: '/api/placeholder/72/72', 
      status: 'online', 
      wins: 32,
      losses: 17,
      activeBets: 6,
      winRate: 65.3,
      level: 5,
      mutualFriends: 7
    },
    { 
      id: 6, 
      name: 'Riley Parker', 
      username: 'rileyp', 
      email: 'riley@example.com', 
      image: '/api/placeholder/72/72', 
      status: 'offline', 
      lastActive: '1 day ago',
      wins: 18,
      losses: 16,
      activeBets: 1,
      winRate: 52.9,
      level: 3,
      mutualFriends: 4
    },
    { 
      id: 7, 
      name: 'Casey Morgan', 
      username: 'caseym', 
      email: 'casey@example.com', 
      image: '/api/placeholder/72/72', 
      status: 'online', 
      wins: 22,
      losses: 8,
      activeBets: 3,
      winRate: 73.3,
      level: 4,
      isFavorite: true,
      mutualFriends: 6
    },
    { 
      id: 8, 
      name: 'Jordan Lee', 
      username: 'jordanl', 
      email: 'jordan@example.com', 
      image: '/api/placeholder/72/72', 
      status: 'away', 
      lastActive: '30 minutes ago',
      wins: 36,
      losses: 22,
      activeBets: 2,
      winRate: 62.1,
      level: 5,
      mutualFriends: 3
    },
    { 
      id: 9, 
      name: 'Quinn Taylor', 
      username: 'quinnt', 
      email: 'quinn@example.com', 
      image: '/api/placeholder/72/72', 
      status: 'offline', 
      lastActive: '2 days ago',
      wins: 14,
      losses: 10,
      activeBets: 0,
      winRate: 58.3,
      level: 2,
      mutualFriends: 1
    },
    { 
      id: 10, 
      name: 'Morgan Lewis', 
      username: 'morganl', 
      email: 'morgan@example.com', 
      image: '/api/placeholder/72/72', 
      status: 'online', 
      wins: 29,
      losses: 13,
      activeBets: 4,
      winRate: 69.0,
      level: 4,
      mutualFriends: 5
    }
  ]);

  // Mock friend requests
  const mockFriendRequests: FriendRequest[] = [
    { 
      id: 1, 
      user: {
        id: 101,
        name: 'Emma Davis',
        username: 'emmad',
        email: 'emma@example.com',
        image: '/api/placeholder/72/72',
        status: 'online',
        wins: 17,
        losses: 8,
        activeBets: 2,
        winRate: 68.0,
        level: 3,
        mutualFriends: 4
      },
      date: '2025-02-14T14:30:00',
      status: 'pending'
    },
    { 
      id: 2, 
      user: {
        id: 102,
        name: 'Noah Wilson',
        username: 'noahw',
        email: 'noah@example.com',
        image: '/api/placeholder/72/72',
        status: 'offline',
        lastActive: '5 hours ago',
        wins: 24,
        losses: 11,
        activeBets: 1,
        winRate: 68.6,
        level: 4,
        mutualFriends: 2
      },
      date: '2025-02-13T09:15:00',
      status: 'pending'
    },
  ];

  // Mock suggested friends
  const mockSuggestedFriends: FriendUser[] = [
    { 
      id: 201, 
      name: 'Sophia Martinez', 
      username: 'sophiam', 
      email: 'sophia@example.com', 
      image: '/api/placeholder/72/72', 
      status: 'online', 
      wins: 31,
      losses: 14,
      activeBets: 3,
      winRate: 68.9,
      level: 5,
      mutualFriends: 7
    },
    { 
      id: 202, 
      name: 'Liam Brown', 
      username: 'liamb', 
      email: 'liam@example.com', 
      image: '/api/placeholder/72/72', 
      status: 'away', 
      lastActive: '20 minutes ago',
      wins: 28,
      losses: 15,
      activeBets: 4,
      winRate: 65.1,
      level: 4,
      mutualFriends: 5
    },
    { 
      id: 203, 
      name: 'Olivia Jones', 
      username: 'oliviaj', 
      email: 'olivia@example.com', 
      image: '/api/placeholder/72/72', 
      status: 'offline', 
      lastActive: '1 day ago',
      wins: 36,
      losses: 19,
      activeBets: 2,
      winRate: 65.5,
      level: 5,
      mutualFriends: 3
    },
  ];

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setFriendRequests(mockFriendRequests);
      setSuggestedFriends(mockSuggestedFriends);
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter friends based on search, status, tab
  const filteredFriends = friends.filter(friend => {
    // Search filter
    if (searchTerm && !friend.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !friend.username.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && friend.status !== statusFilter) {
      return false;
    }
    
    // Tab filter
    if (activeTab === 'favorites' && !friend.isFavorite) {
      return false;
    }
    
    if (activeTab === 'online' && friend.status !== 'online') {
      return false;
    }
    
    return true;
  });

  // Sort friends
  const sortedFriends = [...filteredFriends].sort((a, b) => {
    switch(sortBy) {
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'recently-active':
        // Online users first, then by lastActive
        if (a.status === 'online' && b.status !== 'online') return -1;
        if (a.status !== 'online' && b.status === 'online') return 1;
        return 0;
      case 'win-rate':
        return b.winRate - a.winRate;
      case 'level':
        return b.level - a.level;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedFriends.length / friendsPerPage);
  const currentFriends = sortedFriends.slice(
    (currentPage - 1) * friendsPerPage,
    currentPage * friendsPerPage
  );

  // Toggle favorite status
  const toggleFavorite = (friendId: number) => {
    setFriends(friends.map(friend => 
      friend.id === friendId 
        ? { ...friend, isFavorite: !friend.isFavorite } 
        : friend
    ));
  };

  // Accept friend request
  const acceptFriendRequest = (requestId: number) => {
    // In a real app, you would make an API call here
    const request = friendRequests.find(req => req.id === requestId);
    if (request) {
      // Add to friends list
      setFriends([...friends, request.user]);
      // Remove from requests
      setFriendRequests(friendRequests.filter(req => req.id !== requestId));
    }
  };

  // Decline friend request
  const declineFriendRequest = (requestId: number) => {
    // In a real app, you would make an API call here
    setFriendRequests(friendRequests.filter(req => req.id !== requestId));
  };

  // Add suggested friend
  const addSuggestedFriend = (friendId: number) => {
    // In a real app, you would make an API call here
    const friend = suggestedFriends.find(f => f.id === friendId);
    if (friend) {
      // Remove from suggestions
      setSuggestedFriends(suggestedFriends.filter(f => f.id !== friendId));
      
      // Create a pending request
      const newRequest: FriendRequest = {
        id: Date.now(), // Just for mock purposes
        user: friend,
        date: new Date().toISOString(),
        status: 'pending'
      };
      
      // Add to sent requests (in a real app)
      // For now, just show a success message
      alert(`Friend request sent to ${friend.name}`);
    }
  };

  // Show friend profile
  const viewFriendProfile = (friend: FriendUser) => {
    setSelectedFriend(friend);
    setShowFriendProfile(true);
  };

  // Format the last active time
  const formatLastActive = (lastActive?: string) => {
    if (!lastActive) return 'Unknown';
    return lastActive;
  };

  // Render status indicator
  const renderStatusIndicator = (status: string) => {
    switch(status) {
      case 'online':
        return <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>;
      case 'away':
        return <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>;
      case 'offline':
        return <span className="w-2.5 h-2.5 bg-gray-400 rounded-full"></span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Friends</h1>
        <p className="text-gray-600">Connect, challenge, and compete with your friends.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-5 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Friends</p>
            <p className="text-2xl font-bold text-gray-900">{friends.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Online Now</p>
            <p className="text-2xl font-bold text-gray-900">{friends.filter(f => f.status === 'online').length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Friend Requests</p>
            <p className="text-2xl font-bold text-gray-900">{friendRequests.length}</p>
          </div>
        </div>
      </div>
      
      {/* Main Content Container */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column - Friends List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search friends..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <button 
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                  >
                    <Filter className="w-4 h-4 mr-2 text-gray-500" />
                    {sortBy === 'alphabetical' ? 'Name' : 
                     sortBy === 'recently-active' ? 'Recently Active' : 
                     sortBy === 'win-rate' ? 'Win Rate' : 'Level'}
                    <ChevronDown className={`ml-2 w-4 h-4 text-gray-500 transition-transform ${filterMenuOpen ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {filterMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'alphabetical' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                        onClick={() => {setSortBy('alphabetical'); setFilterMenuOpen(false);}}
                      >
                        Name
                      </button>
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'recently-active' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                        onClick={() => {setSortBy('recently-active'); setFilterMenuOpen(false);}}
                      >
                        Recently Active
                      </button>
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'win-rate' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                        onClick={() => {setSortBy('win-rate'); setFilterMenuOpen(false);}}
                      >
                        Win Rate
                      </button>
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'level' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                        onClick={() => {setSortBy('level'); setFilterMenuOpen(false);}}
                      >
                        Level
                      </button>
                    </div>
                  )}
                </div>
                
                <button 
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  onClick={() => setShowInviteModal(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </button>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  activeTab === 'all' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Friends
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  activeTab === 'online' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('online')}
              >
                Online
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  activeTab === 'favorites' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('favorites')}
              >
                Favorites
              </button>
            </div>
            
            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusFilter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStatusFilter('all')}
              >
                All Status
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusFilter === 'online' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStatusFilter('online')}
              >
                Online
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusFilter === 'away' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStatusFilter('away')}
              >
                Away
              </button>
              <button
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusFilter === 'offline' 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStatusFilter('offline')}
              >
                Offline
              </button>
            </div>
            
            {/* Friends List */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
            ) : (
              <>
                {currentFriends.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Users className="w-16 h-16 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 font-medium">No friends found</p>
                    <p className="text-gray-500 mt-1">Try adjusting your filters or add new friends</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentFriends.map(friend => (
                      <div 
                        key={friend.id} 
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex justify-between">
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <img 
                                src={friend.image} 
                                alt={friend.name} 
                                className="w-12 h-12 rounded-full"
                                onClick={() => viewFriendProfile(friend)}
                              />
                              <span className="absolute bottom-0 right-0 flex h-3 w-3">
                                {renderStatusIndicator(friend.status)}
                              </span>
                            </div>
                            <div>
                              <h3 
                                className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                                onClick={() => viewFriendProfile(friend)}
                              >
                                {friend.name}
                              </h3>
                              <p className="text-sm text-gray-500">@{friend.username}</p>
                              {friend.status !== 'online' && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Last active: {formatLastActive(friend.lastActive)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <button 
                              className="text-gray-400 hover:text-yellow-500 transition-colors"
                              onClick={() => toggleFavorite(friend.id)}
                              aria-label={friend.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <Star className={`w-5 h-5 ${friend.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                            </button>
                            <div className="flex items-center mt-1">
                              <Trophy className="w-4 h-4 text-blue-600 mr-1" />
                              <span className="text-xs font-medium">{friend.winRate}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between mt-3">
                          <div className="flex space-x-3">
                            <button className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors flex items-center">
                              <Handshake className="w-3 h-3 mr-1" />
                              New Bet
                            </button>
                            <button className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors flex items-center">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Message
                            </button>
                          </div>
                          <div className="text-xs text-gray-500">
                            Level {friend.level}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <nav className="inline-flex rounded-md shadow">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                        onClick={() => setCurrentPage(index + 1)}
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
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
</>
            )}
          </div>
        </div>
        
        {/* Right Column - Friend Requests & Suggestions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Friend Requests Section */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-600" />
              Friend Requests
              {friendRequests.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                  {friendRequests.length}
                </span>
              )}
            </h3>
            
            {friendRequests.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <User className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">No pending friend requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {friendRequests.map(request => (
                  <div key={request.id} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={request.user.image} 
                          alt={request.user.name} 
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{request.user.name}</h4>
                          <p className="text-xs text-gray-500">
                            {request.user.mutualFriends} mutual friends
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(request.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button 
                        className="flex-1 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                        onClick={() => acceptFriendRequest(request.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </button>
                      <button 
                        className="flex-1 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors flex items-center justify-center"
                        onClick={() => declineFriendRequest(request.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* People You May Know */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              People You May Know
            </h3>
            
            {suggestedFriends.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No suggestions available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {suggestedFriends.map(friend => (
                  <div key={friend.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={friend.image} 
                          alt={friend.name} 
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{friend.name}</h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="flex items-center mr-2">
                              <Trophy className="w-3 h-3 mr-1 text-blue-600" />
                              {friend.winRate}% Win Rate
                            </span>
                            <span className="flex items-center">
                              <Users className="w-3 h-3 mr-1 text-purple-600" />
                              {friend.mutualFriends} mutual
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button 
                        className="w-full py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                        onClick={() => addSuggestedFriend(friend.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Add Friend
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
              View More Suggestions
            </button>
          </div>
        </div>
      </div>
      
      {/* Friend Profile Modal */}
      {showFriendProfile && selectedFriend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="relative h-28 bg-gradient-to-r from-blue-500 to-indigo-600">
              <button 
                className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/30 p-1 rounded-full transition-colors"
                onClick={() => setShowFriendProfile(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-6 pb-6">
              <div className="flex items-end -mt-12 mb-4">
                <img 
                  src={selectedFriend.image} 
                  alt={selectedFriend.name} 
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                />
                <div className="ml-4 pt-12">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedFriend.name}</h2>
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm mr-3">@{selectedFriend.username}</span>
                    <div className="flex items-center text-xs">
                      <div className="flex items-center mr-2">
                        {renderStatusIndicator(selectedFriend.status)}
                        <span className="ml-1">
                          {selectedFriend.status.charAt(0).toUpperCase() + selectedFriend.status.slice(1)}
                        </span>
                      </div>
                      {selectedFriend.status !== 'online' && (
                        <span>Last active: {formatLastActive(selectedFriend.lastActive)}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="ml-auto space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Handshake className="w-4 h-4 mr-1" />
                    Create Bet
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </button>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedFriend.wins}</p>
                  <p className="text-xs text-gray-600">Wins</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedFriend.losses}</p>
                  <p className="text-xs text-gray-600">Losses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedFriend.winRate}%</p>
                  <p className="text-xs text-gray-600">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedFriend.level}</p>
                  <p className="text-xs text-gray-600">Level</p>
                </div>
              </div>
              
              {/* Active Bets */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Active Bets
                </h3>
                
                {selectedFriend.activeBets === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No active bets</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[...Array(selectedFriend.activeBets)].map((_, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">
                              {['Super Bowl Winner', 'NBA Finals', 'March Madness Bracket', 'Fantasy Football League'][i % 4]}
                            </p>
                            <p className="text-xs text-gray-500">
                              Stake: {['Lunch at winner\'s choice', 'Coffee for a week', 'Movie night', 'Bragging rights'][i % 4]}
                            </p>
                          </div>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Due {['Feb 11', 'Jun 15', 'Apr 3', 'Dec 20'][i % 4]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button 
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
                  onClick={() => toggleFavorite(selectedFriend.id)}
                >
                  <Star className={`w-4 h-4 mr-1.5 ${selectedFriend.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  {selectedFriend.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Friend Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Add a Friend</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowInviteModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Username or Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by username or email address"
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Suggestions in modal */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Suggestions</h4>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {suggestedFriends.map(friend => (
                    <div key={friend.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={friend.image} 
                          alt={friend.name} 
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{friend.name}</h4>
                          <p className="text-xs text-gray-500">@{friend.username}</p>
                        </div>
                      </div>
                      <button 
                        className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        onClick={() => {
                          addSuggestedFriend(friend.id);
                          setShowInviteModal(false);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex space-x-3">
                <button 
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  onClick={() => setShowInviteModal(false)}
                >
                  Send Friend Request
                </button>
                <button 
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsPage;                