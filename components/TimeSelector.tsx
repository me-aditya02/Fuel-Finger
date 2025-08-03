
'use client';

import { useState } from 'react';

interface TimeSelectorProps {
  selectedTime: number;
  onTimeChange: (time: number) => void;
  disabled: boolean;
  theme: string;
}

export default function TimeSelector({ selectedTime, onTimeChange, disabled, theme }: TimeSelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTime, setCustomTime] = useState('');
  
  const timeOptions = [15, 30, 60, 120];

  const handleCustomTimeSubmit = () => {
    const time = parseInt(customTime);
    if (time > 0 && time <= 3600) {
      onTimeChange(time);
      setShowCustomInput(false);
      setCustomTime('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomTimeSubmit();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {timeOptions.map((time) => (
        <button
          key={time}
          onClick={() => onTimeChange(time)}
          disabled={disabled}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
            selectedTime === time
              ? theme === 'dark'
                ? 'bg-yellow-600 text-gray-900'
                : 'bg-blue-600 text-white'
              : theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {time}s
        </button>
      ))}
      
      {!showCustomInput ? (
        <button
          onClick={() => setShowCustomInput(true)}
          disabled={disabled}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
            theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          Custom
        </button>
      ) : (
        <div className="flex items-center space-x-1">
          <input
            type="number"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="300"
            min="1"
            max="3600"
            autoFocus
            className={`w-20 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-300 border-gray-600 focus:bg-gray-600'
                : 'bg-white text-gray-900 border-gray-300 focus:bg-gray-50'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>s</span>
        </div>
      )}
    </div>
  );
}