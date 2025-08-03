'use client';

interface ThemeToggleProps {
  theme: string;
  onToggle: (theme: string) => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={() => onToggle(theme === 'light' ? 'dark' : 'light')}
      className={`p-2 rounded-lg transition-colors cursor-pointer ${
        theme === 'dark'
          ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {theme === 'light' ? (
        <i className="ri-moon-line w-5 h-5 flex items-center justify-center"></i>
      ) : (
        <i className="ri-sun-line w-5 h-5 flex items-center justify-center"></i>
      )}
    </button>
  );
}