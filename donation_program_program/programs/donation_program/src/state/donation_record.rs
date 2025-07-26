
use anchor_lang::prelude::*;

#[account]
pub struct DonationRecord {
	pub dog_id: String,
	pub donor: Pubkey,
	pub amount: u64,
	pub token_mint: Option<Pubkey>,
	pub timestamp: i64,
}
