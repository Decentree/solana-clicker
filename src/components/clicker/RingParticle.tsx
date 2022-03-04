import React from 'react'
import styled, { keyframes } from 'styled-components'

type Props = {
    startingPositionX: number,
    startingPositionY: number
}

const scaleAnimation = keyframes`
 0% { transform: scale(0); opacity: 1 }
 100% { transform: scale(2); opecity: 0 }
`

const Ring = styled.div<{ startingPositionX: number, startingPositionY: number }>`
    width: 196px;
    height: 196px;
    opacity: 0;
    position: absolute;
    left: calc(${props => props.startingPositionX}px - (196px / 2));
    top: calc(${props => props.startingPositionY}px - (196px / 2));
    order: double 1em transparent;
    border-radius: 50%;
    background-image: linear-gradient(white, green), 
                    linear-gradient(to right, green, gold);
    background-origin: border-box;
    background-clip: content-box, border-box;
    animation-name: ${scaleAnimation};
    animation-duration: 0.6s;
`

function RingParticle({ startingPositionX, startingPositionY, ...rest }: Props) {
    return (
        <Ring startingPositionX={startingPositionX} startingPositionY={startingPositionY}></Ring>
    )
}

export default RingParticle