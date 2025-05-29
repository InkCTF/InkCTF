# 🦑 ink!CTF – Capture-the-Flag for ink! Smart Contracts

Welcome to **ink!CTF**, a playful yet professional web game inspired by [Ethernaut](https://ethernaut.openzeppelin.com/) and built for the ink! / Polkadot ecosystem.  
Learn smart-contract security by breaking intentionally vulnerable **ink!** contracts, level by level, while Squink 🦑 cheers you on.

---

## ✨ Features

| Category | Highlights |
| -------- | ---------- |
| 🎮 Gameplay | 6 progressive CTF levels (Beginner → Advanced) covering re-entrancy, storage manipulation, access-control flaws & more |
| 🧑‍💻 Interactive IDE | Monaco-powered editor, real-time console, blockchain-state visualiser |
| 📈 Progress Tracking | Local persistence of completed levels & revealed hints |
| 💡 Hint System | Reveal-as-you-go hints to keep players engaged without spoilers |
| 🎨 ink! Branding | Squink mascot, Freude & Montserrat fonts, curved UI, Polkadot & Substrate logos |
| 🚀 Modern Stack | Next.js 14 • Tailwind CSS • TypeScript • Radix UI • Framer Motion |

---

## 🛠️ Installation

```bash
git clone https://github.com/Gmin2/ink-ctf-game.git
cd ink-ctf-game
npm install            # or pnpm install / yarn
```

> Requires Node ≥ 18 and npm ≥ 9.

---

## ▶️ Running the Development Server

```bash
npm run dev
```

Navigate to **http://localhost:3000** – the game will reload on file changes.

---

## 🎯 How to Play

1. **Select a level** on the dashboard.  
2. **Read the description & objectives.** Understand what makes the contract vulnerable.  
3. **Study the source code** in the _Contract_ tab.  
4. **Write your exploit** in the _Console_ tab (JavaScript helpers provided).  
5. **Run** it – if you succeed, Squink marks the level as completed and unlocks the next challenge!

### Current Levels

| # | Title | Core Concept |
|:-:| ----- | ------------ |
| 1 | Hello Squink! | Basic ink! interaction |
| 2 | Fallback | Improper fallback / ownership takeover |
| 3 | Coin Flip | Weak randomness |
| 4 | Re-entrancy | Classic re-entrancy bug |
| 5 | Storage Manipulation | Out-of-bounds storage write |
| 6 | Cross-Contract Attack | Insecure cross-call logic |

More levels coming soon—PRs welcome!

---

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS 3 + custom ink! design tokens
- **Editor:** Monaco Editor
- **UI Primitives:** Radix UI
- **Animation:** Framer Motion
- **State & Persistence:** React state + Local Storage
- **Testing:** Jest & React Testing Library (planned)

---

## 🌐 About ink! & the Polkadot Ecosystem

ink! is a Rust-based smart-contract language that compiles to **RISC-V/PolkaVM**, offering safety, speed and native Polkadot interoperability.  
This game showcases typical vulnerabilities so builders can write **safer ink! contracts** for parachains and roll-ups.

Helpful links:  
- [use.ink](https://use.ink) – official docs & examples  
- [ink! FAQ – Who is Squink?](https://use.ink/docs/v6/faq/#who-is-squink)  
- [Polkadot](https://polkadot.network/) – multichain network powering the ecosystem

---

## 🤝 Contributing

We love pull requests!  
1. Fork the repo & create a feature branch.  
2. Follow existing coding conventions (Prettier & ESLint will guide you).  
3. Add tests where sensible.  
4. Submit a PR with a descriptive title – Squink will review 🦑.

All contributors must adhere to the [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📜 License

Released under the **MIT License** – see [`LICENSE`](LICENSE) for full text.

> © 2025 ink! Alliance. Built with 💜 for the Polkadot community.
