import React from 'react'
import styled from 'styled-components'

import SolanaIconImage from '../../assets/images/solana-icon.png';
import RingParticle from './RingParticle';

type Props = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const CookieContainer = styled.button`
    width: 196px;
    height: 196px;
    border-radius: 50%;
    background: linear-gradient(340.16deg, rgba(235, 251, 255, 0) 11.63%, rgba(210, 247, 255, 0.217) 88.53%), linear-gradient(77.29deg, rgba(251, 49, 255, 0.9) 9.18%, rgba(255, 255, 255, 0) 59.86%), radial-gradient(50% 50% at 50% 50%, rgba(185, 37, 255, 0.69) 40.62%, rgba(31, 255, 242, 0.69) 100%);
    box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(29px);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-size: 120% 120%;
    
    &:hover {
        transform: scale(1.1);
        background-position: 0% 0%;
        background-size: 100% 100%;
    }

    &:active {
        transform: scale(0.9);
        background-position: 0% 0%;
        background-size: 100% 100%;
    }
`

const SolanaIcon = styled.img`
    width: 74px;
    height: 56px;
`

function Cookie({ onClick }: Props) {
    return (
        <div>
            <CookieContainer onClick={onClick}>
                <SolanaIcon src="/static/solana-icon.png"></SolanaIcon>
            </CookieContainer>
        </div>
    )
}

export default Cookie