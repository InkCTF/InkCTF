import React from 'react';

// User statistics interface
export interface UserStats {
  completedLevels: number[];
  completedWithoutHints: number[];
  speedCompletions: number[];
  unlockedAchievements: string[];
  levelStartTimes: { [key: number]: number };
}

// Achievement interface
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  condition: (stats: UserStats) => boolean;
}
