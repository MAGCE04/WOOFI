// Donation Configuration
// Update this wallet address to specify where donations should be sent
export const DONATION_CONFIG = {
  // Replace this with the actual wallet address where donations should go
  recipientWallet: '6WnQ4hz6mhWrq3S1SHBbC23Qnouap1TRJPKeyztrgTQw',
  
  // Network configuration
  network: 'mainnet-beta', // Change to 'mainnet-beta' for production
    
  // Supported tokens
  tokens: {
    SOL: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9,
      mint: null, // Native SOL
      defaultAmounts: [0.1, 0.5, 1.0, 2.0],
      minimumDonation: 0.01
    },
    USDC: {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mint address
      defaultAmounts: [5, 10, 25, 50],
      minimumDonation: 1
    },
    WOOFI: {
      name: 'Woofi Token',
      symbol: 'WOOFI',
      decimals: 9,
      mint: '5UF9Q7tdkGnZy8MoMrYqe6tcAZJbSaNWMGuUnJajmoon',
      defaultAmounts: [100, 500, 1000, 2500],
      minimumDonation: 10
    }
  }
};

// Instructions for setup:
// 1. Replace 'YOUR_WALLET_ADDRESS_HERE' with your actual Solana wallet address
// 2. For production, change network to 'mainnet-beta'
// 3. Customize donation amounts for each token as needed
// 4. Verify token mint addresses are correct for your target network