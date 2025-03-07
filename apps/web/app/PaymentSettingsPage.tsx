"use client"

import { useState } from 'react';
import { 
  CreditCard, Plus, Trash2, CheckCircle, AlertCircle, 
  DollarSign, Shield, ChevronRight, Loader2, X, 
  BanknoteIcon, ArrowDown, ArrowUp, Calendar, Lock
} from 'lucide-react';

// Interface for payment method
interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'discover';
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  name: string;
  isDefault: boolean;
}

// Interface for transaction
interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'winnings' | 'bet';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

const PaymentSettingsPage = () => {
  // State for payment methods and transactions
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1',
      type: 'visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2025',
      name: 'Ava Cook',
      isDefault: true
    },
    {
      id: 'pm_2',
      type: 'mastercard',
      last4: '8888',
      expiryMonth: '06',
      expiryYear: '2024',
      name: 'Ava Cook',
      isDefault: false
    }
  ]);
  
  // State for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'txn_1',
      type: 'deposit',
      amount: 100.00,
      status: 'completed',
      date: '2025-03-01T14:32:00',
      description: 'Deposit from Visa ending in 4242'
    },
    {
      id: 'txn_2',
      type: 'bet',
      amount: -25.00,
      status: 'completed',
      date: '2025-03-02T09:15:00',
      description: 'Bet on "Lakers vs Warriors game" with Morgan Lewis'
    },
    {
      id: 'txn_3',
      type: 'winnings',
      amount: 47.50,
      status: 'completed',
      date: '2025-03-03T18:45:00',
      description: 'Winnings from "Lakers vs Warriors game" bet'
    },
    {
      id: 'txn_4',
      type: 'withdrawal',
      amount: -50.00,
      status: 'pending',
      date: '2025-03-04T10:22:00',
      description: 'Withdrawal to Visa ending in 4242'
    }
  ]);
  
  // State for the current view
  const [activeView, setActiveView] = useState<'payment-methods' | 'transactions' | 'add-payment'>('payment-methods');
  
  // State for add payment form
  const [newPayment, setNewPayment] = useState({
    cardNumber: '',
    name: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    setAsDefault: false
  });
  
  // State for loading actions
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Get current account balance
  const getAccountBalance = (): number => {
    return transactions.reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);
  };
  
  // Set a payment method as default
  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    
    setSuccessMessage('Default payment method updated');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Remove a payment method
  const removePaymentMethod = (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedMethods = paymentMethods.filter(method => method.id !== id);
      
      // If we're removing the default method, set a new default
      if (paymentMethods.find(m => m.id === id)?.isDefault && updatedMethods.length > 0) {
        updatedMethods[0].isDefault = true;
      }
      
      setPaymentMethods(updatedMethods);
      setIsLoading(false);
      setSuccessMessage('Payment method removed successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };
  
  // Handle add payment form submission
  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (newPayment.cardNumber.length < 16 || !newPayment.name || !newPayment.expiryMonth || !newPayment.expiryYear || !newPayment.cvv) {
      setErrorMessage('Please complete all fields');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    // Simulate API call
    setTimeout(() => {
      // Generate a new card type based on first digit
      let cardType: 'visa' | 'mastercard' | 'amex' | 'discover' = 'visa';
      const firstDigit = newPayment.cardNumber.charAt(0);
      if (firstDigit === '5') cardType = 'mastercard';
      else if (firstDigit === '3') cardType = 'amex';
      else if (firstDigit === '6') cardType = 'discover';
      
      const last4 = newPayment.cardNumber.slice(-4);
      
      // Create new payment method
      const newMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: cardType,
        last4,
        expiryMonth: newPayment.expiryMonth,
        expiryYear: newPayment.expiryYear,
        name: newPayment.name,
        isDefault: newPayment.setAsDefault || paymentMethods.length === 0
      };
      
      // If this is set as default, update other methods
      let updatedMethods = [...paymentMethods];
      if (newMethod.isDefault) {
        updatedMethods = updatedMethods.map(method => ({
          ...method,
          isDefault: false
        }));
      }
      
      setPaymentMethods([...updatedMethods, newMethod]);
      
      // Reset form and show success
      setNewPayment({
        cardNumber: '',
        name: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        setAsDefault: false
      });
      
      setIsLoading(false);
      setSuccessMessage('Payment method added successfully');
      setActiveView('payment-methods');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1500);
  };
  
  // Handle deposit or withdrawal
  const handleFundsAction = (action: 'deposit' | 'withdraw') => {
    // This would typically open a modal or redirect to a dedicated form
    alert(`${action === 'deposit' ? 'Deposit' : 'Withdrawal'} functionality would open here`);
  };
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string): string => {
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, '');
    
    // Add a space every 4 digits
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };
  
  // Get card type icon
  const getCardTypeIcon = (type: string) => {
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
      case 'discover':
        return (
          <div className="w-8 h-5 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-semibold">
            DISC
          </div>
        );
      default:
        return <CreditCard className="w-5 h-5 text-gray-400" />;
    }
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Render the payment methods tab
  const renderPaymentMethods = () => (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center text-sm"
          onClick={() => setActiveView('add-payment')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </button>
      </div>
      
      {paymentMethods.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">No payment methods added yet</p>
          <p className="text-gray-500 text-sm mb-6">Add a payment method to start making real money bets</p>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center text-sm mx-auto"
            onClick={() => setActiveView('add-payment')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {paymentMethods.map(method => (
              <div key={method.id} className={`border rounded-lg overflow-hidden ${method.isDefault ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    {getCardTypeIcon(method.type)}
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-500">
                        {method.type.charAt(0).toUpperCase() + method.type.slice(1)} •••• {method.last4}
                        <span className="ml-2">Expires {method.expiryMonth}/{method.expiryYear}</span>
                      </p>
                    </div>
                    {method.isDefault && (
                      <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  
                  <div className="flex">
                    {!method.isDefault && (
                      <button
                        className="text-sm text-blue-600 hover:text-blue-800 mr-4"
                        onClick={() => setDefaultPaymentMethod(method.id)}
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      className="text-sm text-red-600 hover:text-red-800 flex items-center"
                      onClick={() => removePaymentMethod(method.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900">Account Balance</h3>
              <span className="text-xl font-bold text-green-600">{formatCurrency(getAccountBalance())}</span>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                onClick={() => handleFundsAction('deposit')}
              >
                <ArrowDown className="w-4 h-4 mr-2" />
                Deposit Funds
              </button>
              <button 
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                onClick={() => handleFundsAction('withdraw')}
                disabled={getAccountBalance() <= 0}
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Withdraw Funds
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
  
  // Render the transactions tab
  const renderTransactions = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
        <p className="text-gray-600">View your deposit, withdrawal, and betting history</p>
      </div>
      
      {transactions.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <BanknoteIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">No transactions yet</p>
          <p className="text-gray-500 text-sm mb-6">Your transaction history will appear here once you start betting</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium text-right ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100 text-sm text-blue-800">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Transaction Security</p>
            <p>All transactions are secured with bank-level encryption. For any questions or disputes, please contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render the add payment method form
  const renderAddPaymentForm = () => (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Add Payment Method</h2>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setActiveView('payment-methods')}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleAddPayment} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={newPayment.cardNumber}
              onChange={(e) => setNewPayment({
                ...newPayment,
                cardNumber: formatCardNumber(e.target.value)
              })}
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
          <input
            type="text"
            placeholder="Name as it appears on card"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={newPayment.name}
            onChange={(e) => setNewPayment({
              ...newPayment,
              name: e.target.value
            })}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={newPayment.expiryMonth}
                onChange={(e) => setNewPayment({
                  ...newPayment,
                  expiryMonth: e.target.value
                })}
                required
              >
                <option value="">Month</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={String(i + 1).padStart(2, '0')}>
                    {String(i + 1).padStart(2, '0')}
                  </option>
                ))}
              </select>
              
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={newPayment.expiryYear}
                onChange={(e) => setNewPayment({
                  ...newPayment,
                  expiryYear: e.target.value
                })}
                required
              >
                <option value="">Year</option>
                {[...Array(10)].map((_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={i} value={String(year)}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <div className="relative">
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={newPayment.cvv}
                onChange={(e) => {
                  // Only allow numbers and limit to 4 digits (for Amex)
                  const value = e.target.value.replace(/\D/g, '').substring(0, 4);
                  setNewPayment({
                    ...newPayment,
                    cvv: value
                  });
                }}
                required
                maxLength={4}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start">
          <input
            id="default-payment"
            type="checkbox"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            checked={newPayment.setAsDefault}
            onChange={(e) => setNewPayment({
              ...newPayment,
              setAsDefault: e.target.checked
            })}
          />
          <label htmlFor="default-payment" className="ml-2 block text-sm text-gray-600">
            Set as default payment method
          </label>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 flex items-start">
          <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Secure Payment Processing</p>
            <p>Your payment information is encrypted and securely stored. We never store your full card details on our servers.</p>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Add Payment Method'
            )}
          </button>
        </div>
      </form>
      
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          {errorMessage}
        </div>
      )}
    </div>
  );
  
  // Render view based on active tab
  const renderView = () => {
    switch (activeView) {
      case 'payment-methods':
        return renderPaymentMethods();
      case 'transactions':
        return renderTransactions();
      case 'add-payment':
        return renderAddPaymentForm();
      default:
        return renderPaymentMethods();
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Settings</h1>
        <p className="text-gray-600">Manage your payment methods and view transaction history</p>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          {successMessage}
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeView === 'payment-methods' || activeView === 'add-payment'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveView('payment-methods')}
            >
              Payment Methods
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeView === 'transactions'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveView('transactions')}
            >
              Transaction History
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {renderView()}
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm text-gray-600">
        <p className="mb-2 font-medium">Need help with payments?</p>
        <p>If you have any questions or need assistance with your payment methods or transactions, please contact our support team at <a href="mailto:support@betpal.com" className="text-blue-600 hover:text-blue-800">support@betpal.com</a>.</p>
      </div>
    </div>
  );
};

export default PaymentSettingsPage;