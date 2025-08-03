'use client';

interface ResultsProps {
  wpm: number;
  accuracy: number;
  onRestart: () => void;
  theme: string;
}

export default function Results({ wpm, accuracy, onRestart, theme }: ResultsProps) {
  const getWpmColor = () => {
    if (wpm >= 60) return 'text-green-500';
    if (wpm >= 40) return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
    return 'text-red-500';
  };

  const getAccuracyColor = () => {
    if (accuracy >= 95) return 'text-green-500';
    if (accuracy >= 85) return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
    return 'text-red-500';
  };

  return (
    <div className={`w-full max-w-2xl p-8 rounded-lg ${
      theme === 'dark' 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-200'
    }`}>
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold">Test Complete!</h2>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="text-sm uppercase tracking-wide opacity-75">
              Words Per Minute
            </div>
            <div className={`text-4xl font-bold ${getWpmColor()}`}>
              {wpm}
            </div>
            <div className="text-xs opacity-60">
              WPM
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm uppercase tracking-wide opacity-75">
              Accuracy
            </div>
            <div className={`text-4xl font-bold ${getAccuracyColor()}`}>
              {accuracy}%
            </div>
            <div className="text-xs opacity-60">
              Correct Characters
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={onRestart}
            className={`px-8 py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
              theme === 'dark'
                ? 'bg-yellow-600 text-gray-900 hover:bg-yellow-500'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            <i className="ri-refresh-line w-4 h-4 flex items-center justify-center mr-2 inline-flex"></i>
            Try Again
          </button>
        </div>

        {/* Performance Feedback */}
        <div className={`text-sm p-4 rounded-lg ${
          theme === 'dark' 
            ? 'bg-gray-700/50 text-gray-300' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {wpm >= 60 && accuracy >= 95 && "Excellent! You're a typing master! 🏆"}
          {wpm >= 40 && wpm < 60 && accuracy >= 90 && "Great job! Keep practicing to improve your speed. 👍"}
          {wpm >= 30 && wpm < 40 && accuracy >= 85 && "Good work! Focus on increasing your speed. 💪"}
          {wpm < 30 && accuracy >= 80 && "Not bad! Practice regularly to build up your speed. 📈"}
          {accuracy < 80 && "Focus on accuracy first, then speed will naturally follow. 🎯"}
        </div>
      </div>
    </div>
  );
}