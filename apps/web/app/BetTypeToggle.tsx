"use client";

import { useState } from 'react';
import { DollarSign, Gift } from 'lucide-react';

interface BetTypeToggleProps {
  initialType?: 'regular' | 'money';
  onChange: (type: 'regular' | 'money') => void;
}

const BetTypeToggle = ({ initialType = 'regular', onChange }: BetTypeToggleProps) => {
  const [activeType, setActiveType] = useState<'regular' | 'money'>(initialType);

  const handleTypeChange = (type: 'regular' | 'money') => {
    setActiveType(type);
    onChange(type);
  };

  return (
    <div className="flex p-1 bg-gray-100 rounded-lg">
      <button
        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeType === 'regular'
            ? 'bg-white text-blue-700 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        onClick={() => handleTypeChange('regular')}
      >
        <Gift className="w-4 h-4 mr-2" />
        Regular Bets
      </button>
      <button
        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeType === 'money'
            ? 'bg-white text-green-700 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        onClick={() => handleTypeChange('money')}
      >
        <DollarSign className="w-4 h-4 mr-2" />
        Money Bets
      </button>
    </div>
  );//
};

export default BetTypeToggle;  // Ensure this is the default export
