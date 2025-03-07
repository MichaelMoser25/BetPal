"use client"

import { useState } from 'react';
import { DollarSign, Gift } from 'lucide-react';
import MyBetsPage from './MyBetsPage';
import BetPalMonetary from './BetPalMonetary';

/**
 * Main component for BetPal app that allows toggling between regular and money bets
 */
const BetPalToggle = () => {
  const [betMode, setBetMode] = useState<'regular' | 'money'>('regular');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mode Toggle at the top */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-center">
            <div className="inline-flex p-1 rounded-lg bg-gray-100">
              <button
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  betMode === 'regular'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setBetMode('regular')}
              >
                <Gift className="w-4 h-4 mr-2" />
                Regular Bets
              </button>
              <button
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  betMode === 'money'
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setBetMode('money')}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Money Bets
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Display the appropriate component based on selected mode */}
      {betMode === 'regular' ? (
        <MyBetsPage />
      ) : (
        <BetPalMonetary />
      )}
      
      {/* Footer for money betting only */}
      {betMode === 'money' && (
        <footer className="bg-gray-900 text-white text-xs py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-2 md:mb-0">
                <p>BetPal Money operates under license #BET-12345-MONEY. Users must be 18+ to place money bets.</p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-300">Terms of Service</a>
                <a href="#" className="hover:text-blue-300">Privacy Policy</a>
                <a href="#" className="hover:text-blue-300">Responsible Gambling</a>
              </div>
            </div>
            <p className="text-center mt-2 text-gray-400">
              BetPal is committed to responsible gambling. If you have concerns about your gambling behavior,
              please contact our support team or visit <a href="#" className="text-blue-400 hover:underline">GambleAware.org</a>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default BetPalToggle;