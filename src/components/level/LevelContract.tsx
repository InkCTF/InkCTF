'use client';

import React from 'react';
import { LevelData } from '@/types/level';
import { Editor } from '@monaco-editor/react';
import * as Tabs from '@radix-ui/react-tabs';
import { Code } from 'lucide-react';

interface LevelContractProps {
  level: LevelData | null;
}

const LevelContract: React.FC<LevelContractProps> = ({ level }) => {
  if (!level) {
    return (
      <Tabs.Content value="contract" className="focus:outline-none">
        <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 md:p-8 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-6"></div>
            <div className="h-[600px] bg-gray-700/50 rounded-[1rem]"></div>
          </div>
        </div>
      </Tabs.Content>
    );
  }

  return (
    <Tabs.Content value="contract" className="focus:outline-none">
      <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 md:p-8 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/10 relative overflow-hidden">
        {/* Decorative blob in background */}
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-[#6e56cf]/10 rounded-[40%_60%_70%_30%/50%_30%_60%_70%] animate-blob opacity-70"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <Code className="h-8 w-8 text-[#6b7eff] mr-3" />
            <h3 className="text-3xl font-bold text-white" style={{ fontFamily: 'Freude, sans-serif' }}>
              Contract Source Code
            </h3>
          </div>
          <p className="text-[#c5bfff] mb-6 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Review the ink! smart contract code below to understand its functionality and identify potential vulnerabilities.
          </p>
          <div 
            className="h-[600px] md:h-[700px] rounded-[1.5rem] overflow-hidden border-2 border-[#6e56cf]/30 shadow-2xl shadow-[#6e56cf]/20"
            style={{ background: '#1e1e1e' /* VS Dark background */ }}
          >
            <Editor
              height="100%"
              defaultLanguage="rust"
              value={level.contractCode}
              theme="vs-dark" // Standard dark theme for Monaco
              options={{
                readOnly: true,
                minimap: { enabled: true, side: 'right', scale: 1 },
                scrollBeyondLastLine: false,
                fontSize: 14,
                fontFamily: 'Source Code Pro, monospace',
                wordWrap: 'on', // Enable word wrapping
                automaticLayout: true, // Ensure editor resizes correctly
                scrollbar: {
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                  vertical: 'auto',
                  horizontal: 'auto'
                },
                padding: {
                  top: 16,
                  bottom: 16
                },
                glyphMargin: true,
                folding: true,
                lineNumbers: 'on',
                renderLineHighlight: 'gutter',
                occurrencesHighlight: 'off',
                selectionHighlight: false,
                // renderIndentGuides: true,
              }}
            />
          </div>
        </div>
      </div>
    </Tabs.Content>
  );
};

export default LevelContract;
