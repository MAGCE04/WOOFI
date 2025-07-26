import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  clusterApiUrl
} from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { DONATION_CONFIG } from '../config/donation';

export async function sendDonation(
  wallet: WalletContextState,
  dogId: string,
  amount: number,
  tokenSymbol: string = 'SOL'
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  // Use clusterApiUrl to get a reliable endpoint
  const network = DONATION_CONFIG.network === 'mainnet-beta' ? 'mainnet-beta' : 'devnet';
  const connection = new Connection(clusterApiUrl(network), 'confirmed');

  const recipientPublicKey = new PublicKey(DONATION_CONFIG.recipientWallet);
  
  // For SOL transfers
  if (tokenSymbol === 'SOL') {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipientPublicKey,
        lamports: Math.round(amount * LAMPORTS_PER_SOL)
      })
    );

    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    try {
      // Sign the transaction
      const signedTransaction = await wallet.signTransaction(transaction);
      
      // Send the transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      // Confirm the transaction
      await connection.confirmTransaction(signature, 'confirmed');
      
      return signature;
    } catch (error) {
      console.error('Error sending donation:', error);
      throw error;
    }
  } else {
    // For token transfers
    const tokenConfig = DONATION_CONFIG.tokens[tokenSymbol as keyof typeof DONATION_CONFIG.tokens];
    
    if (!tokenConfig || !tokenConfig.mint) {
      throw new Error(`Invalid token: ${tokenSymbol}`);
    }
    
    throw new Error(`Token donations for ${tokenSymbol} not yet implemented`);
  }
}