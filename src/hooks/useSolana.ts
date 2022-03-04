import React, { useEffect, useReducer } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { Keypair, SystemProgram, Transaction, Signer, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import * as bs58 from "bs58";
import { Program, Provider, BN, web3 } from "@project-serum/anchor";

import AIRDROP_CONTRACT_IDL from "../idl/airdrop_contract.json";
import useCounter from "./useCounter";

const SOL_LAMPORTS = 1000000000;
const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

const ACCOUNTS = {
  authority: new PublicKey("8HbqmAy2GXDVfE67zWvhVLwEQzaVY2njoDNzAHbaBUJ7"),
  currencyMint: new PublicKey("F5p8Uke4ELFigJEn1RiWGzQ9mz7KhN64CYXzDnFdabXz"),
  upgradeMint: new PublicKey("DC1HjGuQg3wSYsZzd6L7J8amSge8aWk9HLc1e45tadmc"),
  tokenProgram: TOKEN_PROGRAM_ID,
  associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  rent: web3.SYSVAR_RENT_PUBKEY,
  systemProgram: web3.SystemProgram.programId,
};

export const useSolana = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { connected, publicKey, sendTransaction, signAllTransactions } = wallet;
  const [balance, setBalance] = React.useState<number>(0);
  const [localKeypair, setLocalKeypair] = React.useState<Keypair | null>();
  const [localKeypairBalance, setLocalKeypairBalance] = React.useState<number>(0);
  const [currencyTokenBalance, setCurrencyTokenBalance] = React.useState<number>(0);
  const [upgradeTokenBalance, setUpgradeTokenBalance] = React.useState<number>(0);
  const [transfersCounter, transfersCounterUpdate] = useCounter();
  const [transfersPendingCounter, transfersPendingCounterUpdate] = useCounter();

  const load = async () => {
    if (publicKey) {
      setBalance((await connection.getBalance(publicKey)) / SOL_LAMPORTS);
    }
    if (localKeypair?.publicKey) {
      setLocalKeypairBalance((await connection.getBalance(localKeypair.publicKey)) / SOL_LAMPORTS);
      const tokenBalances = await connection.getParsedTokenAccountsByOwner(localKeypair.publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });
      setCurrencyTokenBalance(
        tokenBalances.value.find((t) => t.account.data.parsed.info.mint == ACCOUNTS.currencyMint)?.account.data.parsed
          .info.tokenAmount.amount || 0
      );
      setUpgradeTokenBalance(
        tokenBalances.value.find((t) => t.account.data.parsed.info.mint == ACCOUNTS.upgradeMint)?.account.data.parsed
          .info.tokenAmount.amount || 0
      );
    } else {
      if (localStorage.getItem("localKeypair")) {
        const keypair = Keypair.fromSecretKey(bs58.decode(localStorage.getItem("localKeypair") || ""));
        setLocalKeypair(keypair);
      } else {
        const keypair = Keypair.generate();
        localStorage.setItem("localKeypair", bs58.encode(Buffer.from(keypair.secretKey)));
        setLocalKeypair(keypair);
      }
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [connection, publicKey, localKeypair]);

  const handleTransfer = async (transferFrom: string, transferAddress: string, transferAmount: number) => {
    const selectedKey = transferFrom == "local" ? localKeypair?.publicKey : publicKey;
    if (!selectedKey) throw new WalletNotConnectedError();
    transfersPendingCounterUpdate({ type: "increment" });

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: selectedKey,
        toPubkey: new PublicKey(transferAddress),
        lamports: transferAmount * SOL_LAMPORTS,
      })
    );
    console.log(transaction);

    let signature;
    if (transferFrom == "local" && localKeypair) {
      signature = await connection.sendTransaction(transaction, [localKeypair], {});
    } else {
      signature = await sendTransaction(transaction, connection);
    }
    await connection.confirmTransaction(signature, "processed");
    transfersCounterUpdate({ type: "increment" });
    transfersPendingCounterUpdate({ type: "decrement" });
  };

  const handleAirdrop = async () => {
    if (!localKeypair?.publicKey) throw new WalletNotConnectedError();

    const currencyTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      localKeypair,
      ACCOUNTS.currencyMint,
      localKeypair.publicKey
    );
    transfersPendingCounterUpdate({ type: "increment" });
    const upgradeTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      localKeypair,
      ACCOUNTS.upgradeMint,
      localKeypair.publicKey
    );
    const upgradeTokenBalance = Number(upgradeTokenAccount.amount);

    //@ts-ignore
    const provider = new Provider(connection, { publicKey: localKeypair.publicKey }, {});
    //@ts-ignore
    const program = new Program(AIRDROP_CONTRACT_IDL, AIRDROP_CONTRACT_IDL.metadata.address, provider);
    //@ts-ignore
    const inst = program.instruction.airdropWithUpgrade(new BN(upgradeTokenBalance), {
      accounts: {
        signer: localKeypair?.publicKey,
        currencyAccount: currencyTokenAccount.address,
        upgradeAccount: upgradeTokenAccount.address,
        ...ACCOUNTS,
      },
      signers: [localKeypair],
    });
    console.log(inst);
    const transaction = new Transaction().add(inst);
    const signature = await connection.sendTransaction(transaction, [localKeypair], {});
    await connection.confirmTransaction(signature, "processed");
    transfersCounterUpdate({ type: "increment" });
    transfersPendingCounterUpdate({ type: "decrement" });
    load();
  };

  const handleBuyUpgrade = async () => {
    if (!localKeypair?.publicKey) throw new WalletNotConnectedError();

    const currencyTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      localKeypair,
      ACCOUNTS.currencyMint,
      localKeypair.publicKey
    );
    transfersPendingCounterUpdate({ type: "increment" });
    const upgradeTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      localKeypair,
      ACCOUNTS.upgradeMint,
      localKeypair.publicKey
    );
    const upgradeTokenBalance = Number(upgradeTokenAccount.amount);

    //@ts-ignore
    const provider = new Provider(connection, { publicKey: localKeypair.publicKey }, {});
    //@ts-ignore
    const program = new Program(AIRDROP_CONTRACT_IDL, AIRDROP_CONTRACT_IDL.metadata.address, provider);
    //@ts-ignore
    const inst = program.instruction.buyUpgrade(new BN(upgradeTokenBalance), {
      accounts: {
        signer: localKeypair?.publicKey,
        currencyAccount: currencyTokenAccount.address,
        upgradeAccount: upgradeTokenAccount.address,
        ...ACCOUNTS,
      },
      signers: [localKeypair],
    });
    console.log(inst);
    const transaction = new Transaction().add(inst);
    const signature = await connection.sendTransaction(transaction, [localKeypair], {});
    await connection.confirmTransaction(signature, "processed");
    transfersCounterUpdate({ type: "increment" });
    transfersPendingCounterUpdate({ type: "decrement" });
    load();
  };

  const handleClearKey = () => {
    localStorage.removeItem("localKeypair");
    setLocalKeypair(null);
    load();
  };

  return {
    publicKey,
    balance,
    localKeypair,
    localKeypairBalance,
    currencyTokenBalance,
    upgradeTokenBalance,
    handleTransfer,
    handleClearKey,
    transfersCounter,
    transfersPendingCounter,
    handleAirdrop,
    handleBuyUpgrade,
  };
};

export default useSolana;
