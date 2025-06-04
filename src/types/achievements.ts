// src/types/achievement.ts

import React from 'react';

// User statistics interface
export interface UserStats {
  completedLevels: number[];          // Array of completed level IDs
  completedWithoutHints: number[];    // Array of level IDs completed without using hints
  speedCompletions: number[];         // Array of level IDs completed within a certain time limit
  unlockedAchievements: string[];     // Array of unlocked achievement IDs
  levelStartTimes: { [key: number]: number }; // Timestamps for when each level was started
}

// Achievement interface
export interface Achievement {
  id: string;                         // Unique identifier for the achievement
  name: string;                       // Display name of the achievement
  description: string;                // Description of how to earn the achievement
  icon: React.ReactNode;              // Icon representing the achievement (e.g., Lucide icon)
  condition: (stats: UserStats) => boolean; // Function to check if the achievement is unlocked
}
