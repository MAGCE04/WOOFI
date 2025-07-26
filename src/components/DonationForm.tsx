import { useState } from 'react';
import { Dog } from '../types/dog';
import { DONATION_CONFIG } from '../config/donation';
import { useDonation } from '../hooks/useDonation';

interface DonationFormProps {
  selectedDog: Dog;
}

export function DonationForm({ selectedDog }: DonationFormProps) {
  const [selectedToken, setSelectedToken] = useState('SOL');
  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  
  const { 
    donate, 
    isProcessing, 
    transactionSignature, 
    error, 
    connected 
  } = useDonation();

  const handleTokenSelect = (token: string) => {
    setSelectedToken(token);
    setDonationAmount(null);
  };

  const handleAmountSelect = (amount: number) => {
    setDonationAmount(amount);
  };

  const handleDonate = async () => {
    if (!connected || !donationAmount) return;
    await donate(selectedDog.id, donationAmount, selectedToken);
  };

  return (
    <div className="w-full mb-8">
      <h2 className="text-2xl font-bold mb-4">Make a Donation for {selectedDog.name}</h2>
      
      {/* Token Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Select Token</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(DONATION_CONFIG.tokens).map(([symbol, token]) => (
            <button
              key={symbol}
              className={`px-4 py-2 rounded-full ${
                selectedToken === symbol
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => handleTokenSelect(symbol)}
            >
              {token.name} ({symbol})
            </button>
          ))}
        </div>
      </div>
      
      {/* Amount Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Select Amount</h3>
        <div className="flex flex-wrap gap-3">
          {DONATION_CONFIG.tokens[selectedToken as keyof typeof DONATION_CONFIG.tokens].defaultAmounts.map((amount) => (
            <button
              key={amount}
              className={`px-4 py-2 rounded-full ${
                donationAmount === amount
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => handleAmountSelect(amount)}
            >
              {amount} {selectedToken}
            </button>
          ))}
        </div>
      </div>
      
      {/* Donate Button */}
      <button
        className={`w-full py-3 rounded-lg text-white font-bold text-lg ${
          connected && donationAmount
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={!connected || !donationAmount || isProcessing}
        onClick={handleDonate}
      >
        {isProcessing 
          ? 'Processing...' 
          : `Donate ${donationAmount ? `${donationAmount} ${selectedToken}` : ''} to ${selectedDog.name}`}
      </button>
      
      {/* Transaction Result */}
      {transactionSignature && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-bold">Donation Successful!</p>
          <p className="text-sm break-all">
            Transaction: {transactionSignature}
          </p>
          <a 
            href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=${DONATION_CONFIG.network}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View on Solana Explorer
          </a>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}