'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LevelNavigationProps {
  currentLevelId: number;
  levelTitle: string;
  totalLevels: number;
  onNavigate: (path: string) => void;
}

const LevelNavigation: React.FC<LevelNavigationProps> = ({ 
  currentLevelId, 
  levelTitle, 
  totalLevels, 
  onNavigate 
}) => {
  const handlePrevious = () => {
    if (currentLevelId > 1) {
      onNavigate(`/levels/${currentLevelId - 1}`);
    }
  };

  const handleNext = () => {
    if (currentLevelId < totalLevels) {
      onNavigate(`/levels/${currentLevelId + 1}`);
    } else {
      onNavigate('/'); // Navigate to homepage if it's the last level
    }
  };

  const isFirstLevel = currentLevelId === 1;
  const isLastLevel = currentLevelId === totalLevels;

  return (
    <div className="bg-[#2a1758]/50 py-3 px-4 sm:px-6 flex items-center justify-between border-b border-[#9e8cfc]/10 relative z-10 shadow-md">
      <button 
        onClick={handlePrevious}
        disabled={isFirstLevel}
        className={`flex items-center gap-1 text-sm rounded-full px-3 py-1.5 transition-all duration-200
                    ${isFirstLevel 
                      ? 'text-gray-500/70 cursor-not-allowed bg-[#1a0b2e]/30' 
                      : 'text-[#9e8cfc] hover:text-white hover:bg-[#6e56cf]/30 active:scale-95'}`}
        title="Previous Level"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>
      
      <h2 className="text-base sm:text-lg font-semibold text-center truncate px-2" style={{ fontFamily: 'Freude, sans-serif' }} title={`Level ${currentLevelId}: ${levelTitle}`}>
        <span className="text-white">Level {currentLevelId}:</span> <span className="text-[#e86bdf]">{levelTitle}</span>
      </h2>
      
      <button 
        onClick={handleNext}
        className={`flex items-center gap-1 text-sm rounded-full px-3 py-1.5 transition-all duration-200
                    ${isLastLevel 
                      ? 'text-[#5eead4] hover:text-white hover:bg-[#14b8a6]/40 active:scale-95' // Special style for "Go to Dashboard"
                      : 'text-[#9e8cfc] hover:text-white hover:bg-[#6e56cf]/30 active:scale-95'}`}
        title={isLastLevel ? "Finish & Go to Dashboard" : "Next Level"}
      >
        <span className="hidden sm:inline">{isLastLevel ? "Finish" : "Next"}</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default LevelNavigation;
