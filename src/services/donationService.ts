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

// Import your smart contract client
import * as donationProgramClient from '../../donation_program_program/app/program_client';

const PROGRAM_ID = new PublicKey('4wQtk86gtn1tSUu67H1191wy4wfcm5jar4qku2fuNiBg');

export async function sendDonation(
  wallet: WalletContextState,
  dogId: string,
  amount: number,
  tokenSymbol: string = 'SOL'
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  const network = DONATION_CONFIG.network === 'mainnet-beta' ? 'mainnet-beta' : 'devnet';
  const connection = new Connection(clusterApiUrl(network), 'confirmed');
  const recipientPublicKey = new PublicKey(DONATION_CONFIG.recipientWallet);

  try {
    // Initialize the program client
    donationProgramClient.initializeClient(PROGRAM_ID);

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
    // Use your smart contract for SOL donations
    const donationInstruction = await donationProgramClient.donateSol({
      donor: wallet.publicKey,
      recipient: recipient,
      dogId: dogId,
      amount: BigInt(Math.round(amount * LAMPORTS_PER_SOL))
    });
    
    const transaction = new Transaction().add(donationInstruction);

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    await connection.confirmTransaction(signature, 'confirmed');

    return signature;
  } catch (error) {
    console.error('SOL donation failed, falling back to direct transfer:', error);
    
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

  try {
    // Use your smart contract for token donations
    const donationInstruction = await donationProgramClient.donateToken({
      donor: wallet.publicKey,
      tokenMint: mintPublicKey,
      donorTokenAccount: senderTokenAccount,
      recipientTokenAccount: recipientTokenAccount,
      source: senderTokenAccount,
      destination: recipientTokenAccount,
      authority: wallet.publicKey,
      dogId: dogId,
      amount: BigInt(tokenAmount)
    });
    
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

    transaction.add(donationInstruction);

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const signedTransaction = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    await connection.confirmTransaction(signature, 'confirmed');

    return signature;
  } catch (error) {
    console.error('Token donation via smart contract failed, falling back to direct transfer:', error);
    
    // Fallback to direct token transfer
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
  }
}