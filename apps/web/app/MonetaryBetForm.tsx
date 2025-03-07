"use client"

import { useState } from 'react';
import { 
  DollarSign, Calendar, User, Check, X, Loader2, 
  CreditCard, Shield, AlertCircle, HelpCircle, ChevronDown
} from 'lucide-react';

// Form field interface
interface FormField {
  value: string;
  error: string;
}

// Interface for payment method
interface PaymentMethod {
  id: string;
  name: string;
  lastFour: string;
  expiryDate: string;
  type: 'visa' | 'mastercard' | 'amex' | 'other';
}

// Interface for friend/opponent
interface Friend {
  id: number;
  name: string;
  image?: string;
}

// Props interface
interface MonetaryBetFormProps {
  onSubmit: (betData: any) => void;
  onCancel: () => void;
}

const MonetaryBetForm = ({ onSubmit, onCancel }: MonetaryBetFormProps) => {
  // Form state management
  const [description, setDescription] = useState<FormField>({ value: '', error: '' });
  const [amount, setAmount] = useState<FormField>({ value: '', error: '' });
  const [dueDate, setDueDate] = useState<FormField>({ value: '', error: '' });
  const [opponent, setOpponent] = useState<FormField>({ value: '', error: '' });
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showFriendDropdown, setShowFriendDropdown] = useState<boolean>(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  
  // Sample data for demo
  const paymentMethods: PaymentMethod[] = [
    { id: 'pm_1', name: 'Visa', lastFour: '4242', expiryDate: '04/26', type: 'visa' },
    { id: 'pm_2', name: 'Mastercard', lastFour: '8888', expiryDate: '09/25', type: 'mastercard' },
  ];
  
  const friends: Friend[] = [
    { id: 1, name: 'Alex Johnson', image: '/api/placeholder/40/40' },
    { id: 2, name: 'Morgan Lewis', image: '/api/placeholder/40/40' },
    { id: 3, name: 'Jamie Smith', image: '/api/placeholder/40/40' },
    { id: 4, name: 'Riley Parker', image: '/api/placeholder/40/40' },
    { id: 5, name: 'Sarah Williams', image: '/api/placeholder/40/40' },
  ];
  
  // Validate form before submission
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate description
    if (!description.value.trim()) {
      setDescription({ ...description, error: 'Please enter a bet description' });
      isValid = false;
    }
    
    // Validate amount
    if (!amount.value.trim()) {
      setAmount({ ...amount, error: 'Please enter an amount' });
      isValid = false;
    } else if (isNaN(parseFloat(amount.value)) || parseFloat(amount.value) <= 0) {
      setAmount({ ...amount, error: 'Please enter a valid amount' });
      isValid = false;
    }
    
    // Validate due date
    if (!dueDate.value) {
      setDueDate({ ...dueDate, error: 'Please select a due date' });
      isValid = false;
    } else {
      const selectedDate = new Date(dueDate.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setDueDate({ ...dueDate, error: 'Due date cannot be in the past' });
        isValid = false;
      }
    }
    
    // Validate opponent
    if (!opponent.value.trim()) {
      setOpponent({ ...opponent, error: 'Please select a friend' });
      isValid = false;
    }
    
    // Validate payment method
    if (!selectedPaymentMethod) {
      isValid = false;
      // No specific field to show this error, could add a general error state
      alert('Please select a payment method');
    }
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const betData = {
        description: description.value,
        amount: parseFloat(amount.value),
        dueDate: dueDate.value,
        opponent: opponent.value,
        paymentMethod: selectedPaymentMethod,
      };
      
      onSubmit(betData);
      setIsSubmitting(false);
    }, 1000);
  };
  
  // Select a friend from dropdown
  const selectFriend = (friend: Friend) => {
    setOpponent({ value: friend.name, error: '' });
    setShowFriendDropdown(false);
  };
  
  // Select a payment method from dropdown
  const selectPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setShowPaymentDropdown(false);
  };
  
  // Handle amount input with validation for currency format
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and one decimal point
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmount({ value, error: '' });
    }
  };
  
  // Get payment method icon based on type
  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return (
          <div className="w-8 h-5 bg-blue-900 rounded flex items-center justify-center text-white text-xs font-semibold">
            VISA
          </div>
        );
      case 'mastercard':
        return (
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full opacity-80"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full -ml-2 opacity-80"></div>
          </div>
        );
      case 'amex':
        return (
          <div className="w-8 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-semibold">
            AMEX
          </div>
        );
      default:
        return <CreditCard className="w-5 h-5 text-gray-400" />;
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <DollarSign className="w-6 h-6 text-green-600 mr-2" />
          Create Money Bet
        </h2>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={onCancel}
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bet Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">What's the bet about?</label>
          <input 
            type="text" 
            placeholder="E.g., Super Bowl winner, Election outcome"
            className={`w-full px-4 py-2 rounded-lg border ${description.error ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            value={description.value}
            onChange={(e) => setDescription({ value: e.target.value, error: '' })}
          />
          {description.error && <p className="mt-1 text-sm text-red-600">{description.error}</p>}
        </div>
        
        {/* Opponent/Friend Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Who are you betting with?</label>
          <div 
            className={`w-full px-4 py-2 rounded-lg border ${opponent.error ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent flex items-center justify-between cursor-pointer`}
            onClick={() => setShowFriendDropdown(!showFriendDropdown)}
          >
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              {opponent.value || 'Select a friend'}
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showFriendDropdown ? 'transform rotate-180' : ''}`} />
          </div>
          {opponent.error && <p className="mt-1 text-sm text-red-600">{opponent.error}</p>}
          
          {/* Friends Dropdown */}
          {showFriendDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
              {friends.map(friend => (
                <div 
                  key={friend.id}
                  className="px-4 py-2 hover:bg-green-50 cursor-pointer flex items-center"
                  onClick={() => selectFriend(friend)}
                >
                  {friend.image && <img src={friend.image} alt={friend.name} className="w-8 h-8 rounded-full mr-3" />}
                  <span>{friend.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Amount and Due Date in a grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bet Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bet Amount</label>
            <div className={`flex items-center border ${amount.error ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg overflow-hidden`}>
              <div className="px-3 py-2 bg-gray-100 text-gray-500 border-r border-gray-300">
                <DollarSign className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="0.00"
                className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={amount.value}
                onChange={handleAmountChange}
              />
            </div>
            {amount.error && <p className="mt-1 text-sm text-red-600">{amount.error}</p>}
          </div>
          
          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <div className={`flex items-center border ${dueDate.error ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg overflow-hidden`}>
              <div className="px-3 py-2 bg-gray-100 text-gray-500 border-r border-gray-300">
                <Calendar className="w-5 h-5" />
              </div>
              <input 
                type="date" 
                className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={dueDate.value}
                onChange={(e) => setDueDate({ value: e.target.value, error: '' })}
              />
            </div>
            {dueDate.error && <p className="mt-1 text-sm text-red-600">{dueDate.error}</p>}
          </div>
        </div>
        
        {/* Payment Method Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <div 
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent flex items-center justify-between cursor-pointer"
            onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
          >
            {selectedPaymentMethod ? (
              <div className="flex items-center">
                {getPaymentIcon(selectedPaymentMethod.type)}
                <span className="ml-2">{selectedPaymentMethod.name} •••• {selectedPaymentMethod.lastFour}</span>
              </div>
            ) : (
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                Select payment method
              </div>
            )}
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showPaymentDropdown ? 'transform rotate-180' : ''}`} />
          </div>
          
          {/* Payment Methods Dropdown */}
          {showPaymentDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
              {paymentMethods.map(method => (
                <div 
                  key={method.id}
                  className="px-4 py-3 hover:bg-green-50 cursor-pointer flex items-center justify-between"
                  onClick={() => selectPaymentMethod(method)}
                >
                  <div className="flex items-center">
                    {getPaymentIcon(method.type)}
                    <span className="ml-2">{method.name} •••• {method.lastFour}</span>
                  </div>
                  <span className="text-xs text-gray-500">Expires {method.expiryDate}</span>
                </div>
              ))}
              <div className="px-4 py-3 border-t border-gray-100">
                <button type="button" className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Add new payment method
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Info box about security */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-start">
          <Shield className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-green-800">All transactions are secured with bank-level encryption. Funds will only be collected after the bet is resolved.</p>
          </div>
        </div>
        
        {/* Terms and Conditions */}
        <div className="flex items-start">
          <input 
            id="terms" 
            type="checkbox" 
            className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
            I agree to the <a href="#" className="text-green-600 hover:text-green-700">Terms of Service</a> and confirm that I am at least 18 years old.
          </label>
        </div>
        
        {/* Submit and Cancel buttons */}
        <div className="flex space-x-3">
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md flex items-center justify-center ${isSubmitting && 'opacity-70'}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Money Bet'
            )}
          </button>
          <button 
            type="button"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
        
        {/* Help link */}
        <div className="text-center">
          <a href="#" className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 mr-1" />
            Learn more about money bets
          </a>
        </div>
      </form>
    </div>
  );
};

export default MonetaryBetForm;