pub mod common;

use std::str::FromStr;
use {
    common::{
		get_program_test,
		donation_program_ix_interface,
		csl_spl_token_ix_interface,
	},
    solana_program_test::tokio,
    solana_sdk::{
        account::Account, pubkey::Pubkey, rent::Rent, signature::Keypair, signer::Signer, system_program,
    },
};


#[tokio::test]
async fn donate_sol_ix_success() {
	let mut program_test = get_program_test();

	// PROGRAMS
	program_test.prefer_bpf(true);

	program_test.add_program(
		"account_compression",
		Pubkey::from_str("cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK").unwrap(),
		None,
	);

	program_test.add_program(
		"noop",
		Pubkey::from_str("noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV").unwrap(),
		None,
	);

	// DATA
	let dog_id: String = Default::default();
	let amount: u64 = Default::default();

	// KEYPAIR
	let donor_keypair = Keypair::new();

	// PUBKEY
	let donor_pubkey = donor_keypair.pubkey();
	let recipient_pubkey = Pubkey::new_unique();

	// EXECUTABLE PUBKEY
	let system_program_pubkey = Pubkey::from_str("11111111111111111111111111111111").unwrap();

	// PDA
	let (donation_record_pda, _donation_record_pda_bump) = Pubkey::find_program_address(
		&[
			b"donation",
			dog_id.as_bytes().as_ref(),
		],
		&donation_program::ID,
	);

	// ACCOUNT PROGRAM TEST SETUP
	program_test.add_account(
		donor_pubkey,
		Account {
			lamports: 1_000_000_000_000,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	// INSTRUCTIONS
	let (mut banks_client, _, recent_blockhash) = program_test.start().await;

	let ix = donation_program_ix_interface::donate_sol_ix_setup(
		&donor_keypair,
		donation_record_pda,
		recipient_pubkey,
		system_program_pubkey,
		&dog_id,
		amount,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
