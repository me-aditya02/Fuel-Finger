
'use client';

import { useRef, useEffect, useState } from 'react';

interface TypingAreaProps {
  phrase: string;
  userInput: string;
  currentIndex: number;
  onInputChange: (value: string, index: number, correct: number, total: number) => void;
  isActive: boolean;
  theme: string;
}

export default function TypingArea({ 
  phrase, 
  userInput, 
  currentIndex, 
  onInputChange, 
  isActive,
  theme 
}: TypingAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Calculate how much text to show based on current progress
    const words = phrase.split(' ');
    const linesPerView = 3;
    const wordsPerLine = 12; // Approximate words per line
    const wordsPerView = linesPerView * wordsPerLine;
    
    // Show initial view
    let currentWordsToShow = wordsPerView;
    
    // If user has typed more than 80% of visible text, show more
    const currentVisibleText = words.slice(0, Math.ceil(visibleLength / (phrase.length / words.length))).join(' ');
    const progressPercentage = userInput.length / currentVisibleText.length;
    
    if (progressPercentage > 0.8) {
      currentWordsToShow += wordsPerView;
    }
    
    // Ensure we don't exceed total words
    currentWordsToShow = Math.min(currentWordsToShow, words.length);
    const newVisibleText = words.slice(0, currentWordsToShow).join(' ');
    
    setVisibleLength(newVisibleText.length);
  }, [userInput.length, phrase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Prevent typing beyond the visible phrase length
    if (value.length > visibleLength) return;
    
    let correctCount = 0;
    let currentIdx = 0;
    
    for (let i = 0; i < value.length; i++) {
      if (i < phrase.length && value[i] === phrase[i]) {
        correctCount++;
      }
      currentIdx = i + 1;
    }
    
    onInputChange(value, currentIdx, correctCount, value.length);
  };

  const handleAreaClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderText = () => {
    const visiblePhrase = phrase.substring(0, visibleLength);
    
    return visiblePhrase.split('').map((char, index) => {
      let className = 'relative ';
      
      if (index < userInput.length) {
        // Typed characters
        if (userInput[index] === char) {
          className += theme === 'dark' ? 'text-green-400 bg-green-900/20' : 'text-green-600 bg-green-100';
        } else {
          className += theme === 'dark' ? 'text-red-400 bg-red-900/20' : 'text-red-600 bg-red-100';
        }
      } else if (index === userInput.length) {
        // Current character
        className += theme === 'dark' 
          ? 'bg-yellow-500/30 border-l-2 border-yellow-500' 
          : 'bg-blue-200 border-l-2 border-blue-600';
      } else {
        // Untyped characters
        className += theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  // Calculate progress percentage for the progress bar
  const progressPercentage = Math.min((userInput.length / phrase.length) * 100, 100);

  return (
    <div className="w-full max-w-4xl">
      {/* Progress Bar */}
      <div className={`w-full h-1 rounded-full mb-4 ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <div 
          className={`h-full rounded-full transition-all duration-300 ${
            theme === 'dark' ? 'bg-yellow-500' : 'bg-blue-600'
          }`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Display Text */}
      <div 
        onClick={handleAreaClick}
        className={`w-full p-6 rounded-lg text-xl leading-relaxed font-mono mb-4 cursor-text transition-colors ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700 hover:bg-gray-750' 
            : 'bg-white border border-gray-200 hover:bg-gray-50'
        }`} 
        style={{ minHeight: '180px' }}
      >
        {renderText()}
        {/* Show continuation indicator if there's more text */}
        {visibleLength < phrase.length && (
          <span className={`ml-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            ...
          </span>
        )}
      </div>

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className="absolute opacity-0 pointer-events-none"
        autoComplete="off"
        spellCheck="false"
        style={{ left: '-9999px' }}
      />

      {/* Instructions and Stats */}
      <div className="flex justify-between items-center">
        <p className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {!isActive ? 'Click here and start typing to begin the test' : 'Keep typing...'}
        </p>
        <p className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {userInput.length} / {phrase.length} characters
        </p>
      </div>
    </div>
  );
}
