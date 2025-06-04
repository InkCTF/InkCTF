'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, CheckCircle } from 'lucide-react';
import { LevelData } from '@/types/level';
import { UserStats, Achievement } from '@/types/achievements';
import { achievements as allAchievements } from '@/data/achievements';

interface LevelHeaderProps {
  level: LevelData | null;
  levelCompleted: boolean;
  userStats: UserStats;
  onShowAchievements: () => void;
}

const LevelHeader: React.FC<LevelHeaderProps> = ({ level, levelCompleted, userStats, onShowAchievements }) => {
  if (!level) {
    // Or a more sophisticated loading state
    return (
      <header className="bg-gradient-to-r from-[#6e56cf]/30 to-[#3b4fd9]/30 backdrop-blur-md py-4 px-6 flex items-center justify-between border-b border-[#9e8cfc]/20 relative z-10">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            {/* Placeholder or loading image */}
          </div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Freude, sans-serif' }}>
            <span className="text-[#6e56cf]">ink!</span><span className="text-[#e86bdf]">CTF</span>
          </h1>
        </div>
        <div className="animate-pulse h-6 w-24 bg-gray-700 rounded-full"></div>
      </header>
    );
  }

  const difficultyColor = 
    level.difficulty === 'Beginner' ? 'bg-[#3b4fd9]/50 text-[#8a9cff]' : 
    level.difficulty === 'Intermediate' ? 'bg-[#e86bdf]/50 text-[#ffc4f7]' : 
    'bg-[#ff5757]/50 text-[#ff9a9a]';

  return (
    <header className="bg-gradient-to-r from-[#6e56cf]/30 to-[#3b4fd9]/30 backdrop-blur-md py-4 px-6 flex items-center justify-between border-b border-[#9e8cfc]/20 relative z-10">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="relative w-8 h-8 group-hover:scale-110 transition-transform">
          <Image
            src="/squink.svg"
            alt="Squink - ink!CTF Mascot"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Freude, sans-serif' }}>
          <span className="text-[#6e56cf] group-hover:text-white transition-colors">ink!</span>
          <span className="text-[#e86bdf] group-hover:text-white transition-colors">CTF</span>
        </h1>
      </Link>
      <div className="flex items-center gap-3 md:gap-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColor}`}>
          {level.difficulty}
        </span>
        <span className="hidden sm:inline-block bg-[#6e56cf]/40 px-3 py-1 rounded-full text-xs text-[#c5bfff]">
          {level.category}
        </span>
        {levelCompleted && (
          <span className="flex items-center text-[#5eead4] text-xs sm:text-sm font-medium">
            <CheckCircle className="h-4 w-4 mr-1" />
            Completed
          </span>
        )}
        <button 
          onClick={onShowAchievements}
          className="flex items-center gap-1 text-xs sm:text-sm bg-[#6e56cf]/50 hover:bg-[#6e56cf]/70 px-3 py-1.5 rounded-full transition-colors text-white hover:shadow-lg hover:shadow-[#6e56cf]/30"
          title="View Achievements"
        >
          <Award className="h-4 w-4 text-[#ffc4f7]" />
          <span>{userStats.unlockedAchievements.length}/{allAchievements.length}</span>
        </button>
      </div>
    </header>
  );
};

export default LevelHeader;
