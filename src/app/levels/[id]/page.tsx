'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Coffee, Terminal, Code, FileText, BookOpen,LightbulbIcon } from 'lucide-react';

import { LevelData, BlockchainState, ConsoleMessage} from '@/types/level';
import { UserStats, Achievement } from '@/types/achievements';

import { levelsData } from '@/data/levels';
import { achievements as allAchievementsData } from '@/data/achievements';

import LevelHeader from '@/components/level/LevelHeader';
import LevelNavigation from '@/components/level/LevelNavigation';
import LevelDescription from '@/components/level/LevelDescription';
import LevelContract from '@/components/level/LevelContract';
import LevelConsole from '@/components/level/LevelConsole';
import LevelWalkthrough from '@/components/level/LevelWalkthrough';
import AchievementDialog from '@/components/level/AchievementDialog';
import SuccessNotification from '@/components/level/SuccessNotification';
import FailureNotification from '@/components/level/FailureNotification';

// Simple Notification for New Achievements for now
interface NewAchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const NewAchievementNotification: React.FC<NewAchievementNotificationProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div 
      className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#e86bdf]/90 to-[#ff9ef5]/90 backdrop-blur-md text-white px-6 py-3.5 rounded-full shadow-2xl shadow-[#e86bdf]/40 flex items-center gap-3 z-50 animate-fadeInDown"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {React.cloneElement(achievement.icon as React.ReactElement, { className: "h-6 w-6 text-white flex-shrink-0" })}
      <span className="text-sm font-medium">Achievement Unlocked: {achievement.name}!</span>
      <button onClick={onClose} className="ml-auto -mr-1 p-1 rounded-full hover:bg-white/20">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};


export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const levelId = parseInt(params.id as string);

  const [level, setLevel] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [consoleOutput, setConsoleOutput] = useState<ConsoleMessage[]>([]);
  const [userCode, setUserCode] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [blockchainState, setBlockchainState] = useState<BlockchainState>({
    accounts: { 'player': { balance: 1000 } },
    contracts: { 'contract': { storage: {}, balance: 100 } }
  });
  const [userStats, setUserStats] = useState<UserStats>({
    completedLevels: [],
    completedWithoutHints: [],
    speedCompletions: [],
    unlockedAchievements: [],
    levelStartTimes: {}
  });
  const [showAchievements, setShowAchievements] = useState(false);
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);
  const [showCoffeeDialog, setShowCoffeeDialog] = useState(false);

  const handleLevelComplete = useCallback(() => {
    if (!levelCompleted && level) {
      setLevelCompleted(true);
      setShowSuccess(true);

      const updatedStats = { ...userStats };
      if (!updatedStats.completedLevels.includes(levelId)) {
        updatedStats.completedLevels.push(levelId);
      }
      if (revealedHints.length === 0 && !updatedStats.completedWithoutHints.includes(levelId)) {
        updatedStats.completedWithoutHints.push(levelId);
      }
      const startTime = updatedStats.levelStartTimes[levelId] || 0;
      const completionTime = Date.now() - startTime;
      if (completionTime < 120000 && !updatedStats.speedCompletions.includes(levelId)) { // 2 minutes
        updatedStats.speedCompletions.push(levelId);
      }

      let firstNewAchievement: Achievement | null = null;
      allAchievementsData.forEach(ach => {
        if (!updatedStats.unlockedAchievements.includes(ach.id) && ach.condition(updatedStats)) {
          updatedStats.unlockedAchievements.push(ach.id);
          if (!firstNewAchievement) {
            firstNewAchievement = ach;
          }
        }
      });
      
      setUserStats(updatedStats);
      localStorage.setItem('userStats', JSON.stringify(updatedStats));

      if (firstNewAchievement) {
        setNewlyUnlockedAchievement(firstNewAchievement);
      }
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [levelCompleted, levelId, userStats, revealedHints, level]);

  const runUserCode = useCallback(() => {
    setConsoleOutput(prev => [...prev, { type: 'command', message: userCode }]);
    if (!level) return;

    const userPattern = userCode.replace(/\s+/g, '').toLowerCase();
    let success = false;

    // Level-specific solution checks
    switch (level.id) {
      case 1:
        if (userPattern.includes('claim_victory()')) success = true;
        break;
      case 2:
        if (userPattern.includes('contribute({value:1})') && userPattern.includes('sendtransaction({value:1') && userPattern.includes('withdraw()')) {
          success = true;
          setBlockchainState(prev => ({
            ...prev,
            accounts: { ...prev.accounts, player: { balance: prev.accounts.player.balance + prev.contracts.contract.balance } },
            contracts: { ...prev.contracts, contract: { ...prev.contracts.contract, balance: 0 } }
          }));
        }
        break;
      case 3:
        if (userPattern.includes('attacker.attack()') || (userPattern.includes('blockhash') && userPattern.includes('factor') && userPattern.includes('flip('))) {
             success = true; // Simplified for console simulation
        }
        break;
      case 4:
        if (userPattern.includes('attacker.attack({value:1})') || (userPattern.includes('deposit({value:') && userPattern.includes('withdraw()') && (userPattern.includes('fallback()') || userPattern.includes('receive()')))) {
            success = true;
            setBlockchainState(prev => ({
                ...prev,
                accounts: { ...prev.accounts, player: { balance: prev.accounts.player.balance + prev.contracts.contract.balance } },
                contracts: { ...prev.contracts, contract: { ...prev.contracts.contract, balance: 0 } }
            }));
        }
        break;
      case 5:
        if (userPattern.includes('contract.initialize()') && userPattern.includes('contract.set_value_at_index(0') ) { // Highly simplified for now
            success = true;
        }
        break;
      case 6:
        if (userPattern.includes('trustedcontract.get_owner()') && userPattern.includes('vulnerablecontract.call_trusted_contract_get_secret(owneroftrustedcontract)')) {
            success = true;
        }
        break;
      default:
        setConsoleOutput(prev => [...prev, { type: 'error', message: 'Solution check not implemented for this level.' }]);
        break;
    }

    if (success) {
      handleLevelComplete();
      setConsoleOutput(prev => [...prev, { type: 'success', message: `Exploit successful for Level ${level.id}! Level completed!` }]);
    } else {
      setConsoleOutput(prev => [...prev, { type: 'error', message: 'That didn\'t work. Try a different approach.' }]);
      setShowFailure(true);
      setTimeout(() => setShowFailure(false), 3000);
    }
  }, [userCode, level, handleLevelComplete]);

  useEffect(() => {
    if (isNaN(levelId)) {
      router.push('/');
      return;
    }
    const currentLevelData = levelsData.find(l => l.id === levelId);
    if (!currentLevelData) {
      router.push('/404');
      return;
    }
    setLevel(currentLevelData);
    setLoading(false);
    setActiveTab('description');
    setUserCode(`// Level ${levelId}: ${currentLevelData.title}\n// Interact with the contract to solve the challenge\n// Example: contract.someFunction()\n\n`);
    setConsoleOutput([
      { type: 'info', message: `Welcome to Level ${levelId}: ${currentLevelData.title}` },
      { type: 'info', message: 'Use the console to interact with the contract. Good luck!' }
    ]);
    setShowHints(false);
    
    const savedStatsRaw = localStorage.getItem('userStats');
    let loadedStats: UserStats;
    if (savedStatsRaw) {
      loadedStats = JSON.parse(savedStatsRaw);
    } else {
      loadedStats = { completedLevels: [], completedWithoutHints: [], speedCompletions: [], unlockedAchievements: [], levelStartTimes: {} };
    }
    
    setLevelCompleted(loadedStats.completedLevels.includes(levelId));
    const savedRevealedHints = localStorage.getItem(`levelHints_${levelId}`);
    setRevealedHints(savedRevealedHints ? JSON.parse(savedRevealedHints) : []);

    if (!loadedStats.levelStartTimes[levelId]) {
      loadedStats.levelStartTimes[levelId] = Date.now();
    }
    setUserStats(loadedStats);
    if (!savedStatsRaw) { 
        localStorage.setItem('userStats', JSON.stringify(loadedStats));
    }


  }, [levelId, router]);

  const revealHint = (index: number) => {
    if (!revealedHints.includes(index)) {
      const newRevealedHints = [...revealedHints, index];
      setRevealedHints(newRevealedHints);
      localStorage.setItem(`levelHints_${levelId}`, JSON.stringify(newRevealedHints));
    }
  };

  const goToPreviousLevel = () => levelId > 1 && router.push(`/levels/${levelId - 1}`);
  const goToNextLevel = () => levelId < levelsData.length ? router.push(`/levels/${levelId + 1}`) : router.push('/');

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
      {/* Decorative elements from original design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* <svg className="absolute left-0 top-1/4 w-32 h-96 text-[#9e8cfc] opacity-20" viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,150 Q30,100 10,50 Q-10,0 30,0" stroke="currentColor" strokeWidth="8" fill="none" className="animate-wave-slow" /><path d="M10,300 Q40,250 20,200 Q0,150 40,100" stroke="currentColor" strokeWidth="6" fill="none" className="animate-wave-slow" /></svg>
        <svg className="absolute right-0 top-1/3 w-32 h-96 text-[#e86bdf] opacity-20" viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100,100 Q70,150 90,200 Q110,250 70,300" stroke="currentColor" strokeWidth="8" fill="none" className="animate-wave-slow" /><path d="M90,50 Q60,100 80,150 Q100,200 60,250" stroke="currentColor" strokeWidth="6" fill="none" className="animate-wave-slow" /></svg> */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#6e56cf]/5 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#e86bdf]/5 rounded-[30%_60%_70%_40%/50%_60%_30%_60%] animate-blob"></div>
      </div>

      <LevelHeader
        level={level}
        levelCompleted={levelCompleted}
        userStats={userStats}
        onShowAchievements={() => setShowAchievements(true)}
      />
      <LevelNavigation
        currentLevelId={levelId}
        levelTitle={level.title}
        totalLevels={levelsData.length}
        onNavigate={(path) => router.push(path)}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative z-10">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="focus:outline-none">
          <Tabs.List className="flex flex-wrap space-x-1 border-b border-[#9e8cfc]/20 mb-6">
            <Tabs.Trigger value="description" className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'description' ? 'border-[#e86bdf] text-white' : 'border-transparent text-[#9e8cfc] hover:text-gray-300'} flex items-center gap-2`}><FileText className="h-4 w-4" />Description</Tabs.Trigger>
            <Tabs.Trigger value="contract" className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'contract' ? 'border-[#e86bdf] text-white' : 'border-transparent text-[#9e8cfc] hover:text-gray-300'} flex items-center gap-2`}><Code className="h-4 w-4" />Contract</Tabs.Trigger>
            <Tabs.Trigger value="console" className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'console' ? 'border-[#e86bdf] text-white' : 'border-transparent text-[#9e8cfc] hover:text-gray-300'} flex items-center gap-2`}><Terminal className="h-4 w-4" />Console</Tabs.Trigger>
            <Tabs.Trigger value="walkthrough" className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'walkthrough' ? 'border-[#e86bdf] text-white' : 'border-transparent text-[#9e8cfc] hover:text-gray-300'} flex items-center gap-2`}><BookOpen className="h-4 w-4" />Walkthrough</Tabs.Trigger>
          </Tabs.List>

          <LevelDescription
            level={level}
            showHints={showHints}
            setShowHints={setShowHints}
            revealedHints={revealedHints}
            onRevealHint={revealHint}
            levelCompleted={levelCompleted}
            onStartHacking={() => setActiveTab('console')}
            onNextLevel={goToNextLevel}
          />
          <LevelContract level={level} />
          <LevelConsole
            level={level}
            userCode={userCode}
            setUserCode={setUserCode}
            consoleOutput={consoleOutput}
            blockchainState={blockchainState}
            onRunCode={runUserCode}
          />
          <LevelWalkthrough level={level} />
        </Tabs.Root>
      </main>

      <SuccessNotification show={showSuccess} />
      <FailureNotification show={showFailure} />
      <NewAchievementNotification achievement={newlyUnlockedAchievement} onClose={() => setNewlyUnlockedAchievement(null)} />
      
      <AchievementDialog
        show={showAchievements}
        onClose={() => setShowAchievements(false)}
        userStats={userStats}
        allAchievements={allAchievementsData}
      />

      <Dialog.Root open={showCoffeeDialog} onOpenChange={setShowCoffeeDialog}>
        <Dialog.Trigger asChild>
          <button 
            onClick={() => setShowCoffeeDialog(true)}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-[#6e56cf] to-[#e86bdf] hover:shadow-lg hover:shadow-[#e86bdf]/30 text-white rounded-full p-3 shadow-lg transition-all z-20 animate-float-slow"
            title="Need a break or a hint?"
          >
            <Coffee className="h-5 w-5" />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fadeIn" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-[#2a1758] to-[#1a0b2e] rounded-[2rem] p-6 md:p-8 w-[90vw] max-w-md shadow-2xl shadow-[#6e56cf]/30 border-2 border-[#9e8cfc]/30 z-50 animate-scaleUp" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <Dialog.Title className="text-2xl font-bold mb-3 text-white" style={{ fontFamily: 'Freude, sans-serif' }}>Stuck? Take a Sip!</Dialog.Title>
            <Dialog.Description className="text-[#c5bfff] mb-6 text-sm leading-relaxed">
              Cybersecurity can be challenging! If you're feeling stuck, remember:
            </Dialog.Description>
            <div className="bg-[#1a0b2e]/50 rounded-[1.5rem] p-4 mb-6 border border-[#9e8cfc]/20 space-y-3">
              <p className="flex items-start text-sm text-[#c5bfff]"><LightbulbIcon className="h-5 w-5 text-[#e86bdf] mr-2 mt-0.5 flex-shrink-0" /><span>Re-read the contract carefully. Details matter!</span></p>
              <p className="flex items-start text-sm text-[#c5bfff]"><BookOpen className="h-5 w-5 text-[#e86bdf] mr-2 mt-0.5 flex-shrink-0" /><span>Check the "Hints" or "Walkthrough" tabs.</span></p>
              <p className="flex items-start text-sm text-[#c5bfff]"><Coffee className="h-5 w-5 text-[#e86bdf] mr-2 mt-0.5 flex-shrink-0" /><span>Take a short break. Fresh eyes find new bugs!</span></p>
            </div>
            <div className="flex justify-end">
              <Dialog.Close asChild>
                <button className="px-5 py-2.5 bg-gradient-to-r from-[#6e56cf] to-[#e86bdf] hover:shadow-lg hover:shadow-[#e86bdf]/30 rounded-full text-sm font-medium text-white transition-all duration-300 transform hover:scale-105 active:scale-95">
                  Keep Hacking!
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 p-2 rounded-full text-[#9e8cfc] hover:text-white hover:bg-[#6e56cf]/30 transition-colors" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Global styles for animations, if not already in globals.css */}
      <style jsx global>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translate(-50%, -30px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fadeInDown { animation: fadeInDown 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes scaleUp { from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        .animate-scaleUp { animation: scaleUp 0.3s ease-out forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float-slow { animation: float 8s ease-in-out infinite; }
        @keyframes wave-slow { 0%, 100% { transform: translateX(0) rotate(0deg); } 50% { transform: translateX(5px) rotate(2deg); } }
        .animate-wave-slow { animation: wave-slow 10s ease-in-out infinite alternate; }
        @keyframes blob { 0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(0deg) scale(1); } 33% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: rotate(5deg) scale(1.05); } 66% { border-radius: 70% 30% 50% 50% / 40% 70% 30% 70%; transform: rotate(-5deg) scale(0.95); } }
        .animate-blob { animation: blob 15s ease-in-out infinite alternate; }
      `}</style>
    </div>
  );
}
