'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronRight, ExternalLink, Github, BookOpen, Shield, Zap, Users, Target, Code, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  const [bubbles, setBubbles] = useState<Array<{id: number, size: number, left: string, animationDuration: string, delay: string}>>([]);
  
  // Generate random bubbles on component mount
  useEffect(() => {
    const newBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 25 + 8, // 8-33px
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 8 + 12}s`, // 12-20s
      delay: `${Math.random() * 8}s` // 0-8s delay
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <main className="flex min-h-screen flex-col overflow-hidden relative bg-gradient-to-b from-[#1a0b2e] via-[#2a1758] to-[#1a0b2e]">
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
        <svg className="absolute left-0 top-1/4 w-32 h-96 text-[#9e8cfc] opacity-30" viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,150 Q30,100 10,50 Q-10,0 30,0" stroke="currentColor" strokeWidth="8" fill="none" className="animate-wave-slow" />
          <path d="M10,300 Q40,250 20,200 Q0,150 40,100" stroke="currentColor" strokeWidth="6" fill="none" className="animate-wave-slow" />
        </svg>
        
        {/* Right tentacle decoration */}
        <svg className="absolute right-0 top-1/3 w-32 h-96 text-[#e86bdf] opacity-30" viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100,100 Q70,150 90,200 Q110,250 70,300" stroke="currentColor" strokeWidth="8" fill="none" className="animate-wave-slow" />
          <path d="M90,50 Q60,100 80,150 Q100,200 60,250" stroke="currentColor" strokeWidth="6" fill="none" className="animate-wave-slow" />
        </svg>
        
        {/* Background coral shapes */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-[#2a1758] rounded-t-[100%] opacity-20"></div>
        <div className="absolute bottom-0 left-1/4 w-1/2 h-48 bg-[#3b4fd9] rounded-t-[100%] opacity-10"></div>
        <div className="absolute bottom-0 right-10 w-64 h-40 bg-[#e86bdf] rounded-t-[100%] opacity-10"></div>
      </div>

      {/* Header with navigation */}
      <header className="bg-gradient-to-r from-[#6e56cf]/30 to-[#3b4fd9]/30 backdrop-blur-md py-4 px-6 flex items-center justify-between border-b border-[#9e8cfc]/20 relative z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 group-hover:scale-110 transition-transform">
            <Image
              src="/squink.svg"
              alt="Squink - ink!CTF Mascot"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Freude, sans-serif' }}>
            <span className="text-[#6e56cf] group-hover:text-white transition-colors">ink!</span>
            <span className="text-[#e86bdf] group-hover:text-white transition-colors">CTF</span>
          </h1>
        </Link>
        <Link 
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-[#6e56cf]/40 hover:bg-[#6e56cf]/60 rounded-full text-sm font-medium text-white transition-all duration-200 hover:shadow-md hover:shadow-[#6e56cf]/30 active:scale-95"
        >
          Back to Challenges
          <ChevronRight className="h-4 w-4" />
        </Link>
      </header>

      {/* Hero Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#6e56cf]/30 to-[#3b4fd9]/30 backdrop-blur-md rounded-[3rem] p-8 md:p-12 overflow-hidden border border-[#9e8cfc]/30">
            {/* Decorative blob in background */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#e86bdf]/20 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#6e56cf]/20 rounded-[30%_60%_70%_40%/50%_60%_30%_60%] animate-blob"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="flex-1">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Freude, sans-serif' }}>
                  About <span className="text-[#6e56cf]">ink!</span><span className="text-[#e86bdf]">CTF</span>
                </h1>
                <p className="text-xl text-[#9e8cfc] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  A gamified platform for learning smart contract security in the ink! and Polkadot ecosystem. Master security by exploiting intentionally vulnerable contracts. 
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="https://use.ink" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium 
                      rounded-full text-white bg-gradient-to-r from-[#6e56cf] to-[#e86bdf] 
                      hover:shadow-lg hover:shadow-[#e86bdf]/30 transition-all duration-300 transform hover:scale-105"
                  >
                    Learn ink!
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                  <Link 
                    href="https://github.com/Gmin2/ink-ctf-game" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 
                      border-2 border-[#9e8cfc]/50 text-base font-medium rounded-full text-white 
                      hover:bg-[#6e56cf]/20 transition-all duration-300"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View Source
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 flex justify-center relative">
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
          </div>
        </div>
      </section>

      {/* What is ink!CTF Section */}
      <section className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-md rounded-[2rem] p-8 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/10 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#e86bdf]/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6 text-center" style={{ fontFamily: 'Freude, sans-serif' }}>
              What is ink!CTF?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[#c5bfff] mb-6 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  ink!CTF is an educational platform inspired by <a href="https://ethernaut.openzeppelin.com/" target="_blank" rel="noopener noreferrer" className="text-[#e86bdf] hover:text-white underline">Ethernaut</a>, designed specifically for the ink! smart contract ecosystem. ink! is an embedded domain-specific language (eDSL) designed to develop Wasm smart contracts using the Rust programming language. 
                </p>
                <p className="text-[#c5bfff] mb-6 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Our platform provides hands-on experience with smart contract vulnerabilities in a safe, gamified environment. Each level presents a vulnerable contract that you must exploit to understand common security pitfalls and learn how to write more secure code.
                </p>
              </div>
              <div>
                <p className="text-[#c5bfff] mb-6 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  ink! offers native compatibility with Solidity contracts and tooling, combining the security and performance benefits of Rust with blazing fast execution and lower gas costs through the PolkaVM RISC-V engine. 
                </p>
                <p className="text-[#c5bfff] leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Whether you're new to smart contract security or an experienced developer looking to explore the Polkadot ecosystem, ink!CTF provides structured challenges that progressively build your expertise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center text-white" style={{ fontFamily: 'Freude, sans-serif' }}>
          Why Choose ink!CTF?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/10 hover:shadow-xl hover:shadow-[#6e56cf]/20 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#e86bdf]/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob opacity-50"></div>
            <div className="relative z-10">
              <Shield className="h-12 w-12 text-[#5eead4] mb-4" />
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Freude, sans-serif' }}>
                Security-Focused Learning
              </h3>
              <p className="text-[#c5bfff] text-sm">
                Learn by breaking. Understand vulnerabilities by exploiting them in a controlled environment, building intuition for secure development.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/10 hover:shadow-xl hover:shadow-[#6e56cf]/20 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#6e56cf]/10 rounded-[30%_70%_40%_60%/70%_40%_60%_30%] animate-blob opacity-50"></div>
            <div className="relative z-10">
              <Code className="h-12 w-12 text-[#6b7eff] mb-4" />
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Freude, sans-serif' }}>
                Interactive IDE
              </h3>
              <p className="text-[#c5bfff] text-sm">
                Monaco-powered editor with real-time console feedback and blockchain state visualization for an immersive learning experience.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/10 hover:shadow-xl hover:shadow-[#6e56cf]/20 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#e86bdf]/10 rounded-[70%_30%_50%_50%/40%_70%_30%_70%] animate-blob opacity-50"></div>
            <div className="relative z-10">
              <Target className="h-12 w-12 text-[#e86bdf] mb-4" />
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Freude, sans-serif' }}>
                Progressive Difficulty
              </h3>
              <p className="text-[#c5bfff] text-sm">
                From basic contract interaction to advanced storage manipulation and cross-contract attacks. Build skills systematically.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/10 hover:shadow-xl hover:shadow-[#6e56cf]/20 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#6e56cf]/10 rounded-[50%_50%_30%_70%/60%_40%_60%_40%] animate-blob opacity-50"></div>
            <div className="relative z-10">
              <Lightbulb className="h-12 w-12 text-[#ffc4f7] mb-4" />
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Freude, sans-serif' }}>
                Guided Hints & Walkthroughs
              </h3>
              <p className="text-[#c5bfff] text-sm">
                Get unstuck with progressive hints and detailed step-by-step walkthroughs when you need them.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/10 hover:shadow-xl hover:shadow-[#6e56cf]/20 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#e86bdf]/10 rounded-[40%_60%_70%_30%/50%_30%_60%_70%] animate-blob opacity-50"></div>
            <div className="relative z-10">
              <Zap className="h-12 w-12 text-[#5eead4] mb-4" />
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Freude, sans-serif' }}>
                Modern Tech Stack
              </h3>
              <p className="text-[#c5bfff] text-sm">
                Built with Next.js 14, TypeScript, Tailwind CSS, and Radix UI for a smooth, responsive experience.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-sm rounded-[2rem] p-6 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/10 hover:shadow-xl hover:shadow-[#6e56cf]/20 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#6e56cf]/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob opacity-50"></div>
            <div className="relative z-10">
              <Users className="h-12 w-12 text-[#6b7eff] mb-4" />
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Freude, sans-serif' }}>
                Open Source
              </h3>
              <p className="text-[#c5bfff] text-sm">
                Community-driven development with contributions welcome. Help improve the platform for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About ink! and Polkadot Section */}
      <section className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-[#6e56cf]/20 to-[#3b4fd9]/20 backdrop-blur-md rounded-[2rem] p-8 border border-[#9e8cfc]/20 shadow-lg shadow-[#6e56cf]/10 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-[#e86bdf]/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center" style={{ fontFamily: 'Freude, sans-serif' }}>
              About ink! & the Polkadot Ecosystem
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold text-[#ffc4f7] mb-4" style={{ fontFamily: 'Freude, sans-serif' }}>
                  What is ink!?
                </h3>
                <p className="text-[#c5bfff] mb-6 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  ink! is an embedded domain-specific language (eDSL) designed to develop Wasm smart contracts using the Rust programming language. Rather than creating a new language, ink! is just standard Rust in a well-defined "contract format" with specialized #[ink(…)] attribute macros. 
                </p>
                <p className="text-[#c5bfff] mb-6 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Since ink! smart contracts are compiled to Wasm, they offer high execution speed, platform independence, and enhanced security through sandboxed execution. 
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-[#6e56cf]/30 rounded-full text-xs text-[#c5bfff]">Rust-based</span>
                  <span className="px-3 py-1 bg-[#e86bdf]/30 rounded-full text-xs text-[#c5bfff]">WebAssembly</span>
                  <span className="px-3 py-1 bg-[#3b4fd9]/30 rounded-full text-xs text-[#c5bfff]">Type-safe</span>
                  <span className="px-3 py-1 bg-[#14b8a6]/30 rounded-full text-xs text-[#c5bfff]">Fast execution</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-[#ffc4f7] mb-4" style={{ fontFamily: 'Freude, sans-serif' }}>
                  Polkadot Ecosystem
                </h3>
                <p className="text-[#c5bfff] mb-6 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Polkadot is a multichain network that enables scalability and interoperability between different blockchains (parachains). Smart contracts can be deployed on various parachains that support the contracts pallet. 
                </p>
                <p className="text-[#c5bfff] mb-6 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  For developers building smart contracts in the Polkadot ecosystem, they can leverage Polkadot's scalability and interoperability while utilizing ink!'s safety guarantees and performance benefits. 
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-[#6e56cf]/30 rounded-full text-xs text-[#c5bfff]">Interoperable</span>
                  <span className="px-3 py-1 bg-[#e86bdf]/30 rounded-full text-xs text-[#c5bfff]">Scalable</span>
                  <span className="px-3 py-1 bg-[#3b4fd9]/30 rounded-full text-xs text-[#c5bfff]">Cross-chain</span>
                  <span className="px-3 py-1 bg-[#14b8a6]/30 rounded-full text-xs text-[#c5bfff]">Substrate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center text-white" style={{ fontFamily: 'Freude, sans-serif' }}>
          Your Learning Journey
        </h2>
        <div className="space-y-8">
          {[
            {
              level: 'Beginner',
              title: 'Foundation Building',
              description: 'Start with basic contract interaction and simple vulnerabilities like access control flaws.',
              topics: ['Contract interaction', 'Fallback functions', 'Basic security'],
              color: 'from-[#3b4fd9]/30 to-[#6b7eff]/30',
              icon: <BookOpen className="h-8 w-8" />
            },
            {
              level: 'Intermediate', 
              title: 'Core Vulnerabilities',
              description: 'Explore common attack vectors including randomness flaws and reentrancy vulnerabilities.',
              topics: ['Weak randomness', 'Reentrancy attacks', 'State manipulation'],
              color: 'from-[#e86bdf]/30 to-[#ff9ef5]/30',
              icon: <Target className="h-8 w-8" />
            },
            {
              level: 'Advanced',
              title: 'Complex Exploits',
              description: 'Master sophisticated attacks involving storage manipulation and cross-contract vulnerabilities.',
              topics: ['Storage layout attacks', 'Cross-contract calls', 'Advanced patterns'],
              color: 'from-[#ff5757]/30 to-[#ff8a8a]/30',
              icon: <Zap className="h-8 w-8" />
            }
          ].map((stage, index) => (
            <div key={index} className={`bg-gradient-to-r ${stage.color} backdrop-blur-md rounded-[2rem] p-6 md:p-8 border border-[#9e8cfc]/20 shadow-lg relative overflow-hidden`}>
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/5 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob"></div>
              
              <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="text-white">
                    {stage.icon}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#c5bfff] uppercase tracking-wider">{stage.level}</span>
                    <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Freude, sans-serif' }}>
                      {stage.title}
                    </h3>
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-[#c5bfff] mb-4 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {stage.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {stage.topics.map((topic, topicIndex) => (
                      <span key={topicIndex} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Resources Section */}
      <section className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center text-white" style={{ fontFamily: 'Freude, sans-serif' }}>
          Helpful Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'ink! Documentation',
              description: 'Official documentation for ink! smart contracts',
              url: 'https://use.ink',
              icon: <BookOpen className="h-6 w-6" />,
              color: 'bg-[#6e56cf]/20'
            },
            {
              title: 'Polkadot Developer Docs',
              description: 'Comprehensive guides for Polkadot development',
              url: 'https://docs.polkadot.com',
             icon: <Code className="h-6 w-6" />,
             color: 'bg-[#e86bdf]/20'
           },
           {
             title: 'ink! Examples',
             description: 'Collection of example contracts and patterns',
             url: 'https://github.com/use-ink/ink-examples',
             icon: <Github className="h-6 w-6" />,
             color: 'bg-[#3b4fd9]/20'
           },
           {
             title: 'Substrate Contracts Node',
             description: 'Local development node for testing contracts',
             url: 'https://github.com/paritytech/substrate-contracts-node',
             icon: <Zap className="h-6 w-6" />,
             color: 'bg-[#14b8a6]/20'
           },
           {
             title: 'Contracts UI',
             description: 'Web interface for interacting with contracts',
             url: 'https://contracts-ui.substrate.io',
             icon: <ExternalLink className="h-6 w-6" />,
             color: 'bg-[#6e56cf]/20'
           },
           {
             title: 'OpenBrush Library',
             description: 'Reusable components for ink! contracts',
             url: 'https://openbrush.io',
             icon: <Shield className="h-6 w-6" />,
             color: 'bg-[#e86bdf]/20'
           }
         ].map((resource, index) => (
          <a
             key={index}
             href={resource.url}
             target="_blank"
             rel="noopener noreferrer"
             className={`${resource.color} backdrop-blur-sm rounded-[1.5rem] p-6 border border-[#9e8cfc]/20 shadow-lg hover:shadow-xl hover:shadow-[#6e56cf]/20 hover:scale-[1.02] transition-all duration-300 group`}
           >
             <div className="flex items-start gap-4">
               <div className="text-[#ffc4f7] group-hover:text-white transition-colors">
                 {resource.icon}
               </div>
               <div>
                 <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#ffc4f7] transition-colors" style={{ fontFamily: 'Freude, sans-serif' }}>
                   {resource.title}
                 </h3>
                 <p className="text-[#c5bfff] text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                   {resource.description}
                 </p>
                 <div className="mt-3 inline-flex items-center text-[#e86bdf] text-sm group-hover:text-white transition-colors">
                   Learn more
                   <ExternalLink className="ml-1 h-3 w-3" />
                 </div>
               </div>
             </div>
           </a>
         ))}
       </div>
     </section>

     {/* Call to Action */}
     <section className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
       <div className="bg-gradient-to-br from-[#6e56cf]/30 to-[#3b4fd9]/30 backdrop-blur-md rounded-[3rem] p-8 md:p-12 text-center border border-[#9e8cfc]/30 relative overflow-hidden">
         {/* Decorative blobs */}
         <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#e86bdf]/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob"></div>
         <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#6e56cf]/10 rounded-[30%_60%_70%_40%/50%_60%_30%_60%] animate-blob"></div>
         
         <div className="relative z-10">
           <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Freude, sans-serif' }}>
             Ready to Start Hacking?
           </h2>
           <p className="text-xl text-[#c5bfff] mb-8 max-w-3xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
             Join the ranks of security-conscious ink! developers. Start with our beginner-friendly challenges and work your way up to advanced exploits.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <Link 
               href="/levels/1" 
               className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium 
                 rounded-full text-white bg-gradient-to-r from-[#6e56cf] to-[#e86bdf] 
                 hover:shadow-lg hover:shadow-[#e86bdf]/30 transition-all duration-300 transform hover:scale-105"
             >
               Start First Challenge
               <ChevronRight className="ml-2 h-5 w-5" />
             </Link>
             <Link 
               href="/" 
               className="inline-flex items-center justify-center px-8 py-4 
                 border-2 border-[#9e8cfc]/50 text-lg font-medium rounded-full text-white 
                 hover:bg-[#6e56cf]/20 transition-all duration-300"
             >
               View All Levels
             </Link>
           </div>
         </div>
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

     {/* Footer */}
     <footer className="w-full py-12 px-4 sm:px-6 lg:px-8 text-center relative bg-gradient-to-b from-[#2a1758] to-[#1a0b2e]">
       <svg className="absolute bottom-full left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
         <path 
           d="M0,0 C150,60 350,0 500,80 C650,160 750,40 900,100 C1050,160 1150,60 1200,80 L1200,120 L0,120 Z" 
           className="fill-[#1a0b2e]"
         ></path>
       </svg>
       
       <div className="max-w-7xl mx-auto relative z-10">
         <div className="flex justify-center items-center gap-8 mb-8">
           <div className="relative w-32 h-12 animate-float-slow">
             <Image 
               src="/polkadot-logo.svg" 
               alt="Polkadot Logo" 
               fill
               className="object-contain drop-shadow-[0_0_10px_rgba(232,107,223,0.5)]"
             />
           </div>
           <div className="relative w-24 h-12 animate-float-slow-reverse">
             <Image 
               src="/ink-logo.svg" 
               alt="ink! Logo" 
               fill
               className="object-contain drop-shadow-[0_0_10px_rgba(110,86,207,0.5)]"
             />
           </div>
           <div className="relative w-32 h-12 animate-float-slow">
             <Image 
               src="/substrate-logo.svg" 
               alt="Substrate Logo" 
               fill
               className="object-contain drop-shadow-[0_0_10px_rgba(232,107,223,0.5)]"
             />
           </div>
         </div>
         
         <p className="text-[#9e8cfc] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
           Built with 💜 for the ink! and Polkadot community
         </p>
         
         <div className="flex justify-center gap-6 text-sm text-[#c5bfff]">
           <a href="https://github.com/Gmin2/ink-ctf-game" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
             <Github className="h-4 w-4" />
             GitHub
           </a>
           <a href="https://use.ink" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
             <ExternalLink className="h-4 w-4" />
             ink! Docs
           </a>
           <a href="https://polkadot.network" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
             <ExternalLink className="h-4 w-4" />
             Polkadot
           </a>
         </div>
       </div>
       
       {/* Small Squink icon */}
       <div className="absolute bottom-4 right-4 w-8 h-8 opacity-50">
         <Image 
           src="/squink.svg" 
           alt="Squink" 
           width={32} 
           height={32}
         />
       </div>
     </footer>
     
     {/* Animations */}
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
     `}</style>
   </main>
 );
}