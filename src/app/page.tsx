'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Mock data for levels
const levels = [
  {
    id: 1,
    title: 'Hello Squink!',
    description: 'Get started with your first ink! challenge.',
    difficulty: 'Beginner',
    completed: true,
    category: 'Introduction'
  },
  {
    id: 2,
    title: 'Fallback',
    description: 'Exploit a vulnerable fallback function.',
    difficulty: 'Beginner',
    completed: false,
    category: 'Access Control'
  },
  {
    id: 3,
    title: 'Coin Flip',
    description: 'Predict the outcome of a random coin flip.',
    difficulty: 'Intermediate',
    completed: false,
    category: 'Randomness'
  },
  {
    id: 4,
    title: 'Reentrancy',
    description: 'Exploit a reentrancy vulnerability.',
    difficulty: 'Intermediate',
    completed: false,
    category: 'Reentrancy'
  },
  {
    id: 5,
    title: 'Storage Manipulation',
    description: 'Manipulate contract storage to gain unauthorized access.',
    difficulty: 'Advanced',
    completed: false,
    category: 'Storage'
  },
  {
    id: 6,
    title: 'Cross-Contract Attack',
    description: 'Exploit vulnerabilities in cross-contract calls.',
    difficulty: 'Advanced',
    completed: false,
    category: 'Cross-Contract'
  },
];

// Calculate progress
const completedLevels = levels.filter(level => level.completed).length;
const progressPercentage = (completedLevels / levels.length) * 100;

export default function Home() {
  const [bubbles, setBubbles] = useState<Array<{id: number, size: number, left: string, animationDuration: string, delay: string}>>([]);
  
  // Generate random bubbles on component mount
  useEffect(() => {
    const newBubbles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 30 + 10, // 10-40px
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 15}s`, // 15-25s
      delay: `${Math.random() * 10}s` // 0-10s delay
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden relative bg-gradient-to-b from-[#1a0b2e] via-[#2a1758] to-[#1a0b2e]">
      {/* Decorative underwater elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating bubbles */}
        {bubbles.map((bubble) => (
          <div 
            key={bubble.id}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm animate-float"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: bubble.left,
              bottom: '-5%',
              animationDuration: bubble.animationDuration,
              animationDelay: bubble.delay,
              opacity: 0.6
            }}
          />
        ))}
        
        {/* Left tentacle decoration */}
        <svg className="absolute left-0 top-1/4 w-32 h-96 text-[#9e8cfc] opacity-40" viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,150 Q30,100 10,50 Q-10,0 30,0" stroke="currentColor" strokeWidth="8" fill="none" className="animate-wave-slow" />
          <path d="M10,300 Q40,250 20,200 Q0,150 40,100" stroke="currentColor" strokeWidth="6" fill="none" className="animate-wave-slow" />
          <path d="M-10,250 Q20,200 0,150 Q-20,100 20,50" stroke="currentColor" strokeWidth="4" fill="none" className="animate-wave-slow" />
        </svg>
        
        {/* Right tentacle decoration */}
        <svg className="absolute right-0 top-1/3 w-32 h-96 text-[#e86bdf] opacity-40" viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100,100 Q70,150 90,200 Q110,250 70,300" stroke="currentColor" strokeWidth="8" fill="none" className="animate-wave-slow" />
          <path d="M90,50 Q60,100 80,150 Q100,200 60,250" stroke="currentColor" strokeWidth="6" fill="none" className="animate-wave-slow" />
          <path d="M110,0 Q80,50 100,100 Q120,150 80,200" stroke="currentColor" strokeWidth="4" fill="none" className="animate-wave-slow" />
        </svg>
        
        {/* Seaweed decoration */}
        <svg className="absolute left-1/4 bottom-0 w-20 h-64 text-[#14b8a6] opacity-30" viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50,300 Q30,250 50,200 Q70,150 50,100 Q30,50 50,0" stroke="currentColor" strokeWidth="4" fill="none" className="animate-wave-slow" />
          <path d="M30,300 Q10,250 30,200 Q50,150 30,100 Q10,50 30,0" stroke="currentColor" strokeWidth="3" fill="none" className="animate-wave-slow" />
          <path d="M70,300 Q50,250 70,200 Q90,150 70,100 Q50,50 70,0" stroke="currentColor" strokeWidth="3" fill="none" className="animate-wave-slow" />
        </svg>
        
        <svg className="absolute right-1/4 bottom-0 w-20 h-64 text-[#14b8a6] opacity-30" viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50,300 Q30,250 50,200 Q70,150 50,100 Q30,50 50,0" stroke="currentColor" strokeWidth="4" fill="none" className="animate-wave-slow" />
          <path d="M30,300 Q10,250 30,200 Q50,150 30,100 Q10,50 30,0" stroke="currentColor" strokeWidth="3" fill="none" className="animate-wave-slow" />
          <path d="M70,300 Q50,250 70,200 Q90,150 70,100 Q50,50 70,0" stroke="currentColor" strokeWidth="3" fill="none" className="animate-wave-slow" />
        </svg>
        
        {/* Background coral shapes */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-[#2a1758] rounded-t-[100%] opacity-20"></div>
        <div className="absolute bottom-0 left-1/4 w-1/2 h-48 bg-[#3b4fd9] rounded-t-[100%] opacity-10"></div>
        <div className="absolute bottom-0 right-10 w-64 h-40 bg-[#e86bdf] rounded-t-[100%] opacity-10"></div>
      </div>

      {/* Hero Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Curved container for hero content */}
          <div className="relative bg-gradient-to-br from-[#6e56cf]/30 to-[#3b4fd9]/30 backdrop-blur-md rounded-[3rem] p-8 md:p-12 overflow-hidden border border-[#9e8cfc]/30">
            {/* Decorative blob in background */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#e86bdf]/20 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#6e56cf]/20 rounded-[30%_60%_70%_40%/50%_60%_30%_60%] animate-blob"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="flex-1">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Freude, sans-serif' }}>
                  <span className="text-[#6e56cf]">ink!</span><span className="text-[#e86bdf]">CTF</span>
                </h1>
                <p className="text-xl text-[#9e8cfc] mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Capture The Flag challenges for ink! smart contracts.
                  Learn about vulnerabilities by exploiting them in a safe environment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/levels/1" 
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium 
                      rounded-full text-white bg-gradient-to-r from-[#6e56cf] to-[#e86bdf] 
                      hover:shadow-lg hover:shadow-[#e86bdf]/30 transition-all duration-300 transform hover:scale-105"
                  >
                    Start Playing
                  </Link>
                  <Link 
                    href="/about" 
                    className="inline-flex items-center justify-center px-6 py-3 
                      border-2 border-[#9e8cfc]/50 text-base font-medium rounded-full text-white 
                      hover:bg-[#6e56cf]/20 transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 flex justify-center relative">
                {/* Squink with animation */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 animate-float">
                  <Image
                    src="/squink.svg"
                    alt="Squink - the ink! mascot"
                    fill
                    className="object-contain drop-shadow-[0_0_15px_rgba(110,86,207,0.5)]"
                    priority
                  />
                  
                  {/* Small decorative bubbles around Squink */}
                  <div className="absolute top-1/4 right-0 w-6 h-6 bg-white/20 rounded-full animate-float-slow"></div>
                  <div className="absolute bottom-1/4 left-0 w-4 h-4 bg-white/20 rounded-full animate-float-slow"></div>
                  <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-white/20 rounded-full animate-float-slow"></div>
                </div>
              </div>
            </div>
            
            {/* Polkadot branding */}
            <div className="absolute bottom-4 right-8">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">Powered by</span>
                <div className="relative w-24 h-8">
                  <Image
                    src="/polkadot-logo.svg"
                    alt="Polkadot"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-md rounded-[2rem] p-6 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/5 relative overflow-hidden">
          {/* Decorative blob */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#e86bdf]/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 relative z-10">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Freude, sans-serif' }}>Your Progress</h2>
            <div className="text-sm font-medium text-[#9e8cfc]">
              {completedLevels} of {levels.length} levels completed
            </div>
          </div>
          <div className="w-full h-4 bg-[#1a0b2e]/50 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-[#6e56cf] to-[#e86bdf] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
            {/* Decorative dots on progress bar */}
            {Array.from({ length: levels.length }).map((_, i) => (
              <div 
                key={i}
                className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${
                  i < completedLevels ? 'bg-white' : 'bg-white/30'
                }`}
                style={{ left: `calc(${(i / (levels.length - 1)) * 100}% - 6px)` }}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels Grid */}
      <section className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-white" style={{ fontFamily: 'Freude, sans-serif' }}>
          Challenge Levels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {levels.map((level, index) => (
            <div key={level.id} className="relative">
              {/* Decorative tentacle for some cards */}
              {index % 3 === 1 && (
                <svg className="absolute -top-8 -right-4 w-16 h-16 text-[#e86bdf] opacity-40 z-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M80,20 Q60,40 70,60 Q80,80 60,90" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              )}
              
              <Link href={`/levels/${level.id}`}>
                <div className={`
                  relative overflow-hidden rounded-[2rem] transition-all duration-300
                  ${level.completed ? 'bg-gradient-to-br from-[#14b8a6]/30 to-[#0f8c7e]/30' : 'bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20'}
                  hover:shadow-xl hover:shadow-[#6e56cf]/20 hover:scale-[1.03] cursor-pointer
                  border-2 ${level.completed ? 'border-[#5eead4]/30' : 'border-[#9e8cfc]/30'}
                  backdrop-blur-md animate-float-${index % 3}
                `}>
                  {/* Decorative blob in background */}
                  <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#e86bdf]/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob opacity-50"></div>
                  
                  <div className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Freude, sans-serif' }}>
                        {level.title}
                      </h3>
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${level.difficulty === 'Beginner' ? 'bg-[#3b4fd9]/30 text-[#6b7eff]' : 
                          level.difficulty === 'Intermediate' ? 'bg-[#e86bdf]/30 text-[#ff9ef5]' : 
                          'bg-[#ff5757]/30 text-[#ff8a8a]'}
                      `}>
                        {level.difficulty}
                      </span>
                    </div>
                    <p className="text-[#9e8cfc] mb-4">{level.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="bg-[#6e56cf]/30 px-2 py-1 rounded-full text-xs text-[#9e8cfc]">
                        {level.category}
                      </span>
                      {level.completed && (
                        <span className="flex items-center text-[#5eead4] text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Small floating bubble decorations */}
                  <div className="absolute top-2 right-8 w-3 h-3 bg-white/20 rounded-full animate-float-slow"></div>
                  <div className="absolute bottom-8 left-4 w-2 h-2 bg-white/20 rounded-full animate-float-slow"></div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Ocean floor decoration */}
      <div className="w-full h-40 relative z-0 mt-20">
        <svg className="w-full h-40 absolute bottom-0" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,0 C150,90 350,0 500,80 C650,160 750,40 900,100 C1050,160 1150,60 1200,80 L1200,120 L0,120 Z" 
            className="fill-[#2a1758]/30"
          ></path>
          <path 
            d="M0,40 C150,110 350,30 500,100 C650,170 750,60 900,120 L900,120 L0,120 Z" 
            className="fill-[#2a1758]/50"
          ></path>
        </svg>
        
        {/* Small sea creatures */}
        <div className="absolute bottom-10 left-1/4 w-8 h-4 bg-[#5eead4]/40 rounded-full animate-fish-swim">
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-4 h-3 bg-[#5eead4]/40 
            rounded-[0_100%_100%_0/50%]"></div>
        </div>
        <div className="absolute bottom-20 right-1/3 w-6 h-3 bg-[#ff9ef5]/40 rounded-full animate-fish-swim-reverse">
          <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-3 h-2 bg-[#ff9ef5]/40 
            rounded-[100%_0_0_100%/50%]"></div>
        </div>
      </div>

      {/* Polkadot Ecosystem Section */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 relative z-10 bg-gradient-to-b from-[#2a1758] to-[#1a0b2e]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Freude, sans-serif' }}>
            Part of the Polkadot Ecosystem
          </h2>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="relative w-40 h-16 animate-float-slow">
              <Image 
                src="/polkadot-logo.svg" 
                alt="Polkadot Logo" 
                fill
                className="object-contain drop-shadow-[0_0_10px_rgba(232,107,223,0.5)]"
              />
            </div>
            <div className="relative w-32 h-16 animate-float-slow-reverse">
              <Image 
                src="/ink-logo.svg" 
                alt="ink! Logo" 
                fill
                className="object-contain drop-shadow-[0_0_10px_rgba(110,86,207,0.5)]"
              />
            </div>
            <div className="relative w-40 h-16 animate-float-slow">
              <Image 
                src="/substrate-logo.svg" 
                alt="Substrate Logo" 
                fill
                className="object-contain drop-shadow-[0_0_10px_rgba(232,107,223,0.5)]"
              />
            </div>
          </div>
          <p className="mt-6 text-[#9e8cfc] max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Learn smart contract security while exploring the ink! ecosystem. 
            Powered by Substrate and Polkadot technology.
          </p>
        </div>
      </section>

      {/* Footer with ocean wave */}
      <footer className="w-full py-8 px-4 sm:px-6 lg:px-8 text-center text-[#9e8cfc] relative">
        <svg className="absolute bottom-full left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,0 C150,60 350,0 500,80 C650,160 750,40 900,100 C1050,160 1150,60 1200,80 L1200,120 L0,120 Z" 
            className="fill-[#1a0b2e]"
          ></path>
        </svg>
        
        <p style={{ fontFamily: 'Montserrat, sans-serif' }} className="relative z-10">
          Built with 💜 for the ink! community
        </p>
        
        {/* Small Squink icon */}
        <div className="absolute bottom-2 right-4 w-8 h-8 opacity-50">
          <Image 
            src="/squink.svg" 
            alt="Squink" 
            width={32} 
            height={32}
          />
        </div>
      </footer>
      
      {/* Add animations to global.css */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-slow-reverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        
        @keyframes wave-slow {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(10px) rotate(5deg); }
        }
        
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        
        @keyframes fish-swim {
          0% { transform: translateX(0); }
          50% { transform: translateX(100px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes fish-swim-reverse {
          0% { transform: translateX(0) scaleX(1); }
          50% { transform: translateX(-100px) scaleX(1); }
          100% { transform: translateX(0) scaleX(1); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-slow-reverse {
          animation: float-slow-reverse 7s ease-in-out infinite;
        }
        
        .animate-wave-slow {
          animation: wave-slow 8s ease-in-out infinite;
        }
        
        .animate-blob {
          animation: blob 10s ease-in-out infinite;
        }
        
        .animate-fish-swim {
          animation: fish-swim 15s ease-in-out infinite;
        }
        
        .animate-fish-swim-reverse {
          animation: fish-swim-reverse 12s ease-in-out infinite;
        }
        
        .animate-float-0 {
          animation: float 7s ease-in-out infinite;
        }
        
        .animate-float-1 {
          animation: float 8s ease-in-out infinite 0.5s;
        }
        
        .animate-float-2 {
          animation: float 9s ease-in-out infinite 1s;
        }
      `}</style>
    </main>
  );
}
