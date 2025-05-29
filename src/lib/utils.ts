import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Type Definitions
 */

// Level difficulty type
export type LevelDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

// Level category type
export type LevelCategory = 
  | 'Introduction' 
  | 'Access Control' 
  | 'Randomness' 
  | 'Reentrancy' 
  | 'Storage' 
  | 'Cross-Contract' 
  | 'Arithmetic' 
  | 'Logic'
  | 'Cryptography';

// Level data interface
export interface LevelData {
  id: number;
  title: string;
  description: string;
  objectives: string[];
  difficulty: LevelDifficulty;
  category: LevelCategory;
  contractCode: string;
  hints: string[];
  solution: string;
  completed: boolean;
}

// Console output message type
export type ConsoleMessageType = 'info' | 'error' | 'success' | 'command';

// Console output interface
export interface ConsoleMessage {
  type: ConsoleMessageType;
  message: string;
  timestamp?: number;
}

// Blockchain state interface
export interface BlockchainState {
  accounts: {
    [address: string]: {
      balance: number;
    }
  };
  contracts: {
    [address: string]: {
      storage: any;
      balance: number;
    }
  };
}

/**
 * Utility Functions
 */

// Combine class names with clsx and tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Local Storage Keys
const STORAGE_KEYS = {
  COMPLETED_LEVELS: 'completedLevels',
  USER_PROGRESS: 'userProgress',
  REVEALED_HINTS: 'revealedHints',
  USER_CODE: 'userCode',
};

// Get completed levels from local storage
export function getCompletedLevels(): number[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedLevels = localStorage.getItem(STORAGE_KEYS.COMPLETED_LEVELS);
    return storedLevels ? JSON.parse(storedLevels) : [];
  } catch (error) {
    console.error('Error getting completed levels:', error);
    return [];
  }
}

// Save completed level to local storage
export function saveCompletedLevel(levelId: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    const completedLevels = getCompletedLevels();
    if (!completedLevels.includes(levelId)) {
      completedLevels.push(levelId);
      localStorage.setItem(STORAGE_KEYS.COMPLETED_LEVELS, JSON.stringify(completedLevels));
    }
  } catch (error) {
    console.error('Error saving completed level:', error);
  }
}

// Check if a level is completed
export function isLevelCompleted(levelId: number): boolean {
  const completedLevels = getCompletedLevels();
  return completedLevels.includes(levelId);
}

// Get user progress percentage
export function getUserProgressPercentage(totalLevels: number): number {
  const completedLevels = getCompletedLevels();
  return (completedLevels.length / totalLevels) * 100;
}

// Get revealed hints for a level
export function getRevealedHints(levelId: number): number[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedHints = localStorage.getItem(`${STORAGE_KEYS.REVEALED_HINTS}_${levelId}`);
    return storedHints ? JSON.parse(storedHints) : [];
  } catch (error) {
    console.error('Error getting revealed hints:', error);
    return [];
  }
}

// Save revealed hint for a level
export function saveRevealedHint(levelId: number, hintIndex: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    const revealedHints = getRevealedHints(levelId);
    if (!revealedHints.includes(hintIndex)) {
      revealedHints.push(hintIndex);
      localStorage.setItem(`${STORAGE_KEYS.REVEALED_HINTS}_${levelId}`, JSON.stringify(revealedHints));
    }
  } catch (error) {
    console.error('Error saving revealed hint:', error);
  }
}

// Save user code for a level
export function saveUserCode(levelId: number, code: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`${STORAGE_KEYS.USER_CODE}_${levelId}`, code);
  } catch (error) {
    console.error('Error saving user code:', error);
  }
}

// Get user code for a level
export function getUserCode(levelId: number): string {
  if (typeof window === 'undefined') return '';
  
  try {
    const code = localStorage.getItem(`${STORAGE_KEYS.USER_CODE}_${levelId}`);
    return code || '';
  } catch (error) {
    console.error('Error getting user code:', error);
    return '';
  }
}

// Format timestamp to readable string
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}

// Check if a solution is correct (simplified for demo)
export function checkSolution(levelId: number, userCode: string, solution: string): boolean {
  // In a real implementation, this would be more sophisticated
  // For demo purposes, we'll just check if the user code contains key elements of the solution
  const userPattern = userCode.replace(/\s+/g, '').toLowerCase();
  const solutionPattern = solution.replace(/\s+/g, '').toLowerCase();
  
  // Check if user code contains key elements of the solution
  const solutionKeywords = solutionPattern.match(/\w+/g) || [];
  const requiredKeywords = solutionKeywords.filter(keyword => 
    keyword.length > 3 && !['const', 'function', 'return', 'true', 'false'].includes(keyword)
  );
  
  // Require at least 60% of the important keywords to be present
  const matchedKeywords = requiredKeywords.filter(keyword => userPattern.includes(keyword));
  return matchedKeywords.length >= Math.ceil(requiredKeywords.length * 0.6);
}

// Generate a simple hash for a string
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}
