
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use std::str::FromStr;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("4wQtk86gtn1tSUu67H1191wy4wfcm5jar4qku2fuNiBg");

#[program]
pub mod donation_program {
    use super::*;

/// Accounts:
/// 0. `[writable, signer]` donor: [AccountInfo] 
/// 1. `[writable]` donation_record: [DonationRecord] 
/// 2. `[writable]` recipient: [AccountInfo] 
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - dog_id: [String] 
/// - amount: [u64] 
	pub fn donate_sol(ctx: Context<DonateSol>, dog_id: String, amount: u64) -> Result<()> {
		donate_sol::handler(ctx, dog_id, amount)
	}

/// Accounts:
/// 0. `[writable, signer]` donor: [AccountInfo] 
/// 1. `[writable]` donation_record: [DonationRecord] 
/// 2. `[]` token_mint: [Mint] 
/// 3. `[writable]` donor_token_account: [AccountInfo] 
/// 4. `[writable]` recipient_token_account: [AccountInfo] 
/// 5. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
/// 6. `[writable]` source: [AccountInfo] The source account.
/// 7. `[writable]` destination: [AccountInfo] The destination account.
/// 8. `[signer]` authority: [AccountInfo] The source account's owner/delegate.
/// 9. `[]` csl_spl_token_v0_0_0: [AccountInfo] Auto-generated, CslSplTokenProgram v0.0.0
///
/// Data:
/// - dog_id: [String] 
/// - amount: [u64] 
	pub fn donate_token(ctx: Context<DonateToken>, dog_id: String, amount: u64) -> Result<()> {
		donate_token::handler(ctx, dog_id, amount)
	}



}
