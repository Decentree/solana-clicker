import React from 'react'
import styled from 'styled-components'

type Props = {
    children: React.ReactNode;
    coins: number;
    upgradeCost: number;
    onUpgradeClick: React.MouseEventHandler<HTMLButtonElement>;
}

const ProgressContainer = styled.div`
    position: relative;
`

const ProgressIndicator = styled.svg`
    position: absolute;
    left: -34px;
    top: -34px;
`

const Ring = styled.path<Props>`
    stroke-dasharray: 100;
    stroke-dashoffset: calc((${props => (props.coins)}/${props => (props.upgradeCost)}) * 100);
    stroke-width: 6px;
`

const UpgradeButton = styled.button`
    width: 154px;
    height: 50px;
    font-family: "Inter";
    background: linear-gradient(98.17deg, #FFC24D 43.72%, #FF1FDB 92.66%);
    border: 5px solid #1E2333;
    border-radius: 26px;
    color: white;
    position: absolute;
    z-index: 20;
    top: 166px;
    left: 20px;
    transition: transform 0.1s ease;

    &:hover {
        transform: scale(1.1);
    }
`

function Upgrade(props: Props) {
    return (
        <ProgressContainer>
            <ProgressIndicator width="264" height="218" viewBox="0 0 264 218" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="progress" x1="0%" y1="50%" x2="100%" y2="50%">
                        <stop offset="0%" stop-color="#1FFFF2" />
                        <stop offset="100%" stop-color="#00FFA3" />
                    </linearGradient>
                    <linearGradient id="upgrade" x1="0%" y1="50%" x2="100%" y2="50%">
                        <stop offset="0%" stop-color="#FF27D4" />
                        <stop offset="100%" stop-color="#FFC24D" />
                    </linearGradient>
                </defs>
                <path d="M230 215.89C249.326 193.335 261 164.031 261 132C261 60.7553 203.245 3 132 3C60.7553 3 3 60.7553 3 132C3 164.031 14.6743 193.335 34 215.89" stroke="url(#progress)" stroke-width="6" stroke-linejoin="round" />
                {
                    props.coins >= props.upgradeCost ? (
                        <path d="M230 215.89C249.326 193.335 261 164.031 261 132C261 60.7553 203.245 3 132 3C60.7553 3 3 60.7553 3 132C3 164.031 14.6743 193.335 34 215.89" stroke="url(#upgrade)" stroke-width="6" stroke-linejoin="round" />
                    ) : (
                        <Ring {...props} d="M230 215.89C249.326 193.335 261 164.031 261 132C261 60.7553 203.245 3 132 3C60.7553 3 3 60.7553 3 132C3 164.031 14.6743 193.335 34 215.89" stroke="#2C5369" stroke-width="6" pathLength="100" stroke-linejoin="round" />
                    )
                }
            </ProgressIndicator>
            {
                props.coins >= props.upgradeCost && (
                    <UpgradeButton onClick={props.onUpgradeClick}>
                        UPGRADE
                    </UpgradeButton>
                )
            }
            {
                props.children
            }
        </ProgressContainer>
    )
}

export default Upgrade