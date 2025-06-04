'use client';

import React, { useState } from 'react';
import { LevelData, WalkthroughStep } from '@/types/level';
import { Editor } from '@monaco-editor/react';
import * as Tabs from '@radix-ui/react-tabs';
import { BookOpen, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface LevelWalkthroughProps {
  level: LevelData | null;
}

const LevelWalkthrough: React.FC<LevelWalkthroughProps> = ({ level }) => {
  const [openStepIndex, setOpenStepIndex] = useState<number | null>(null);

  const toggleStep = (index: number) => {
    setOpenStepIndex(openStepIndex === index ? null : index);
  };

  if (!level) {
    return (
      <Tabs.Content value="walkthrough" className="focus:outline-none">
        <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 md:p-8 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mb-4">
                <div className="h-10 bg-gray-700/50 rounded-[1rem] mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      </Tabs.Content>
    );
  }

  return (
    <Tabs.Content value="walkthrough" className="focus:outline-none">
      <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 md:p-8 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/10 relative overflow-hidden">
        {/* Decorative blob in background */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#6e56cf]/10 rounded-[50%_50%_30%_70%/60%_40%_60%_40%] animate-blob opacity-70"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <BookOpen className="h-8 w-8 text-[#ffc4f7] mr-3" />
            <h3 className="text-3xl font-bold text-white" style={{ fontFamily: 'Freude, sans-serif' }}>
              Step-by-Step Walkthrough
            </h3>
          </div>
          
          <div className="mb-6 p-4 bg-[#ff5757]/20 rounded-[1.5rem] border-2 border-[#ff5757]/40 shadow-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-[#ff8a8a] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-[#ffc4f7]" style={{ fontFamily: 'Freude, sans-serif' }}>Spoiler Warning!</h4>
                <p className="text-[#ffc4f7]/90 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  This section contains the complete solution to the level. We highly recommend trying to solve it on your own first for the best learning experience.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-[#c5bfff] mb-8 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            If you're stuck or want to understand the solution in detail, expand the steps below. Each step breaks down the process of identifying and exploiting the vulnerability.
          </p>

          <div className="space-y-4">
            {level.walkthrough.map((step, index) => (
              <div key={index} className="bg-[#1a0b2e]/50 rounded-[1.5rem] overflow-hidden border border-[#9e8cfc]/30 shadow-lg">
                <button
                  onClick={() => toggleStep(index)}
                  className="w-full flex justify-between items-center p-4 md:p-5 text-left hover:bg-[#6e56cf]/20 transition-colors duration-200 focus:outline-none"
                >
                  <h4 className="text-xl font-semibold text-white" style={{ fontFamily: 'Freude, sans-serif' }}>
                    Step {index + 1}: {step.title}
                  </h4>
                  {openStepIndex === index ? (
                    <ChevronUp className="h-6 w-6 text-[#e86bdf]" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-[#e86bdf]" />
                  )}
                </button>

                {openStepIndex === index && (
                  <div className="p-4 md:p-6 border-t border-[#9e8cfc]/20 bg-[#1a0b2e]/30">
                    <p className="text-[#c5bfff] mb-4 leading-relaxed whitespace-pre-line" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {step.content}
                    </p>
                    {step.code && (
                      <div className="mt-4">
                        <h5 className="text-sm font-semibold text-[#ffc4f7] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Relevant Code:
                        </h5>
                        <div 
                          className="rounded-[1rem] overflow-hidden border border-[#6e56cf]/30 shadow-md"
                          style={{ background: '#1e1e1e' }}
                        >
                          <Editor
                            height={step.code.split('\n').length * 20 + 40 > 400 ? '400px' : `${step.code.split('\n').length * 20 + 40}px`} // Adjust height based on lines, max 400px
                            defaultLanguage={step.title.toLowerCase().includes("attacker contract") ? "rust" : "rust"} // Default to rust, can be dynamic
                            value={step.code}
                            theme="vs-dark"
                            options={{
                              readOnly: true,
                              minimap: { enabled: false },
                              scrollBeyondLastLine: false,
                              fontSize: 13,
                              fontFamily: 'Source Code Pro, monospace',
                              wordWrap: 'on',
                              automaticLayout: true,
                              padding: { top: 10, bottom: 10 },
                              scrollbar: {
                                verticalScrollbarSize: 8,
                                horizontalScrollbarSize: 8,
                              },
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Tabs.Content>
  );
};

export default LevelWalkthrough;
