import React from 'react';
import { useState } from 'react';
import { Dog } from '../types/dog';
import { X, Heart, Calendar, MapPin, Stethoscope, Gift, Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { DONATION_CONFIG } from '../config/donation';
import { sendDonation } from '../services/donationService';

interface DogModalProps {
  dog: Dog | null;
  onClose: () => void;
}

export const DogModal: React.FC<DogModalProps> = ({ dog, onClose }) => {
  const wallet = useWallet();
  const { connected } = wallet;
  const [selectedToken, setSelectedToken] = useState<'SOL' | 'USDC' | 'WOOFI'>('SOL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!dog) return null;

  const currentToken = DONATION_CONFIG.tokens[selectedToken];

  const handleDonate = async (amount: number) => {
    if (DONATION_CONFIG.recipientWallet === 'YOUR_WALLET_ADDRESS_HERE') {
      alert('Please configure the donation wallet address in src/config/donation.ts');
      return;
    }
    
    if (!wallet.publicKey || !wallet.signTransaction) {
      setError('Wallet not connected');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setTransactionSignature(null);
    
    try {
      console.log(`Initiating donation of ${amount} ${selectedToken} to ${dog.name}`);
      console.log('Donor wallet:', wallet.publicKey.toString());
      console.log('Recipient wallet:', DONATION_CONFIG.recipientWallet);
      console.log('Dog ID:', dog.id);
      
      const signature = await sendDonation(
        wallet,
        dog.id,
        amount,
        selectedToken
      );
      
      setTransactionSignature(signature);
      console.log('Donation successful! Transaction signature:', signature);
      
      // Optional: Show success message
      alert(`Donation of ${amount} ${selectedToken} successful!\nTransaction: ${signature}`);
    } catch (err) {
      console.error('Donation failed:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      // Show user-friendly error
      if (err instanceof Error && err.message.includes('insufficient funds')) {
        setError('Insufficient funds in your wallet');
      } else if (err instanceof Error && err.message.includes('User rejected')) {
        setError('Transaction was cancelled');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
        <div className="relative">
          <img 
            src={dog.image} 
            alt={dog.name}
            className="w-full h-80 object-cover rounded-t-2xl"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold ${
            dog.adoptionStatus === 'Available' ? 'bg-green-100 text-green-800' :
            dog.adoptionStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {dog.adoptionStatus}
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{dog.name}</h2>
              <p className="text-lg text-gray-600">{dog.breed} • {dog.age} years old • {dog.gender} • {dog.size}</p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-orange-500" />
                  About {dog.name}
                </h3>
                <p className="text-gray-700 leading-relaxed">{dog.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-blue-500" />
                  Personality
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dog.personality.map((trait, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-green-500" />
                  Medical History
                </h3>
                <ul className="space-y-1">
                  {dog.medicalHistory.map((item, index) => (
                    <li key={index} className="text-gray-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {dog.specialNeeds.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-500" />
                    Special Needs
                  </h3>
                  <ul className="space-y-1">
                    {dog.specialNeeds.map((need, index) => (
                      <li key={index} className="text-gray-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        {need}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Arrived: {new Date(dog.dateArrived).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-orange-600" />
                  Support {dog.name}
                </h3>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-gray-700 mb-2">Help support {dog.name}'s care and find them a loving home</p>
                    <p className="text-sm text-gray-600">All donations go directly to the shelter</p>
                  </div>

                  {!connected ? (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">Connect your wallet to donate</p>
                      <WalletMultiButton className="!bg-orange-600 hover:!bg-orange-700" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 text-center">Select donation token</p>
                        <div className="flex gap-2">
                          {Object.entries(DONATION_CONFIG.tokens).map(([key, token]) => (
                            <button
                              key={key}
                              onClick={() => setSelectedToken(key as 'SOL' | 'USDC' | 'WOOFI')}
                              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                selectedToken === key
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-white border-2 border-orange-200 text-orange-700 hover:border-orange-300'
                              }`}
                            >
                              {token.symbol}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 text-center">Choose donation amount ({selectedToken})</p>
                      <div className="grid grid-cols-2 gap-3">
                        {currentToken.defaultAmounts.map((amount, index) => (
                          <button 
                            key={amount}
                            onClick={() => handleDonate(amount)}
                            disabled={isProcessing}
                            className={`rounded-lg py-3 px-4 font-semibold transition-all duration-200 ${
                              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                            } ${
                              index >= 2
                                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                : 'bg-white hover:bg-orange-50 border-2 border-orange-200 hover:border-orange-300 text-orange-700'
                            }`}
                          >
                            {isProcessing ? 'Processing...' : `${amount} ${selectedToken}`}
                          </button>
                        ))}
                      </div>
                      
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
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">Interested in Adopting?</h3>
                <p className="text-blue-700 text-sm mb-4">
                  {dog.name} is looking for a loving forever home. Contact us to learn more about the adoption process.
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200">
                  Start Adoption Process
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};