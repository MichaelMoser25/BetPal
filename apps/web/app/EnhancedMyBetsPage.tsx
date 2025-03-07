// EnhancedMyBetsPage.tsx
"use client"

import { useState } from 'react';
import BetTypeToggle from './BetTypeToggle';  // Ensure this is a default import
console.log("BetTypeToggle:", BetTypeToggle);

import MonetaryBetIntegration from './MonetaryBetIntegration';
import MyBetsPage from './MyBetsPage';

const EnhancedMyBetsPage = () => {
  const [activeBetType, setActiveBetType] = useState<'regular' | 'money'>('regular');
  
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bets</h1>
            <p className="text-gray-600">Track, manage, and review all your wagers in one place.</p>
          </div>
          <BetTypeToggle 
            initialType={activeBetType}
            onChange={setActiveBetType}
          />
        </div>
      </div>
      
      {activeBetType === 'regular' ? (
        <MyBetsPage />
      ) : (
        <MonetaryBetIntegration />
      )}
    </div>
  );
};

export default EnhancedMyBetsPage;
