import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { sendDonation } from '../services/donationService';

export function useDonation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const wallet = useWallet();
  const { connected } = wallet;

  const donate = async (
    dogId: string,
    amount: number,
    tokenSymbol: string = 'SOL'
  ) => {
    if (!connected) {
      setError('Wallet not connected');
      return null;
    }
    
    if (!amount) {
      setError('Please select a donation amount');
      return null;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const signature = await sendDonation(
        wallet,
        dogId,
        amount,
        tokenSymbol
      );
      
      setTransactionSignature(signature);
      console.log('Donation successful:', signature);
      return signature;
    } catch (err) {
      console.error('Donation failed:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    donate,
    isProcessing,
    transactionSignature,
    error,
    connected,
    wallet
  };
}