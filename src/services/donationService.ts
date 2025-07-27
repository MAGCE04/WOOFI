import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  clusterApiUrl
} from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
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

  const endpoint = DONATION_CONFIG.network === 'mainnet-beta' 
    ? 'https://api.mainnet-beta.solana.com'
    : clusterApiUrl('devnet');
  const connection = new Connection(endpoint, 'confirmed');
  const recipientPublicKey = new PublicKey(DONATION_CONFIG.recipientWallet);

  try {
    if (tokenSymbol === 'SOL') {
      return await sendSolDonation(connection, wallet, recipientPublicKey, dogId, amount);
    } else {
      return await sendTokenDonation(connection, wallet, recipientPublicKey, dogId, amount, tokenSymbol);
    }
  } catch (error) {
    console.error('Error sending donation:', error);
    throw new Error(`Donation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function sendSolDonation(
  connection: Connection,
  wallet: WalletContextState,
  recipient: PublicKey,
  dogId: string,
  amount: number
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  try {    
    console.log(`Sending ${amount} SOL from ${wallet.publicKey.toString()} to ${recipient.toString()}`);
    
    // Fallback to direct SOL transfer if smart contract fails
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipient,
        lamports: Math.round(amount * LAMPORTS_PER_SOL)
      })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    await connection.confirmTransaction(signature, 'confirmed');

    return signature;
  } catch (error) {
    console.error('SOL donation failed:', error);
    throw new Error(`SOL donation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function sendTokenDonation(
  connection: Connection,
  wallet: WalletContextState,
  recipient: PublicKey,
  dogId: string,
  amount: number,
  tokenSymbol: string
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const tokenConfig = DONATION_CONFIG.tokens[tokenSymbol as keyof typeof DONATION_CONFIG.tokens];
  if (!tokenConfig || !tokenConfig.mint) {
    throw new Error(`Invalid token: ${tokenSymbol}`);
  }

  const mintPublicKey = new PublicKey(tokenConfig.mint);
  const tokenAmount = Math.round(amount * Math.pow(10, tokenConfig.decimals));

  try {
    console.log(`Sending ${amount} ${tokenSymbol} from ${wallet.publicKey.toString()} to ${recipient.toString()}`);
    
    // Get associated token accounts
    const senderTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      wallet.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const recipientTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      recipient,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    
    // Direct token transfer
    const transaction = new Transaction();

    // Check if recipient token account exists, create if not
    const recipientAccountInfo = await connection.getAccountInfo(recipientTokenAccount);
    if (!recipientAccountInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          recipientTokenAccount,
          recipient,
          mintPublicKey,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
    }

    transaction.add(
      createTransferInstruction(
        senderTokenAccount,
        recipientTokenAccount,
        wallet.publicKey,
        tokenAmount,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    await connection.confirmTransaction(signature, 'confirmed');

    return signature;
  } catch (error) {
    console.error('Token donation failed:', error);
    throw new Error(`Token donation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}