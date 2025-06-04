'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Award, Lock } from 'lucide-react';
import { Achievement, UserStats } from '@/types/achievements';

interface AchievementDialogProps {
  show: boolean;
  onClose: () => void;
  userStats: UserStats;
  allAchievements: Achievement[]; // Pass all possible achievements
}

const AchievementDialog: React.FC<AchievementDialogProps> = ({ 
  show, 
  onClose, 
  userStats,
  allAchievements
}) => {
  const unlockedAchievements = allAchievements.filter(ach => userStats.unlockedAchievements.includes(ach.id));
  const lockedAchievements = allAchievements.filter(ach => !userStats.unlockedAchievements.includes(ach.id));

  return (
    <Dialog.Root open={show} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fadeIn" />
        <Dialog.Content 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            bg-gradient-to-br from-[#2a1758] to-[#1a0b2e] 
            rounded-[2rem] p-6 md:p-8 w-[90vw] max-w-2xl max-h-[85vh]
            shadow-2xl shadow-[#6e56cf]/30 border-2 border-[#9e8cfc]/30 
            z-50 flex flex-col animate-scaleUp"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-3xl font-bold text-white" style={{ fontFamily: 'Freude, sans-serif' }}>
              <span className="text-[#e86bdf]">Your</span> Achievements
            </Dialog.Title>
            <Dialog.Close asChild>
              <button 
                className="p-2 rounded-full text-[#9e8cfc] hover:text-white hover:bg-[#6e56cf]/30 transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </Dialog.Close>
          </div>

          <div className="overflow-y-auto flex-grow pr-2 space-y-8 custom-scrollbar">
            {/* Unlocked Achievements Section */}
            {unlockedAchievements.length > 0 && (
              <section>
                <h3 className="text-2xl font-semibold text-[#5eead4] mb-4 pb-2 border-b-2 border-[#5eead4]/30" style={{ fontFamily: 'Freude, sans-serif' }}>
                  Unlocked ({unlockedAchievements.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {unlockedAchievements.map((ach) => (
                    <div 
                      key={ach.id} 
                      className="bg-gradient-to-br from-[#6e56cf]/30 to-[#3b4fd9]/30 p-4 rounded-[1.5rem] border border-[#9e8cfc]/20 shadow-lg flex items-start gap-4 transition-all hover:shadow-[#6e56cf]/40 hover:scale-[1.02]"
                    >
                      <div className="flex-shrink-0 mt-1 text-[#ffc4f7] opacity-100">
                        {React.cloneElement(ach.icon as React.ReactElement, { className: "h-8 w-8" })}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg">{ach.name}</h4>
                        <p className="text-sm text-[#c5bfff]">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Locked Achievements Section */}
            {lockedAchievements.length > 0 && (
              <section>
                <h3 className="text-2xl font-semibold text-gray-500 mb-4 pb-2 border-b-2 border-gray-700/50" style={{ fontFamily: 'Freude, sans-serif' }}>
                  Locked ({lockedAchievements.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {lockedAchievements.map((ach) => (
                    <div 
                      key={ach.id} 
                      className="bg-[#1a0b2e]/50 p-4 rounded-[1.5rem] border border-[#6e56cf]/10 shadow-md flex items-start gap-4 opacity-60"
                    >
                      <div className="flex-shrink-0 mt-1 text-gray-600">
                         {React.isValidElement(ach.icon) ? React.cloneElement(ach.icon, { className: "h-8 w-8 text-gray-600" }) : <Lock className="h-8 w-8 text-gray-600" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-400 text-lg">{ach.name}</h4>
                        <p className="text-sm text-gray-500">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
             {unlockedAchievements.length === 0 && lockedAchievements.length === 0 && (
                <p className="text-center text-gray-400 py-10">No achievements defined yet.</p>
            )}
          </div>
          
          <div className="mt-8 flex justify-end">
            <Dialog.Close asChild>
              <button className="px-6 py-2.5 bg-gradient-to-r from-[#6e56cf] to-[#e86bdf] hover:shadow-lg hover:shadow-[#e86bdf]/30 rounded-full text-sm font-medium text-white transition-all duration-300 transform hover:scale-105 active:scale-95">
                Close
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .animate-scaleUp {
          animation: scaleUp 0.3s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a0b2e/50;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6e56cf;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e86bdf;
        }
      `}</style>
    </Dialog.Root>
  );
};

export default AchievementDialog;
