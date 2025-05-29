'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Editor } from '@monaco-editor/react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ChevronLeft, ChevronRight, LightbulbIcon, CheckCircle, XCircle, Terminal, Code, FileText, PlayCircle, Coffee } from 'lucide-react';

// Mock data for levels
const levelsData = [
  {
    id: 1,
    title: 'Hello Squink!',
    description: 'Welcome to ink!CTF! This is your first challenge to get familiar with the platform. Your objective is to call the `claim_victory` function to complete this level.',
    objectives: [
      'Understand how to interact with ink! contracts',
      'Call the `claim_victory` function to complete the level'
    ],
    difficulty: 'Beginner',
    category: 'Introduction',
    contractCode: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod hello_squink {
    #[ink(storage)]
    pub struct HelloSquink {
        victory_claimed: bool,
    }

    impl HelloSquink {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self { 
                victory_claimed: false 
            }
        }

        #[ink(message)]
        pub fn claim_victory(&mut self) {
            self.victory_claimed = true;
        }

        #[ink(message)]
        pub fn victory_achieved(&self) -> bool {
            self.victory_claimed
        }
    }
}`,
    hints: [
      'Look at the contract code to understand what functions are available',
      'You need to call the `claim_victory` function to set victory_claimed to true',
      'Use the console interface to interact with the contract'
    ],
    solution: `// Call the claim_victory function
contract.claim_victory()`,
    completed: false
  },
  {
    id: 2,
    title: 'Fallback',
    description: 'This contract includes a fallback function that gets triggered when a function is called that doesn\'t exist. Your goal is to exploit this to gain ownership of the contract.',
    objectives: [
      'Become the owner of the contract',
      'Drain the contract\'s funds'
    ],
    difficulty: 'Beginner',
    category: 'Access Control',
    contractCode: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod fallback {
    use ink::storage::Mapping;

    #[ink(storage)]
    pub struct Fallback {
        owner: AccountId,
        contributions: Mapping<AccountId, Balance>,
    }

    impl Fallback {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                owner: Self::env().caller(),
                contributions: Mapping::default(),
            }
        }

        #[ink(message, payable)]
        pub fn contribute(&mut self) {
            let caller = self.env().caller();
            let contribution = self.env().transferred_value();
            
            // Require minimum contribution
            assert!(contribution > 0, "Contribution must be greater than 0");
            
            // Update contribution
            let current_contribution = self.contributions.get(caller).unwrap_or(0);
            self.contributions.insert(caller, &(current_contribution + contribution));
        }

        #[ink(message)]
        pub fn get_contribution(&self, account: AccountId) -> Balance {
            self.contributions.get(account).unwrap_or(0)
        }

        #[ink(message)]
        pub fn withdraw(&mut self) {
            let caller = self.env().caller();
            assert!(caller == self.owner, "Only owner can withdraw");
            
            self.env().transfer(caller, self.env().balance()).expect("Transfer failed");
        }

        #[ink(message)]
        pub fn get_owner(&self) -> AccountId {
            self.owner
        }

        // Fallback function - called when no other function matches
        #[ink(message, payable, selector = _)]
        pub fn fallback(&mut self) {
            let caller = self.env().caller();
            let value = self.env().transferred_value();
            
            // If someone sends more than 0 and has previously contributed, make them the owner
            if value > 0 && self.contributions.get(caller).unwrap_or(0) > 0 {
                self.owner = caller;
            }
        }
    }
}`,
    hints: [
      'Read the fallback function carefully to understand when ownership changes',
      'You need to make a contribution first before using the fallback',
      'The fallback function is triggered when you call a function that doesn\'t exist'
    ],
    solution: `// First make a contribution
contract.contribute({ value: 1 })

// Then trigger the fallback by sending value to a non-existent function
contract.sendTransaction({ value: 1, data: "0x12345678" })

// Now withdraw the funds
contract.withdraw()`,
    completed: false
  },
  // Additional levels would be defined here...
];

// Simulated blockchain state
interface BlockchainState {
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

// Interface for level data
interface LevelData {
  id: number;
  title: string;
  description: string;
  objectives: string[];
  difficulty: string;
  category: string;
  contractCode: string;
  hints: string[];
  solution: string;
  completed: boolean;
}

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const levelId = parseInt(params.id as string);
  
  const [level, setLevel] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [consoleOutput, setConsoleOutput] = useState<Array<{type: string, message: string}>>([]);
  const [userCode, setUserCode] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [blockchainState, setBlockchainState] = useState<BlockchainState>({
    accounts: {
      'player': { balance: 1000 },
      'contract': { balance: 100 }
    },
    contracts: {
      'contract': {
        storage: {},
        balance: 100
      }
    }
  });

  // Fetch level data
  useEffect(() => {
    if (isNaN(levelId)) {
      router.push('/');
      return;
    }

    const levelData = levelsData.find(l => l.id === levelId);
    if (!levelData) {
      router.push('/');
      return;
    }

    setLevel(levelData);
    setLoading(false);
    
    // Initialize user code with a template
    setUserCode(`// Interact with the contract to solve the challenge
// Example: contract.someFunction()

`);

    // Add welcome message to console
    setConsoleOutput([
      { type: 'info', message: `Welcome to Level ${levelId}: ${levelData.title}` },
      { type: 'info', message: 'Use the console to interact with the contract' },
      { type: 'info', message: 'Type your commands in the editor and click "Run" to execute' }
    ]);

    // Check if level was previously completed
    const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
    if (completedLevels.includes(levelId)) {
      setLevelCompleted(true);
    }
  }, [levelId, router]);

  // Function to run user code
  const runUserCode = () => {
    // Add user code to console
    setConsoleOutput(prev => [...prev, { type: 'command', message: userCode }]);

    // Simple simulation of code execution
    try {
      // For demo purposes, we'll check if the solution is somewhat similar to the expected solution
      // In a real implementation, this would actually execute the code against a simulated blockchain
      const solutionPattern = level?.solution.replace(/\s+/g, '').toLowerCase() || '';
      const userPattern = userCode.replace(/\s+/g, '').toLowerCase();

      // Check if user code contains key elements of the solution
      if (level?.id === 1 && userPattern.includes('claim_victory')) {
        // Mark level as completed
        handleLevelComplete();
        setConsoleOutput(prev => [...prev, { type: 'success', message: 'Victory claimed! Level completed!' }]);
      } else if (level?.id === 2 && 
                userPattern.includes('contribute') && 
                userPattern.includes('sendtransaction') && 
                userPattern.includes('withdraw')) {
        // Mark level as completed
        handleLevelComplete();
        setConsoleOutput(prev => [...prev, 
          { type: 'info', message: 'Contribution made...' },
          { type: 'info', message: 'Fallback function triggered...' },
          { type: 'info', message: 'Ownership transferred to player!' },
          { type: 'success', message: 'Contract drained! Level completed!' }
        ]);
      } else {
        // Simulate failure
        setConsoleOutput(prev => [...prev, { type: 'error', message: 'That didn\'t work. Try a different approach.' }]);
        setShowFailure(true);
        setTimeout(() => setShowFailure(false), 3000);
      }
    } catch (error) {
      setConsoleOutput(prev => [...prev, { type: 'error', message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }]);
    }
  };

  // Function to handle level completion
  const handleLevelComplete = () => {
    if (!levelCompleted) {
      setLevelCompleted(true);
      setShowSuccess(true);
      
      // Save completed level to localStorage
      const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
      if (!completedLevels.includes(levelId)) {
        completedLevels.push(levelId);
        localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Function to reveal a hint
  const revealHint = (index: number) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints(prev => [...prev, index]);
    }
  };

  // Navigate to previous level
  const goToPreviousLevel = () => {
    if (levelId > 1) {
      router.push(`/levels/${levelId - 1}`);
    }
  };

  // Navigate to next level
  const goToNextLevel = () => {
    if (levelId < levelsData.length) {
      router.push(`/levels/${levelId + 1}`);
    } else {
      router.push('/');
    }
  };

  if (loading || !level) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1a0b2e] via-[#2a1758] to-[#1a0b2e]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#6e56cf]"></div>
          <div className="absolute inset-0 flex items-center justify-center text-[#9e8cfc]">
            <span className="text-sm">Loading</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2a1758] to-[#1a0b2e] text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Left tentacle decoration */}
        <svg className="absolute left-0 top-1/4 w-32 h-96 text-[#9e8cfc] opacity-20" viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,150 Q30,100 10,50 Q-10,0 30,0" stroke="currentColor" strokeWidth="8" fill="none" className="animate-wave-slow" />
          <path d="M10,300 Q40,250 20,200 Q0,150 40,100" stroke="currentColor" strokeWidth="6" fill="none" className="animate-wave-slow" />
        </svg>
        
        {/* Right tentacle decoration */}
        <svg className="absolute right-0 top-1/3 w-32 h-96 text-[#e86bdf] opacity-20" viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100,100 Q70,150 90,200 Q110,250 70,300" stroke="currentColor" strokeWidth="8" fill="none" className="animate-wave-slow" />
          <path d="M90,50 Q60,100 80,150 Q100,200 60,250" stroke="currentColor" strokeWidth="6" fill="none" className="animate-wave-slow" />
        </svg>
        
        {/* Background blob */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#6e56cf]/5 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#e86bdf]/5 rounded-[30%_60%_70%_40%/50%_60%_30%_60%] animate-blob"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-[#6e56cf]/30 to-[#3b4fd9]/30 backdrop-blur-md py-4 px-6 flex items-center justify-between border-b border-[#9e8cfc]/20 relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/squink.svg"
              alt="Squink - the ink! mascot"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Freude, sans-serif' }}>
            <span className="text-[#6e56cf]">ink!</span><span className="text-[#e86bdf]">CTF</span>
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${level.difficulty === 'Beginner' ? 'bg-[#3b4fd9]/30 text-[#6b7eff]' : 
              level.difficulty === 'Intermediate' ? 'bg-[#e86bdf]/30 text-[#ff9ef5]' : 
              'bg-[#ff5757]/30 text-[#ff8a8a]'}
          `}>
            {level.difficulty}
          </span>
          <span className="bg-[#6e56cf]/30 px-2 py-1 rounded-full text-xs text-[#9e8cfc]">
            {level.category}
          </span>
          {levelCompleted && (
            <span className="flex items-center text-[#5eead4] text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Completed
            </span>
          )}
        </div>
      </header>

      {/* Level Navigation */}
      <div className="bg-[#2a1758]/50 py-2 px-6 flex items-center justify-between border-b border-[#9e8cfc]/10 relative z-10">
        <button 
          onClick={goToPreviousLevel}
          disabled={levelId === 1}
          className={`flex items-center gap-1 text-sm ${levelId === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-[#9e8cfc] hover:text-white'}`}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous Level
        </button>
        <h2 className="text-lg font-semibold" style={{ fontFamily: 'Freude, sans-serif' }}>
          Level {level.id}: {level.title}
        </h2>
        <button 
          onClick={goToNextLevel}
          className="flex items-center gap-1 text-sm text-[#9e8cfc] hover:text-white"
        >
          Next Level
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative z-10">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex space-x-1 border-b border-[#9e8cfc]/20 mb-6">
            <Tabs.Trigger 
              value="description"
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'description' ? 'border-[#e86bdf] text-white' : 'border-transparent text-[#9e8cfc] hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </div>
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="contract"
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'contract' ? 'border-[#e86bdf] text-white' : 'border-transparent text-[#9e8cfc] hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Contract
              </div>
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="console"
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'console' ? 'border-[#e86bdf] text-white' : 'border-transparent text-[#9e8cfc] hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Console
              </div>
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="description" className="focus:outline-none">
            <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/5 relative overflow-hidden">
              {/* Decorative blob in background */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#e86bdf]/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Freude, sans-serif' }}>
                  {level.title}
                </h3>
                <p className="text-[#9e8cfc] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {level.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Freude, sans-serif' }}>
                    Objectives
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-[#9e8cfc]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {level.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#6e56cf]/30 hover:bg-[#6e56cf]/40 rounded-full text-sm transition-colors"
                  >
                    <LightbulbIcon className="h-4 w-4" />
                    {showHints ? 'Hide Hints' : 'Show Hints'}
                  </button>

                  {levelCompleted ? (
                    <button
                      onClick={goToNextLevel}
                      className="flex items-center gap-2 px-4 py-2 bg-[#14b8a6]/30 hover:bg-[#14b8a6]/40 rounded-full text-sm transition-colors"
                    >
                      Next Challenge
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('console')}
                      className="flex items-center gap-2 px-4 py-2 bg-[#e86bdf]/30 hover:bg-[#e86bdf]/40 rounded-full text-sm transition-colors"
                    >
                      Start Hacking
                      <PlayCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Hints Section */}
                {showHints && (
                  <div className="mt-6 overflow-hidden transition-all duration-300 ease-in-out">
                    <div className="bg-[#6e56cf]/20 rounded-[2rem] p-4 border border-[#9e8cfc]/30">
                      <h4 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Freude, sans-serif' }}>
                        Hints
                      </h4>
                      <div className="space-y-3">
                        {level.hints.map((hint, index) => (
                          <div key={index} className="flex flex-col">
                            {revealedHints.includes(index) ? (
                              <p className="text-[#9e8cfc] text-sm p-2 bg-[#6e56cf]/20 rounded-xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {hint}
                              </p>
                            ) : (
                              <button
                                onClick={() => revealHint(index)}
                                className="text-left text-[#e86bdf] text-sm p-2 bg-[#6e56cf]/20 rounded-xl hover:bg-[#6e56cf]/30 transition-colors"
                              >
                                Reveal Hint #{index + 1}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="contract" className="focus:outline-none">
            <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/5 relative overflow-hidden">
              <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Freude, sans-serif' }}>
                Contract Source Code
              </h3>
              <div className="h-[600px] rounded-[1rem] overflow-hidden border border-[#9e8cfc]/30">
                <Editor
                  height="100%"
                  defaultLanguage="rust"
                  value={level.contractCode}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    fontFamily: 'Source Code Pro, monospace',
                  }}
                />
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="console" className="focus:outline-none">
            <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/5 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Code Editor */}
                <div className="flex flex-col h-[600px]">
                  <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Freude, sans-serif' }}>
                    Exploit Editor
                  </h3>
                  <div className="flex-grow rounded-[1rem] overflow-hidden border border-[#9e8cfc]/30">
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      value={userCode}
                      theme="vs-dark"
                      onChange={(value) => setUserCode(value || '')}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        fontFamily: 'Source Code Pro, monospace',
                      }}
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => setUserCode('')}
                      className="px-4 py-2 bg-[#2a1758]/70 hover:bg-[#2a1758] rounded-full text-sm transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={runUserCode}
                      className="px-4 py-2 bg-gradient-to-r from-[#6e56cf] to-[#e86bdf] hover:shadow-lg hover:shadow-[#e86bdf]/20 rounded-full text-sm transition-all flex items-center gap-2"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Run Exploit
                    </button>
                  </div>
                </div>

                {/* Console Output */}
                <div className="flex flex-col h-[600px]">
                  <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Freude, sans-serif' }}>
                    Console Output
                  </h3>
                  <div className="flex-grow bg-[#1a0b2e] rounded-[1rem] p-4 font-mono text-sm overflow-y-auto border border-[#9e8cfc]/30" style={{ fontFamily: 'Source Code Pro, monospace' }}>
                    {consoleOutput.map((output, index) => (
                      <div key={index} className={`mb-2 ${
                        output.type === 'error' ? 'text-[#ff5757]' : 
                        output.type === 'success' ? 'text-[#5eead4]' : 
                        output.type === 'command' ? 'text-[#ff9ef5]' : 
                        'text-[#9e8cfc]'
                      }`}>
                        {output.type === 'command' ? '> ' : ''}
                        {output.message}
                      </div>
                    ))}
                  </div>

                  {/* Blockchain State */}
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2" style={{ fontFamily: 'Freude, sans-serif' }}>
                      Blockchain State
                    </h4>
                    <div className="bg-[#1a0b2e] rounded-[1rem] p-3 text-xs font-mono grid grid-cols-2 gap-3 border border-[#9e8cfc]/30">
                      <div>
                        <div className="text-[#9e8cfc] mb-1">Player Balance:</div>
                        <div className="text-[#5eead4]">{blockchainState.accounts.player.balance} UNIT</div>
                      </div>
                      <div>
                        <div className="text-[#9e8cfc] mb-1">Contract Balance:</div>
                        <div className="text-[#6b7eff]">{blockchainState.contracts.contract.balance} UNIT</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </main>

      {/* Success Message */}
      {showSuccess && (
        <div 
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#14b8a6]/80 text-white px-6 py-3 rounded-full shadow-lg shadow-[#14b8a6]/30 backdrop-blur-sm flex items-center gap-3 transition-all duration-300 z-50"
          style={{ 
            animation: 'fadeInDown 0.5s ease-out forwards'
          }}
        >
          <CheckCircle className="h-5 w-5 text-white" />
          <span>Level completed successfully! Great job!</span>
        </div>
      )}

      {/* Failure Message */}
      {showFailure && (
        <div 
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#ff5757]/80 text-white px-6 py-3 rounded-full shadow-lg shadow-[#ff5757]/30 backdrop-blur-sm flex items-center gap-3 transition-all duration-300 z-50"
          style={{ 
            animation: 'fadeInDown 0.5s ease-out forwards'
          }}
        >
          <XCircle className="h-5 w-5 text-white" />
          <span>That didn't work. Try a different approach!</span>
        </div>
      )}

      {/* Need a Coffee Dialog */}
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="fixed bottom-4 right-4 bg-gradient-to-r from-[#6e56cf] to-[#e86bdf] hover:shadow-lg hover:shadow-[#e86bdf]/30 text-white rounded-full p-3 shadow-lg transition-all z-20">
            <Coffee className="h-5 w-5" />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-[#2a1758] to-[#1a0b2e] rounded-[2rem] p-6 w-full max-w-md shadow-xl border border-[#9e8cfc]/30 z-40">
            <Dialog.Title className="text-xl font-bold mb-2" style={{ fontFamily: 'Freude, sans-serif' }}>
              Need a hint?
            </Dialog.Title>
            <Dialog.Description className="text-[#9e8cfc] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Sometimes the best approach is to take a step back and think about the problem differently.
            </Dialog.Description>
            
            <div className="bg-[#1a0b2e] rounded-[1rem] p-4 mb-4 border border-[#9e8cfc]/30">
              <p className="text-[#9e8cfc] text-sm mb-2">Try these approaches:</p>
              <ul className="list-disc pl-5 space-y-1 text-[#9e8cfc] text-sm">
                <li>Read the contract code line by line</li>
                <li>Look for functions that change state</li>
                <li>Check for access control issues</li>
                <li>Think about unexpected inputs</li>
              </ul>
            </div>
            
            <div className="flex justify-end">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-gradient-to-r from-[#6e56cf] to-[#e86bdf] hover:shadow-lg hover:shadow-[#e86bdf]/20 rounded-full text-sm transition-all">
                  Got it
                </button>
              </Dialog.Close>
            </div>
            
            <Dialog.Close asChild>
              <button className="absolute top-3 right-3 text-[#9e8cfc] hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        @keyframes fadeOutUp {
          from {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        
        @keyframes wave-slow {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(10px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-blob {
          animation: blob 10s ease-in-out infinite;
        }
        
        .animate-wave-slow {
          animation: wave-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
