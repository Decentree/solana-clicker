import React from 'react'
import styled from 'styled-components'

type Props = {
    count: number
}

const CounterContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

const CounterText = styled.div`
    font-family: Permanent Marker;
    font-style: normal;
    font-weight: normal;
    font-size: 56px;
    line-height: 82px;
    color: #FFFFFF;
    `

const LabelText = styled.div`
    font-family: Inter;
    font-style: normal;
    font-weight: 800;
    font-size: 20px;
    line-height: 24px;
    background: -webkit-linear-gradient(#00FFA3, #1FFFF2);
    background: linear-gradient(#00FFA3, #1FFFF2);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: 16px;
    `


function Counter({ count }: Props) {
    return (
        <CounterContainer>
            <CounterText>{count}</CounterText>
            <LabelText>COINS</LabelText>
        </CounterContainer>
    )
}

export default Counter