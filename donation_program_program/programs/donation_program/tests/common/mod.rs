use {
	donation_program::{
			entry,
			ID as PROGRAM_ID,
	},
	solana_sdk::{
		entrypoint::{ProcessInstruction, ProgramResult},
		pubkey::Pubkey,
	},
	anchor_lang::prelude::AccountInfo,
	solana_program_test::*,
};

// Type alias for the entry function pointer used to convert the entry function into a ProcessInstruction function pointer.
pub type ProgramEntry = for<'info> fn(
	program_id: &Pubkey,
	accounts: &'info [AccountInfo<'info>],
	instruction_data: &[u8],
) -> ProgramResult;

// Macro to convert the entry function into a ProcessInstruction function pointer.
#[macro_export]
macro_rules! convert_entry {
	($entry:expr) => {
		// Use unsafe block to perform memory transmutation.
		unsafe { core::mem::transmute::<ProgramEntry, ProcessInstruction>($entry) }
	};
}

pub fn get_program_test() -> ProgramTest {
	let program_test = ProgramTest::new(
		"donation_program",
		PROGRAM_ID,
		processor!(convert_entry!(entry)),
	);
	program_test
}
	
pub mod donation_program_ix_interface {

	use {
		solana_sdk::{
			hash::Hash,
			signature::{Keypair, Signer},
			instruction::Instruction,
			pubkey::Pubkey,
			transaction::Transaction,
		},
		donation_program::{
			ID as PROGRAM_ID,
			accounts as donation_program_accounts,
			instruction as donation_program_instruction,
		},
		anchor_lang::{
			prelude::*,
			InstructionData,
		}
	};

	pub fn donate_sol_ix_setup(
		donor: &Keypair,
		donation_record: Pubkey,
		recipient: Pubkey,
		system_program: Pubkey,
		dog_id: &String,
		amount: u64,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = donation_program_accounts::DonateSol {
			donor: donor.pubkey(),
			donation_record: donation_record,
			recipient: recipient,
			system_program: system_program,
		};

		let data = 	donation_program_instruction::DonateSol {
				dog_id: dog_id.clone(),
				amount,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&donor.pubkey()),
		);

		transaction.sign(&[
			&donor,
		], recent_blockhash);

		return transaction;
	}

	pub fn donate_token_ix_setup(
		donor: &Keypair,
		donation_record: Pubkey,
		token_mint: Pubkey,
		donor_token_account: Pubkey,
		recipient_token_account: Pubkey,
		system_program: Pubkey,
		source: Pubkey,
		destination: Pubkey,
		authority: &Keypair,
		csl_spl_token_v0_0_0: Pubkey,
		dog_id: &String,
		amount: u64,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = donation_program_accounts::DonateToken {
			donor: donor.pubkey(),
			donation_record: donation_record,
			token_mint: token_mint,
			donor_token_account: donor_token_account,
			recipient_token_account: recipient_token_account,
			system_program: system_program,
			source: source,
			destination: destination,
			authority: authority.pubkey(),
			csl_spl_token_v0_0_0: csl_spl_token_v0_0_0,
		};

		let data = 	donation_program_instruction::DonateToken {
				dog_id: dog_id.clone(),
				amount,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&donor.pubkey()),
		);

		transaction.sign(&[
			&donor,
			&authority,
		], recent_blockhash);

		return transaction;
	}

}

pub mod csl_spl_token_ix_interface {

	use {
		solana_sdk::{
			hash::Hash,
			signature::{Keypair, Signer},
			instruction::Instruction,
			pubkey::Pubkey,
			transaction::Transaction,
		},
		csl_spl_token::{
			ID as PROGRAM_ID,
			accounts as csl_spl_token_accounts,
			instruction as csl_spl_token_instruction,
		},
		anchor_lang::{
			prelude::*,
			InstructionData,
		}
	};

	declare_id!("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

}
