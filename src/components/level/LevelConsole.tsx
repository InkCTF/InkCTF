'use client';

import React from 'react';
import { LevelData, ConsoleMessage, BlockchainState } from '@/types/level';
import { Editor } from '@monaco-editor/react';
import * as Tabs from '@radix-ui/react-tabs';
import { PlayCircle, Terminal, Database, Trash2 } from 'lucide-react';

interface LevelConsoleProps {
  level: LevelData | null; // Added level prop for context if needed, though not directly used in this snippet
  userCode: string;
  setUserCode: (code: string) => void;
  consoleOutput: ConsoleMessage[];
  blockchainState: BlockchainState;
  onRunCode: () => void;
}

const LevelConsole: React.FC<LevelConsoleProps> = ({ 
  level,
  userCode, 
  setUserCode, 
  consoleOutput, 
  blockchainState, 
  onRunCode 
}) => {
  return (
    <Tabs.Content value="console" className="focus:outline-none">
      <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 md:p-8 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/10 relative overflow-hidden">
        {/* Decorative blob in background */}
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#e86bdf]/10 rounded-[70%_30%_60%_40%/40%_70%_30%_60%] animate-blob opacity-70"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 relative z-10">
          {/* Code Editor Section */}
          <div className="flex flex-col h-[600px] md:h-[700px]">
            <div className="flex items-center mb-4">
              <PlayCircle className="h-7 w-7 text-[#e86bdf] mr-3" />
              <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Freude, sans-serif' }}>
                Exploit Editor
              </h3>
            </div>
            <p className="text-[#c5bfff] mt-10 text-sm mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Write your JavaScript code here to interact with the contract and exploit the vulnerability.
            </p>
            <div 
              className="flex-grow rounded-[1.5rem] overflow-hidden border-2 border-[#6e56cf]/30 shadow-2xl shadow-[#6e56cf]/20"
              style={{ background: '#1e1e1e' }}
            >
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
                  wordWrap: 'on',
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  scrollbar: {
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                  },
                }}
              />
            </div>
            <div className="mt-4 flex justify-between items-center gap-3">
              <button
                onClick={() => setUserCode('')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#2a1758]/70 hover:bg-[#2a1758]/90 rounded-full text-sm font-medium text-white transition-all duration-200 hover:shadow-md active:scale-95"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
              <button
                onClick={onRunCode}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6e56cf] to-[#e86bdf] hover:shadow-xl hover:shadow-[#e86bdf]/30 rounded-full text-sm font-medium text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <PlayCircle className="h-5 w-5" />
                Run Exploit
              </button>
            </div>
          </div>

          {/* Console Output & Blockchain State Section */}
          <div className="flex flex-col h-[600px] md:h-[700px] gap-6 md:gap-8 mt-20">
            {/* Console Output */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center mb-4">
                <Terminal className="h-7 w-7 text-[#5eead4] mr-3" />
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Freude, sans-serif' }}>
                  Console Output
                </h3>
              </div>
              <div 
                className="flex-grow bg-[#1a0b2e]/70 rounded-[1.5rem] p-4 font-mono text-sm overflow-y-auto border-2 border-[#6e56cf]/30 shadow-inner shadow-[#1a0b2e]/50" 
                style={{ fontFamily: 'Source Code Pro, monospace' }}
              >
                {consoleOutput.map((output, index) => (
                  <div 
                    key={index} 
                    className={`mb-1.5 break-words ${
                      output.type === 'error' ? 'text-[#ff8a8a]' : 
                      output.type === 'success' ? 'text-[#5eead4]' : 
                      output.type === 'command' ? 'text-[#ffc4f7]' : 
                      'text-[#c5bfff]'
                    }`}
                  >
                    <span className="mr-1">{output.type === 'command' ? '$' : output.type === 'error' ? '✖' : output.type === 'success' ? '✔' : 'ℹ'}</span>
                    <span>{output.message}</span>
                  </div>
                ))}
                 <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} /> {/* Auto-scroll to bottom */}
              </div>
            </div>

            {/* Blockchain State */}
            <div className="flex-shrink-0">
              <div className="flex items-center mb-3">
                <Database className="h-6 w-6 text-[#6b7eff] mr-3" />
                <h4 className="text-xl font-semibold text-white" style={{ fontFamily: 'Freude, sans-serif' }}>
                  Blockchain State
                </h4>
              </div>
              <div className="bg-[#1a0b2e]/70 rounded-[1.5rem] p-4 text-xs font-mono grid grid-cols-1 sm:grid-cols-2 gap-4 border-2 border-[#6e56cf]/30 shadow-inner shadow-[#1a0b2e]/50" style={{ fontFamily: 'Source Code Pro, monospace' }}>
                <div>
                  <div className="text-[#9e8cfc] mb-1 uppercase tracking-wider">Player Balance:</div>
                  <div className="text-[#5eead4] text-sm font-bold">{blockchainState.accounts.player?.balance || 0} UNIT</div>
                </div>
                <div>
                  <div className="text-[#9e8cfc] mb-1 uppercase tracking-wider">Contract Balance:</div>
                  <div className="text-[#8a9cff] text-sm font-bold">{blockchainState.contracts.contract?.balance || 0} UNIT</div>
                </div>
                {/* You can add more state variables here if needed */}
                {Object.entries(blockchainState.contracts.contract?.storage || {}).map(([key, value]) => (
                  <div key={key} className="sm:col-span-2">
                    <div className="text-[#9e8cfc] mb-1 uppercase tracking-wider">Storage: {key}</div>
                    <div className="text-white text-sm break-all">{JSON.stringify(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Tabs.Content>
  );
};

export default LevelConsole;
