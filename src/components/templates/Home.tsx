import React, { useEffect, useReducer } from "react";
import Head from "next/head";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import "../../i18n";
import { useTranslation } from "react-i18next";
import { Button, Heading, Input, Select, useToast } from "@chakra-ui/react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { Keypair, SystemProgram, Transaction, Signer, PublicKey } from "@solana/web3.js";
import * as bs58 from "bs58";

const SOL_LAMPORTS = 1000000000;

const useCounter = () => {
  return useReducer((state: number, action: { type: "increment" | "decrement"; amount?: number }) => {
    switch (action.type) {
      case "increment":
        return state + (action.amount ?? 1);
      case "decrement":
        return state - (action.amount ?? 1);
      default:
        return state;
    }
  }, 0);
};

const Home: React.FC = () => {
  const { t } = useTranslation<string>();
  const { connection } = useConnection();
  const { connected, publicKey, sendTransaction, signAllTransactions } = useWallet();
  const [balance, setBalance] = React.useState<number>(0);
  const [transferAddress, setTransferAddress] = React.useState<string>("");
  const [transferAmount, setTransferAmount] = React.useState<string>("");
  const [transferFrom, setTransferFrom] = React.useState<string>("phantom");
  const [localKeypair, setLocalKeypair] = React.useState<Keypair | null>();
  const [localKeypairBalance, setLocalKeypairBalance] = React.useState<number>(0);
  const [transfersCounter, transfersCounterUpdate] = useCounter();
  const [transfersPendingCounter, transfersPendingCounterUpdate] = useCounter();

  const toast = useToast();

  const load = async () => {
    if (publicKey) {
      setBalance(await connection.getBalance(publicKey));
    }
    if (localKeypair?.publicKey) {
      setLocalKeypairBalance(await connection.getBalance(localKeypair.publicKey));
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

  const handleTestTransfer = async () => {
    const selectedKey = transferFrom == "local" ? localKeypair?.publicKey : publicKey;
    if (!selectedKey) throw new WalletNotConnectedError();
    transfersPendingCounterUpdate({ type: "increment" });

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: selectedKey,
        toPubkey: new PublicKey(transferAddress),
        lamports: Number(transferAmount) * SOL_LAMPORTS,
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

  const handleTestTransfer100 = async () => {
    if (!localKeypair?.publicKey) throw new WalletNotConnectedError();

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: localKeypair.publicKey,
        toPubkey: new PublicKey(transferAddress),
        lamports: Number(transferAmount) * SOL_LAMPORTS,
      })
    );
    transaction.feePayer = localKeypair.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    const transactions = Array.from({ length: 100 }, () => transaction);
    transactions.forEach(async (tx: any) => {
      try {
        transfersPendingCounterUpdate({ type: "increment" });
        const send = await connection.sendTransaction(transaction, [localKeypair], {});
        console.log(send);
        const confirm = await connection.confirmTransaction(bs58.encode(tx.signatures[0].signature), "processed");
        console.log(confirm);
        transfersPendingCounterUpdate({ type: "decrement" });
        transfersCounterUpdate({ type: "increment" });
      } catch (e) {
        // console.log(e);
      }
    });
  };

  const handleClearKey = () => {
    localStorage.removeItem("localKeypair");
    setLocalKeypair(null);
    load();
  };

  return (
    <>
      <Head>
        <title>{t("seo_title")}</title>
        <meta name="description" content={t("seo_description")}></meta>
      </Head>

      <Heading my="5">Solana Wallet</Heading>

      <WalletMultiButton />

      {publicKey && <div>Public key: {publicKey?.toBase58()}</div>}
      {balance && <div>Balance: {balance / SOL_LAMPORTS} SOL</div>}

      <Heading my="5">Browser keypair</Heading>
      {localKeypair?.publicKey && <div>Public key: {localKeypair.publicKey?.toBase58()}</div>}
      <div>Balance: {localKeypairBalance / SOL_LAMPORTS} SOL</div>

      <Heading>Transfer</Heading>
      <Select value={transferFrom} onChange={(e) => setTransferFrom(e.target.value)}>
        <option value="phantom">Phantom</option>
        <option value="local">Local wallet</option>
      </Select>

      <Input value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="Amount" />
      <Input value={transferAddress} onChange={(e) => setTransferAddress(e.target.value)} placeholder="Address" />
      <Button onClick={handleTestTransfer}>Transfer</Button>
      <Button onClick={handleTestTransfer100} disabled={transferFrom != "local"}>
        Transfer 100x times
      </Button>

      <Heading>Transactions pending: {transfersPendingCounter}</Heading>
      <Heading>Transactions complete: {transfersCounter}</Heading>
    </>
  );
};

export default Home;
