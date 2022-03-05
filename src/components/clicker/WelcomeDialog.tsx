import React from "react";
import {
  Alert,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  AlertIcon,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function WelcomeDialog({ isOpen, setIsOpen }: Props) {
  const handleClose = () => setIsOpen(false);
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome to Solana Clicker</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mt="4">
            This is an experiment to see how the Solana ecosystem can be used to build a <b>blockchain-based game</b>.
          </Text>
          <Text my="4">
            By clicking the button in the middle, a transaction is sent to our contract and you're rewarded with a
            token. By buying upgrade tokens, you can upgrade your clicker and get more tokens per a single click.
          </Text>
          <Text mb="4">
            To send the transactions in the game, we're using a <b>local wallet in the browser</b>. You can transfer
            between your wallet and this wallet using the menu on the right.
          </Text>
          <Alert status="error">
            <AlertIcon />
            This site is running on DEVNET, please don't use your main wallet!
          </Alert>
          <Text mt="4">
            To get started, connect your wallet and <b>transfer some SOL to the game wallet</b>.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button isFullWidth={true} onClick={handleClose} colorScheme="purple">
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default WelcomeDialog;
