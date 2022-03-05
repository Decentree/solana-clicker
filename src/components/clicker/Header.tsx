import React from "react";
import styled from "styled-components";

type Props = { children: React.ReactNode };

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 1160px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px;
  position: absolute;
  flex-wrap: wrap;
`;

const Logo = styled.img`
  @media (max-width: 800px) {
    max-width: 40%;
  }
`;

function Header({ children }: Props) {
  return (
    <HeaderContainer>
      <Logo src="/static/solana-clicker-logo.png" />
      {children}
    </HeaderContainer>
  );
}

export default Header;
