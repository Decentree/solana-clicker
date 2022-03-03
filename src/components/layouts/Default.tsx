import React from "react";
import { Container } from "@chakra-ui/react";

const Default = ({ children }: React.PropsWithChildren<any>) => {
  return <Container>{children}</Container>;
};

export default Default;
