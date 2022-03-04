import React, { useEffect, useReducer } from "react";
import Head from "next/head";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import "../../i18n";
import { useTranslation } from "react-i18next";
import { Button, Heading, Input, Select, useToast } from "@chakra-ui/react";
import { useSolana } from "../../hooks/useSolana";

const Home: React.FC = () => {
  const { t } = useTranslation<string>();
  const [transferFrom, setTransferFrom] = React.useState<string>("phantom");
  const [transferAddress, setTransferAddress] = React.useState<string>("");
  const [transferAmount, setTransferAmount] = React.useState<string>("");

  const {
    publicKey,
    balance,
    localKeypair,
    localKeypairBalance,
    currencyTokenBalance,
    upgradeTokenBalance,
    handleTransfer,
    handleAirdrop,
    handleBuyUpgrade,
    transfersCounter,
    transfersPendingCounter,
  } = useSolana();

  return (
    <>
      <Head>
        <title>{t("seo_title")}</title>
        <meta name="description" content={t("seo_description")}></meta>
      </Head>

      <Heading my="5">Solana Wallet</Heading>

      <WalletMultiButton />

      {publicKey && <div>Public key: {publicKey?.toBase58()}</div>}
      {balance && <div>Balance: {balance} SOL</div>}

      <Heading my="5">Browser keypair</Heading>
      {localKeypair?.publicKey && <div>Public key: {localKeypair.publicKey?.toBase58()}</div>}
      <div>Balance: {localKeypairBalance} SOL</div>
      <div>Currency token balance: {currencyTokenBalance}</div>
      <div>Upgrade token balance: {upgradeTokenBalance}</div>

      <Heading>Transfer</Heading>
      <Select value={transferFrom} onChange={(e) => setTransferFrom(e.target.value)}>
        <option value="phantom">Phantom</option>
        <option value="local">Local wallet</option>
      </Select>

      <Input value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="Amount" />
      <Input value={transferAddress} onChange={(e) => setTransferAddress(e.target.value)} placeholder="Address" />
      <Button onClick={() => handleTransfer(transferFrom, transferAddress, Number(transferAmount))}>Transfer</Button>

      <Heading>Transactions pending: {transfersPendingCounter}</Heading>
      <Heading>Transactions complete: {transfersCounter}</Heading>

      <Heading>Contract</Heading>
      <Button onClick={handleAirdrop}>Airdrop</Button>
      <Button onClick={handleBuyUpgrade}>Buy upgrade</Button>
      <div>Upgrade price: {50 + 50 * Math.pow(upgradeTokenBalance, 2)}</div>
    </>
  );
};

export default Home;
