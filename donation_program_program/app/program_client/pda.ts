import {PublicKey} from "@solana/web3.js";
import {BN} from "@coral-xyz/anchor";

export type DonationSeeds = {
    dogId: string, 
};

export const deriveDonationPDA = (
    seeds: DonationSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("donation"),
            Buffer.from(seeds.dogId, "utf8"),
        ],
        programId,
    )
};

export module CslSplTokenPDAs {
    export type AccountSeeds = {
        wallet: PublicKey, 
        tokenProgram: PublicKey, 
        mint: PublicKey, 
    };
    
    export const deriveAccountPDA = (
        seeds: AccountSeeds,
        programId: PublicKey
    ): [PublicKey, number] => {
        return PublicKey.findProgramAddressSync(
            [
                seeds.wallet.toBuffer(),
                seeds.tokenProgram.toBuffer(),
                seeds.mint.toBuffer(),
            ],
            programId,
        )
    };
    
}

