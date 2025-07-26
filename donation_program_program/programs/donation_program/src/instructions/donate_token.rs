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
	pub struct DonateToken<'info> {
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

		pub token_mint: Account<'info, Mint>,

		#[account(
			mut,
		)]
		/// CHECK: implement manual checks if needed
		pub donor_token_account: UncheckedAccount<'info>,

		#[account(
			mut,
		)]
		/// CHECK: implement manual checks if needed
		pub recipient_token_account: UncheckedAccount<'info>,

		pub system_program: Program<'info, System>,

		#[account(
			mut,
		)]
		/// CHECK: implement manual checks if needed
		pub source: UncheckedAccount<'info>,

		#[account(
			mut,
		)]
		/// CHECK: implement manual checks if needed
		pub destination: UncheckedAccount<'info>,

		#[account(
			owner=Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap(),
		)]
		pub authority: Signer<'info>,

		pub csl_spl_token_v0_0_0: Program<'info, Token>,
	}

	impl<'info> DonateToken<'info> {
		pub fn cpi_csl_spl_token_transfer(&self, amount: u64) -> Result<()> {
			anchor_spl::token::transfer(
				CpiContext::new(self.csl_spl_token_v0_0_0.to_account_info(), 
					anchor_spl::token::Transfer {
						from: self.source.to_account_info(),
						to: self.destination.to_account_info(),
						authority: self.authority.to_account_info()
					}
				),
				amount, 
			)
		}
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
pub fn handler(
	ctx: Context<DonateToken>,
	dog_id: String,
	amount: u64,
) -> Result<()> {
    // Implement your business logic here...
	
	// Cpi calls wrappers
	ctx.accounts.cpi_csl_spl_token_transfer(
		Default::default(),
	)?;

	Ok(())
}
