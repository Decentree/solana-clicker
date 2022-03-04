import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createMint,
  getMint,
  setAuthority,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAccount,
} from "@solana/spl-token";
import { AirdropContract } from "../target/types/airdrop_contract";

describe("airdrop-contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.AirdropContract as Program<AirdropContract>;
  const authorityWallet = anchor.web3.Keypair.generate();

  let currencyMint, upgradeMint, accountPda, accountBump;

  before(async () => {
    // Get some currency from faucet first
    const airdropSignature = await program.provider.connection.requestAirdrop(
      authorityWallet.publicKey,
      1e9
    );
    await program.provider.connection.confirmTransaction(airdropSignature);
  });

  it("Is initialized!", async () => {
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
    console.log("Your transaction signature", tx);

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
  });

  it("Airdrops a token", async () => {
    // Create the token accounts
    const currencyTokenAccount = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      authorityWallet,
      currencyMint,
      authorityWallet.publicKey
    );
    const updgradesTokenAccount = await getOrCreateAssociatedTokenAccount(
      program.provider.connection,
      authorityWallet,
      upgradeMint,
      authorityWallet.publicKey
    );

    // Mint a token
    const accounts = {
      signer: authorityWallet.publicKey,
      authority: accountPda,
      currencyMint: currencyMint,
      currencyAccount: currencyTokenAccount.address,
      // const
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    };
    const tx = await program.rpc.airdrop({
      accounts,
      signers: [authorityWallet],
    });
    console.log("Airdrop transaction signature", tx);

    // Mint another token
    const tx2 = await program.rpc.airdrop({
      accounts,
      signers: [authorityWallet],
    });
    console.log("Airdrop transaction2 signature", tx2);

    // Buy an upgrade
    let upgradesBalance = (
      await getAccount(
        program.provider.connection,
        updgradesTokenAccount.address
      )
    ).amount;
    try {
      const txBuyUpgrade = await program.rpc.buyUpgrade(
        new anchor.BN(Number(upgradesBalance)),
        {
          accounts: {
            ...accounts,
            upgradeMint: upgradeMint,
            upgradeAccount: updgradesTokenAccount.address,
          },
          signers: [authorityWallet],
        }
      );
    } catch (error) {
      console.log(error);
    }

    // Check upgrades balance
    upgradesBalance = (
      await getAccount(
        program.provider.connection,
        updgradesTokenAccount.address
      )
    ).amount;
    console.log("Updgrades balance", new anchor.BN(Number(upgradesBalance)));

    // Mint with an upgrade
    const txExtra = await program.rpc.airdropWithUpgrade(
      new anchor.BN(Number(upgradesBalance)),
      {
        accounts: {
          ...accounts,
          upgradeMint: upgradeMint,
          upgradeAccount: updgradesTokenAccount.address,
        },
        signers: [authorityWallet],
      }
    );
    console.log("Airdrop transaction extra signature", txExtra);

    // Get final balance
    const finalBalance = await getAccount(
      program.provider.connection,
      currencyTokenAccount.address
    );
    console.log("Final balance", finalBalance);
  });
});
