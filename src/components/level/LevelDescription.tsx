'use client';

import React from 'react';
import { LevelData } from '@/types/level';
import { LightbulbIcon, PlayCircle, ChevronRight, FileText } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';

interface LevelDescriptionProps {
  level: LevelData | null;
  showHints: boolean;
  setShowHints: (show: boolean) => void;
  revealedHints: number[];
  onRevealHint: (index: number) => void;
  levelCompleted: boolean;
  onStartHacking: () => void;
  onNextLevel: () => void;
}

const LevelDescription: React.FC<LevelDescriptionProps> = ({
  level,
  showHints,
  setShowHints,
  revealedHints,
  onRevealHint,
  levelCompleted,
  onStartHacking,
  onNextLevel,
}) => {
  if (!level) {
    return (
      <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/5">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>
          <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        </div>
      </div>
    );
  }

  return (
    <Tabs.Content value="description" className="focus:outline-none">
      <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 md:p-8 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/10 relative overflow-hidden">
        {/* Decorative blob in background */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#e86bdf]/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob opacity-70"></div>
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#6e56cf]/10 rounded-[30%_70%_40%_60%/70%_40%_60%_30%] animate-blob opacity-70"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-[#e86bdf] mr-3" />
            <h3 className="text-3xl font-bold text-white" style={{ fontFamily: 'Freude, sans-serif' }}>
              {level.title}
            </h3>
          </div>
          <p className="text-[#c5bfff] mb-6 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {level.description}
          </p>

          <div className="mb-8 p-4 bg-[#1a0b2e]/30 rounded-[1.5rem] border border-[#9e8cfc]/20">
            <h4 className="text-xl font-semibold mb-3 text-[#ffc4f7]" style={{ fontFamily: 'Freude, sans-serif' }}>
              Objectives
            </h4>
            <ul className="list-none pl-0 space-y-2 text-[#c5bfff]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {level.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-[#e86bdf] mr-2 mt-0.5 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#6e56cf]/40 hover:bg-[#6e56cf]/60 rounded-full text-sm font-medium text-white transition-all duration-200 hover:shadow-md hover:shadow-[#6e56cf]/30 active:scale-95 w-full sm:w-auto justify-center"
            >
              <LightbulbIcon className="h-4 w-4 text-[#ffc4f7]" />
              {showHints ? 'Hide Hints' : `Show Hints (${level.hints.length})`}
            </button>

            {levelCompleted ? (
              <button
                onClick={onNextLevel}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#14b8a6]/50 hover:bg-[#14b8a6]/70 rounded-full text-sm font-medium text-white transition-all duration-200 hover:shadow-md hover:shadow-[#14b8a6]/30 active:scale-95 w-full sm:w-auto justify-center"
              >
                Next Challenge
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={onStartHacking}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#e86bdf]/50 hover:bg-[#e86bdf]/70 rounded-full text-sm font-medium text-white transition-all duration-200 hover:shadow-md hover:shadow-[#e86bdf]/30 active:scale-95 w-full sm:w-auto justify-center"
              >
                Start Hacking
                <PlayCircle className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Hints Section */}
          {showHints && (
            <div className="mt-6 overflow-hidden transition-all duration-500 ease-in-out">
              <div className="bg-[#1a0b2e]/40 rounded-[1.5rem] p-4 md:p-6 border border-[#9e8cfc]/20">
                <h4 className="text-xl font-semibold mb-3 text-[#ffc4f7]" style={{ fontFamily: 'Freude, sans-serif' }}>
                  Hints
                </h4>
                <div className="space-y-3">
                  {level.hints.map((hint, index) => (
                    <div key={index} className="flex flex-col">
                      {revealedHints.includes(index) ? (
                        <p className="text-[#c5bfff] text-sm p-3 bg-[#6e56cf]/20 rounded-xl shadow-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {hint}
                        </p>
                      ) : (
                        <button
                          onClick={() => onRevealHint(index)}
                          className="text-left text-[#e86bdf] hover:text-white text-sm p-3 bg-[#6e56cf]/20 hover:bg-[#6e56cf]/30 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md active:scale-95"
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
  );
};

export default LevelDescription;
