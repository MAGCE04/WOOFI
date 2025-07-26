use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};




	#[derive(Accounts)]
	#[instruction(
		dog_id: String,
		amount: u64,
	)]
	pub struct DonateSol<'info> {
		#[account(
			mut,
		)]
		pub donor: Signer<'info>,

		#[account(
			init,
			space=103,
			payer=donor,
			seeds = [
				b"donation",
				dog_id.as_bytes().as_ref(),
			],
			bump,
		)]
		pub donation_record: Account<'info, DonationRecord>,

		#[account(
			mut,
		)]
		/// CHECK: implement manual checks if needed
		pub recipient: UncheckedAccount<'info>,

		pub system_program: Program<'info, System>,
	}

/// Accounts:
/// 0. `[writable, signer]` donor: [AccountInfo] 
/// 1. `[writable]` donation_record: [DonationRecord] 
/// 2. `[writable]` recipient: [AccountInfo] 
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - dog_id: [String] 
/// - amount: [u64] 
pub fn handler(
	ctx: Context<DonateSol>,
	dog_id: String,
	amount: u64,
) -> Result<()> {
    // Implement your business logic here...
	
	Ok(())
}
