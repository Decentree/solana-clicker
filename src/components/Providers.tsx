import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Wallet } from "./elements/WalletProvider";

export const Providers = (props: React.PropsWithChildren<any>) => {
  return (
    <ChakraProvider>
      <Wallet>{props.children}</Wallet>
    </ChakraProvider>
  );
};

export default Providers;
