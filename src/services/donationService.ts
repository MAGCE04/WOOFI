import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL, 
  TransactionInstruction 
} from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { DONATION_CONFIG } from '../config/donation';

// Program ID for the donation program
const DONATION_PROGRAM_ID = new PublicKey('11111111111111111111111111111111'); // Replace with actual program ID after deployment

export async function sendDonation(
  wallet: WalletContextState,
  dogId: string,
  amount: number,
  tokenSymbol: string = 'SOL'
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const connection = new Connection(
    tokenSymbol === 'SOL' 
      ? `https://api.${DONATION_CONFIG.network}.solana.com` 
      : `https://api.${DONATION_CONFIG.network}.solana.com`,
    'confirmed'
  );

  const recipientPublicKey = new PublicKey(DONATION_CONFIG.recipientWallet);
  
  // For now, we'll implement a simple SOL transfer
  // In a production app, you would use the donation_program for both SOL and tokens
  if (tokenSymbol === 'SOL') {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipientPublicKey,
        lamports: amount * LAMPORTS_PER_SOL
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
    // For token transfers, we would use the token program
    // This would be implemented with the donation_program in a production app
    throw new Error(`Token donations for ${tokenSymbol} not yet implemented`);
  }
}