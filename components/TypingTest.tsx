
'use client';

import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import TimeSelector from './TimeSelector';
import TypingArea from './TypingArea';
import Results from './Results';
import { generateRandomPhrase } from '../lib/phrases';

export default function TypingTest() {
  const [theme, setTheme] = useState('light');
  const [timeLimit, setTimeLimit] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    generateNewPhrase();
  }, [timeLimit]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  const generateNewPhrase = () => {
    const phrase = generateRandomPhrase(timeLimit);
    setCurrentPhrase(phrase);
    resetTest();
  };

  const resetTest = () => {
    setIsActive(false);
    setTimeLeft(timeLimit);
    setUserInput('');
    setCurrentIndex(0);
    setCorrectChars(0);
    setTotalChars(0);
    setShowResults(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const startTest = () => {
    if (!isActive) {
      setIsActive(true);
    }
  };

  const finishTest = () => {
    setIsActive(false);
    calculateResults();
    setShowResults(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const calculateResults = () => {
    const timeUsed = (timeLimit - timeLeft) / 60;
    const wordsTyped = correctChars / 5;
    const calculatedWpm = timeUsed > 0 ? Math.round(wordsTyped / timeUsed) : 0;
    const calculatedAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
  };

  const handleInputChange = (value: string, index: number, correct: number, total: number) => {
    setUserInput(value);
    setCurrentIndex(index);
    setCorrectChars(correct);
    setTotalChars(total);

    if (!isActive && value.length > 0) {
      startTest();
    }

    if (index >= currentPhrase.length - 1 && value === currentPhrase) {
      finishTest();
    }
  };

  const handleTimeChange = (time: number) => {
    setTimeLimit(time);
    setTimeLeft(time);
    resetTest();
  };

  const handleRestart = () => {
    generateNewPhrase();
  };

  const FloatingElement = ({ 
    children, 
    delay, 
    position, 
    animation = "float",
    duration = "4s"
  }: { 
    children: React.ReactNode; 
    delay: number; 
    position: string; 
    animation?: string;
    duration?: string;
  }) => (
    <div 
      className={`absolute ${position} opacity-10 pointer-events-none select-none`}
      style={{ 
        animationDelay: `${delay}s`,
        animation: `${animation} ${duration} ease-in-out infinite`
      }}
    >
      {children}
    </div>
  );

  const GradientOrb = ({ delay, position, color }: { delay: number; position: string; color: string }) => (
    <div 
      className={`absolute ${position} w-32 h-32 rounded-full blur-xl ${
        theme === 'dark' ? 'opacity-20' : 'opacity-10'
      }`}
      style={{ 
        background: `radial-gradient(circle, ${color}60 0%, transparent 70%)`,
        animationDelay: `${delay}s`,
        animation: 'pulse 6s ease-in-out infinite alternate'
      }}
    ></div>
  );

  return (
    <div className={`min-h-screen transition-all duration-300 relative overflow-hidden ${
      theme === 'dark'
        ? 'bg-gray-900 text-gray-100'
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Enhanced Background Animations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <GradientOrb delay={0} position="top-10 left-10" color="#3b82f6" />
        <GradientOrb delay={2} position="top-20 right-16" color="#8b5cf6" />
        <GradientOrb delay={4} position="bottom-20 left-20" color="#06b6d4" />
        <GradientOrb delay={1} position="bottom-10 right-10" color="#10b981" />
        <GradientOrb delay={3} position="top-1/2 left-1/2" color="#f59e0b" />

        {/* Floating Keyboards with better visibility */}
        <FloatingElement delay={0} position="top-16 left-8" animation="floatSlow" duration="6s">
          <i className={`ri-keyboard-line text-5xl ${theme === 'dark' ? 'text-blue-400 opacity-40' : 'text-blue-500 opacity-30'}`}></i>
        </FloatingElement>
        <FloatingElement delay={2} position="top-32 right-12" animation="floatSlow" duration="7s">
          <i className={`ri-keyboard-line text-4xl ${theme === 'dark' ? 'text-purple-400 opacity-40' : 'text-purple-500 opacity-30'}`}></i>
        </FloatingElement>
        <FloatingElement delay={4} position="bottom-32 left-16" animation="floatSlow" duration="5s">
          <i className={`ri-keyboard-line text-5xl ${theme === 'dark' ? 'text-cyan-400 opacity-40' : 'text-cyan-500 opacity-30'}`}></i>
        </FloatingElement>

        {/* Elegant Typing Words with better visibility */}
        <FloatingElement delay={0} position="top-24 left-1/4" animation="fadeInOut" duration="8s">
          <span className={`text-2xl font-bold ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent opacity-60' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent opacity-40'
          }`}>
            TYPE
          </span>
        </FloatingElement>
        <FloatingElement delay={2} position="top-40 right-1/4" animation="fadeInOut" duration="6s">
          <span className={`text-xl font-bold ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent opacity-60' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent opacity-40'
          }`}>
            SPEED
          </span>
        </FloatingElement>
        <FloatingElement delay={4} position="bottom-40 left-1/3" animation="fadeInOut" duration="7s">
          <span className={`text-2xl font-bold ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent opacity-60' 
              : 'bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent opacity-40'
          }`}>
            FAST
          </span>
        </FloatingElement>
        <FloatingElement delay={1} position="bottom-24 right-1/3" animation="fadeInOut" duration="5s">
          <span className={`text-xl font-bold ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent opacity-60' 
              : 'bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent opacity-40'
          }`}>
            QUICK
          </span>
        </FloatingElement>

        {/* Stylish Numbers with better visibility */}
        <FloatingElement delay={0.5} position="top-48 left-12" animation="scaleFloat" duration="4s">
          <div className={`rounded-full px-4 py-2 ${
            theme === 'dark' ? 'bg-blue-400/30' : 'bg-blue-500/20'
          }`}>
            <span className={`text-xl font-mono font-bold ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
            }`}>123</span>
          </div>
        </FloatingElement>
        <FloatingElement delay={2.5} position="top-64 right-20" animation="scaleFloat" duration="5s">
          <div className={`rounded-full px-4 py-2 ${
            theme === 'dark' ? 'bg-purple-400/30' : 'bg-purple-500/20'
          }`}>
            <span className={`text-xl font-mono font-bold ${
              theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
            }`}>WPM</span>
          </div>
        </FloatingElement>
        <FloatingElement delay={1.5} position="bottom-48 left-24" animation="scaleFloat" duration="4.5s">
          <div className={`rounded-full px-4 py-2 ${
            theme === 'dark' ? 'bg-green-400/30' : 'bg-green-500/20'
          }`}>
            <span className={`text-xl font-mono font-bold ${
              theme === 'dark' ? 'text-green-300' : 'text-green-600'
            }`}>95%</span>
          </div>
        </FloatingElement>

        {/* Floating Symbols with rotation and better visibility */}
        <FloatingElement delay={0} position="top-72 left-6" animation="rotateFloat" duration="10s">
          <span className={`text-3xl ${theme === 'dark' ? 'text-blue-400 opacity-50' : 'text-blue-500 opacity-35'}`}>@</span>
        </FloatingElement>
        <FloatingElement delay={2} position="top-80 right-8" animation="rotateFloat" duration="8s">
          <span className={`text-3xl ${theme === 'dark' ? 'text-purple-400 opacity-50' : 'text-purple-500 opacity-35'}`}>#</span>
        </FloatingElement>
        <FloatingElement delay={4} position="bottom-64 left-8" animation="rotateFloat" duration="12s">
          <span className={`text-3xl ${theme === 'dark' ? 'text-green-400 opacity-50' : 'text-green-500 opacity-35'}`}>&amp;</span>
        </FloatingElement>
        <FloatingElement delay={1} position="bottom-72 right-6" animation="rotateFloat" duration="9s">
          <span className={`text-3xl ${theme === 'dark' ? 'text-yellow-400 opacity-50' : 'text-yellow-500 opacity-35'}`}>$</span>
        </FloatingElement>

        {/* Beautiful Letters with better visibility */}
        <FloatingElement delay={0} position="top-88 left-20" animation="bounceFloat" duration="3s">
          <span className={`text-4xl font-bold ${
            theme === 'dark' ? 'text-blue-400 opacity-40' : 'text-blue-500 opacity-25'
          }`}>A</span>
        </FloatingElement>
        <FloatingElement delay={1} position="top-96 right-24" animation="bounceFloat" duration="3.5s">
          <span className={`text-4xl font-bold ${
            theme === 'dark' ? 'text-purple-400 opacity-40' : 'text-purple-500 opacity-25'
          }`}>Z</span>
        </FloatingElement>
        <FloatingElement delay={2} position="bottom-80 left-28" animation="bounceFloat" duration="4s">
          <span className={`text-4xl font-bold ${
            theme === 'dark' ? 'text-green-400 opacity-40' : 'text-green-500 opacity-25'
          }`}>Q</span>
        </FloatingElement>

        {/* Particle Lines with better visibility */}
        <div className={`absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent to-transparent animate-pulse ${
          theme === 'dark' ? 'via-blue-400/30' : 'via-blue-500/20'
        }`}></div>
        <div className={`absolute bottom-20 left-0 w-full h-px bg-gradient-to-r from-transparent to-transparent animate-pulse ${
          theme === 'dark' ? 'via-purple-400/30' : 'via-purple-500/20'
        }`} style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Add Custom CSS Animations - Removed blink animation */}
      <style jsx>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(2deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes scaleFloat {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.4; }
          50% { transform: scale(1.1) translateY(-5px); opacity: 0.7; }
        }
        
        @keyframes rotateFloat {
          0% { transform: rotate(0deg) translateY(0); opacity: 0.3; }
          25% { transform: rotate(90deg) translateY(-3px); opacity: 0.5; }
          50% { transform: rotate(180deg) translateY(0); opacity: 0.6; }
          75% { transform: rotate(270deg) translateY(-3px); opacity: 0.5; }
          100% { transform: rotate(360deg) translateY(0); opacity: 0.3; }
        }
        
        @keyframes bounceFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.25; }
          50% { transform: translateY(-8px) scale(1.05); opacity: 0.45; }
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between w-full max-w-4xl">
            <div className="flex items-center space-x-4">
              <img 
                src="https://static.readdy.ai/image/168a80787d9c0b2b731d5cca0df0aedd/eaef008a80c6eb1302e6f22c70af3d58.png" 
                alt="FingerFuel" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-3xl font-bold font-['Pacifico']">FingerFuel</h1>
            </div>
            <ThemeToggle theme={theme} onToggle={setTheme} />

          </div>

          {/* Controls */}
          <div className="flex flex-col items-center space-y-6">
            <TimeSelector
              selectedTime={timeLimit}
              onTimeChange={handleTimeChange}
              disabled={isActive}
              theme={theme}
            />

            {/* Timer Display */}
            <div className={`text-4xl font-bold ${
              timeLeft <= 10 ? 'text-red-500' : theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'
            }`}>
              {timeLeft}s
            </div>
          </div>

          {/* Typing Area */}
          {!showResults ? (
            <TypingArea
              phrase={currentPhrase}
              userInput={userInput}
              currentIndex={currentIndex}
              onInputChange={handleInputChange}
              isActive={isActive}
              theme={theme}
            />
          ) : (
            <Results
              wpm={wpm}
              accuracy={accuracy}
              onRestart={handleRestart}
              theme={theme}
            />
          )}

          {/* Restart Button */}
          {!showResults && (
            <button
              onClick={handleRestart}
              className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <i className="ri-refresh-line w-4 h-4 flex items-center justify-center mr-2 inline-flex"></i>
              New Phrase
            </button>
          )}
        </div>
      </div>
      <footer className={`mt-16 pt-8 border-t text-center text-sm ${
        theme === 'dark' 
          ? 'border-gray-700 text-gray-400' 
          : 'border-gray-200 text-gray-600'
      }`}>
        <p>Copyright 2025 Aditya Kumar. All rights reserved.</p>
      </footer>
    </div>
  );
}
