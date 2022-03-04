// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

import * as anchor from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { createMint, setAuthority } from "@solana/spl-token";
import { AirdropContract, IDL } from "../target/types/airdrop_contract";

module.exports = async function (provider) {
  // Configure client to use the provider.
  // provider = anchor.Provider.local("http://127.0.0.1:8899");
  anchor.setProvider(provider);

  const program = new anchor.Program(
    IDL,
    "7G4gVE1Besvc4A2d5d9TzeAJZmPbez2EHNd7WGvNxqPX",
    provider
  ) as anchor.Program<AirdropContract>;

  const authorityWallet = anchor.web3.Keypair.generate();

  let currencyMint, upgradeMint, accountPda, accountBump;

  // Get some currency from faucet first
  const airdropSignature = await program.provider.connection.requestAirdrop(authorityWallet.publicKey, 1e9);
  await program.provider.connection.confirmTransaction(airdropSignature);

  currencyMint = await createMint(
    program.provider.connection,
    authorityWallet,
    authorityWallet.publicKey,
    authorityWallet.publicKey,
    0
  );
  upgradeMint = await createMint(
    program.provider.connection,
    authorityWallet,
    authorityWallet.publicKey,
    authorityWallet.publicKey,
    0
  );

  [accountPda, accountBump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode("sneed"))],
    program.programId
  );
  const tx = await program.rpc.initialize(currencyMint, upgradeMint, {
    accounts: {
      authority: accountPda,
      signer: program.provider.wallet.publicKey,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  // Transfer authority to contract
  await setAuthority(
    program.provider.connection,
    authorityWallet,
    currencyMint,
    authorityWallet.publicKey,
    0,
    accountPda,
    [],
    {},
    TOKEN_PROGRAM_ID
  );
  await setAuthority(
    program.provider.connection,
    authorityWallet,
    upgradeMint,
    authorityWallet.publicKey,
    0,
    accountPda,
    [],
    {},
    TOKEN_PROGRAM_ID
  );

  console.log({
    currencyMint: currencyMint.toBase58(),
    upgradeMint: upgradeMint.toBase58(),
    accountPda: accountPda.toBase58(),
  });
};
