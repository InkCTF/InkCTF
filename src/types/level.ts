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

// Walkthrough step interface
export interface WalkthroughStep {
  title: string;
  content: string;
  code: string | null; // Code snippet related to the step, can be null
}

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
  solution: string; // Example solution code or description
  walkthrough: WalkthroughStep[];
  completed: boolean; // This might be better managed in user-specific data
}

// Simulated blockchain state
export interface BlockchainAccount {
  balance: number;
  // TODO
  // Potentially other account-specific state like nonces, code (for EOAs vs contracts) for future 
}

export interface BlockchainContract {
  storage: Record<string, any>;
  balance: number;
  codeHash?: string; 
}

export interface BlockchainState {
  accounts: Record<string, BlockchainAccount>; 
  contracts: Record<string, BlockchainContract>;
}

// Console output message type
export type ConsoleMessageType = 'info' | 'error' | 'success' | 'command';

// Console output interface
export interface ConsoleMessage {
  type: ConsoleMessageType;
  message: string;
  timestamp?: number;
}
