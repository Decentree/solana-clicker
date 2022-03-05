import { useWalletModal, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import useSolana from "../../hooks/useSolana";

type Props = {
  solana: ReturnType<typeof useSolana>;
};

const WalletDropdownContainer = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 800;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media (max-width: 800px) {
    order: 2;
  }
`;

const WalletButton = styled.div`
  background: rgba(17, 39, 51, 0.5);
  border: 1px solid #273441;
  box-sizing: border-box;
  backdrop-filter: blur(17px);
  border-radius: 9px;

  padding: 15px;
  font-size: 16px;
  line-height: 19px;
  color: #8ccff5;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  transition: all 0.2s ease-in-out;

  & img {
    display: inline-block;
    margin-left: 10px;
  }

  &:hover {
    background: rgba(17, 39, 51, 0.7);
  }
`;

const WalletDropdownContent = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 15px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  overflow: hidden;
  width: 350px;

  pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};
  top: ${({ isOpen }) => (isOpen ? "105px" : "60px")};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transition: ${({ isOpen }) =>
    isOpen ? "top 0.3s ease-in-out, opacity 0.2s ease-in-out 0.1s" : "top 0.5s ease-in-out, opacity 0.2s ease-in-out;"};
`;

const InputField = styled.input`
  width: 100%;
  margin-top: 5px;
  margin-bottom: 10px;
  background: #eceff4;
  border-radius: 12px;
  padding: 15px;
`;

const ActionButton = styled.div`
  background: linear-gradient(91.51deg, #b925ff 2.7%, #864dff 97.86%);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  font-weight: 800;
  font-size: 16px;
  line-height: 19px;
  text-transform: uppercase;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0px 4px 4px #b925ff33;
    transform: scale(1.02);
  }
`;

const DropdownTabs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const DropdownTab = styled.div<{ active: boolean }>`
  flex: 1;
  background: ${(props) => (props.active ? "#ffffff" : "#ECEFF4")};
  color: ${(props) => (props.active ? "#505E71" : "#abbacd")};
  padding: 15px;
  text-transform: uppercase;
  text-align: center;
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => (props.active ? "transparent" : "#CFD6DF")};
`;

const DropdownInner = styled.div`
  padding: 15px;
`;

const TextLight = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: #abbacd;
  margin-bottom: 15px;
`;

const CurrencySelect = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const CurrencySelectItem = styled.div<{ active: boolean }>`
  background: ${(props) => (props.active ? "#9a3fffb5" : "white")};
  color: ${(props) => (props.active ? "white" : "#505E71")};
  padding: 6px 20px;
  text-align: center;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  &:hover {
    background: ${(props) => (props.active ? "#9a3fff" : "#505E7122")};
  }
`;

function WalletDropdown({ solana }: Props) {
  const { visible, setVisible } = useWalletModal();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("deposit");
  const [activeToken, setActiveToken] = useState("SOL");
  const [transferAmount, setTransferAmount] = useState("1");

  const handleOpen = () => {
    if (solana.publicKey && solana.localKeypair?.publicKey) {
      setIsOpen(!isOpen);
    } else {
      setVisible(true);
    }
  };

  const handleAction = () => {
    if (solana.publicKey && solana.localKeypair?.publicKey) {
      if (activeTab === "deposit") {
        if (activeToken == "SOL") {
          solana.handleTransfer("wallet", solana.localKeypair?.publicKey.toBase58(), Number(transferAmount));
        } else {
          solana.handleTransferToken(
            "wallet",
            solana.localKeypair?.publicKey.toBase58(),
            activeToken,
            Number(transferAmount)
          );
        }
      } else if (activeTab === "withdraw") {
        if (activeToken == "SOL") {
          solana.handleTransfer("local", solana.publicKey.toBase58(), Number(transferAmount));
        } else {
          solana.handleTransferToken("local", solana.publicKey.toBase58(), activeToken, Number(transferAmount));
        }
      }
      setIsOpen(false);
    }
  };

  const currentBalance = useMemo(() => {
    if (activeToken == "SOL") {
      return activeTab == "deposit" ? solana.balance : solana.localKeypairBalance;
    } else if (activeToken == "COINS") {
      return activeTab == "deposit" ? solana.walletCurrencyTokenBalance : solana.currencyTokenBalance;
    } else if (activeToken == "LVL") {
      return activeTab == "deposit" ? solana.walletUpgradeTokenBalance : solana.upgradeTokenBalance;
    }
  }, [activeTab, activeToken, solana.balance, solana.localKeypairBalance]);

  return (
    <WalletDropdownContainer>
      <WalletButton onClick={handleOpen}>
        {solana.publicKey ? solana.localKeypairBalance + " SOL" : "Connect wallet"}
        <img src="/static/chevron-down.svg" alt="Dropdown icon" />
      </WalletButton>
      <WalletDropdownContent isOpen={isOpen}>
        <DropdownTabs>
          <DropdownTab active={activeTab == "deposit"} onClick={() => setActiveTab("deposit")}>
            Deposit
          </DropdownTab>
          <DropdownTab active={activeTab == "withdraw"} onClick={() => setActiveTab("withdraw")}>
            Withdraw
          </DropdownTab>
        </DropdownTabs>
        <DropdownInner>
          <CurrencySelect>
            <div>Token: </div>
            <CurrencySelectItem active={activeToken == "SOL"} onClick={() => setActiveToken("SOL")}>
              SOL
            </CurrencySelectItem>
            <CurrencySelectItem active={activeToken == "COINS"} onClick={() => setActiveToken("COINS")}>
              COINS
            </CurrencySelectItem>
            <CurrencySelectItem active={activeToken == "LVL"} onClick={() => setActiveToken("LVL")}>
              LVL
            </CurrencySelectItem>
          </CurrencySelect>
          <div>Amount:</div>
          <InputField value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
          <TextLight>
            Available: {currentBalance} {activeToken}
          </TextLight>
          <ActionButton onClick={handleAction}>Send</ActionButton>
        </DropdownInner>
      </WalletDropdownContent>
    </WalletDropdownContainer>
  );
}

export default WalletDropdown;
