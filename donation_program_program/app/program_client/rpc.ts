import {
  AnchorProvider,
  BN,
  IdlAccounts,
  Program,
  web3,
} from "@coral-xyz/anchor";
import { MethodsBuilder } from "@coral-xyz/anchor/dist/cjs/program/namespace/methods";
import { DonationProgram } from "../../target/types/donation_program";
import idl from "../../target/idl/donation_program.json";
import * as pda from "./pda";

import { CslSplToken } from "../../target/types/csl_spl_token";
import idlCslSplToken from "../../target/idl/csl_spl_token.json";



let _program: Program<DonationProgram>;
let _programCslSplToken: Program<CslSplToken>;


export const initializeClient = (
    programId: web3.PublicKey,
    anchorProvider = AnchorProvider.env(),
) => {
    _program = new Program<DonationProgram>(
        idl as never,
        programId,
        anchorProvider,
    );

    _programCslSplToken = new Program<CslSplToken>(
        idlCslSplToken as never,
        new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        anchorProvider,
    );

};

export type DonateSolArgs = {
  donor: web3.PublicKey;
  recipient: web3.PublicKey;
  dogId: string;
  amount: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[writable, signer]` donor: {@link PublicKey} 
 * 1. `[writable]` donation_record: {@link DonationRecord} 
 * 2. `[writable]` recipient: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - dog_id: {@link string} 
 * - amount: {@link BigInt} 
 */
export const donateSolBuilder = (
	args: DonateSolArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<DonationProgram, never> => {
    const [donationRecordPubkey] = pda.deriveDonationPDA({
        dogId: args.dogId,
    }, _program.programId);

  return _program
    .methods
    .donateSol(
      args.dogId,
      new BN(args.amount.toString()),
    )
    .accountsStrict({
      donor: args.donor,
      donationRecord: donationRecordPubkey,
      recipient: args.recipient,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[writable, signer]` donor: {@link PublicKey} 
 * 1. `[writable]` donation_record: {@link DonationRecord} 
 * 2. `[writable]` recipient: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - dog_id: {@link string} 
 * - amount: {@link BigInt} 
 */
export const donateSol = (
	args: DonateSolArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    donateSolBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[writable, signer]` donor: {@link PublicKey} 
 * 1. `[writable]` donation_record: {@link DonationRecord} 
 * 2. `[writable]` recipient: {@link PublicKey} 
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - dog_id: {@link string} 
 * - amount: {@link BigInt} 
 */
export const donateSolSendAndConfirm = async (
  args: Omit<DonateSolArgs, "donor"> & {
    signers: {
      donor: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return donateSolBuilder({
      ...args,
      donor: args.signers.donor.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.donor])
    .rpc();
}

export type DonateTokenArgs = {
  donor: web3.PublicKey;
  tokenMint: web3.PublicKey;
  donorTokenAccount: web3.PublicKey;
  recipientTokenAccount: web3.PublicKey;
  source: web3.PublicKey;
  destination: web3.PublicKey;
  authority: web3.PublicKey;
  dogId: string;
  amount: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Accounts:
 * 0. `[writable, signer]` donor: {@link PublicKey} 
 * 1. `[writable]` donation_record: {@link DonationRecord} 
 * 2. `[]` token_mint: {@link Mint} 
 * 3. `[writable]` donor_token_account: {@link PublicKey} 
 * 4. `[writable]` recipient_token_account: {@link PublicKey} 
 * 5. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 6. `[writable]` source: {@link PublicKey} The source account.
 * 7. `[writable]` destination: {@link PublicKey} The destination account.
 * 8. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 9. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - dog_id: {@link string} 
 * - amount: {@link BigInt} 
 */
export const donateTokenBuilder = (
	args: DonateTokenArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<DonationProgram, never> => {
    const [donationRecordPubkey] = pda.deriveDonationPDA({
        dogId: args.dogId,
    }, _program.programId);

  return _program
    .methods
    .donateToken(
      args.dogId,
      new BN(args.amount.toString()),
    )
    .accountsStrict({
      donor: args.donor,
      donationRecord: donationRecordPubkey,
      tokenMint: args.tokenMint,
      donorTokenAccount: args.donorTokenAccount,
      recipientTokenAccount: args.recipientTokenAccount,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
      source: args.source,
      destination: args.destination,
      authority: args.authority,
      cslSplTokenV000: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Accounts:
 * 0. `[writable, signer]` donor: {@link PublicKey} 
 * 1. `[writable]` donation_record: {@link DonationRecord} 
 * 2. `[]` token_mint: {@link Mint} 
 * 3. `[writable]` donor_token_account: {@link PublicKey} 
 * 4. `[writable]` recipient_token_account: {@link PublicKey} 
 * 5. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 6. `[writable]` source: {@link PublicKey} The source account.
 * 7. `[writable]` destination: {@link PublicKey} The destination account.
 * 8. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 9. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - dog_id: {@link string} 
 * - amount: {@link BigInt} 
 */
export const donateToken = (
	args: DonateTokenArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    donateTokenBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Accounts:
 * 0. `[writable, signer]` donor: {@link PublicKey} 
 * 1. `[writable]` donation_record: {@link DonationRecord} 
 * 2. `[]` token_mint: {@link Mint} 
 * 3. `[writable]` donor_token_account: {@link PublicKey} 
 * 4. `[writable]` recipient_token_account: {@link PublicKey} 
 * 5. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 6. `[writable]` source: {@link PublicKey} The source account.
 * 7. `[writable]` destination: {@link PublicKey} The destination account.
 * 8. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 9. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - dog_id: {@link string} 
 * - amount: {@link BigInt} 
 */
export const donateTokenSendAndConfirm = async (
  args: Omit<DonateTokenArgs, "donor" | "authority"> & {
    signers: {
      donor: web3.Signer,
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return donateTokenBuilder({
      ...args,
      donor: args.signers.donor.publicKey,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.donor, args.signers.authority])
    .rpc();
}

// Getters

export const getDonationRecord = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<DonationProgram>["donationRecord"]> => _program.account.donationRecord.fetch(publicKey, commitment);
export module CslSplTokenGetters {
    export const getMint = (
        publicKey: web3.PublicKey,
        commitment?: web3.Commitment
    ): Promise<IdlAccounts<CslSplToken>["mint"]> => _programCslSplToken.account.mint.fetch(publicKey, commitment);
    
    export const getAccount = (
        publicKey: web3.PublicKey,
        commitment?: web3.Commitment
    ): Promise<IdlAccounts<CslSplToken>["account"]> => _programCslSplToken.account.account.fetch(publicKey, commitment);
}

