import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import useSolana from "../../hooks/useSolana";

type Props = {
  solana: ReturnType<typeof useSolana>;
};

type MatrixParticleEvent = {
  spawnedAt: number;
  startingPosition: number;
  tx: string;
};

const scaleAnimation = keyframes`
 0% { left: -180%; }
 100% { left: 110%; }
`;

const MatrixParticle = styled.div<{ startingPosition: number }>`
  position: absolute;
  color: white;
  font-family: "Fira Code", monospace;
  font-size: 22px;
  animation: ${scaleAnimation} 6s cubic-bezier(0.1, -0.6, 0.2, 0);
  left: 110%;
  top: ${(props) => props.startingPosition}px;
  opacity: 0.5;
`;

function MatrixParticleSystem({ solana }: Props) {
  if (typeof window === "undefined") return null;

  const [matrixParticles, setMatrixParticles] = useState<MatrixParticleEvent[]>([]);

  const spawnParticle = (tx: string) => {
    setMatrixParticles([
      ...matrixParticles,
      {
        spawnedAt: Date.now(),
        startingPosition: 150 + (Math.round(Math.random() * 30) / 30) * (window.innerHeight - 200),
        tx,
      },
    ]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // TODO this is broken :(
      // setMatrixParticles(matrixParticles.filter((p) => p.spawnedAt + 10000 > Date.now()));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (solana.transactionsHistory) spawnParticle(solana.transactionsHistory);
  }, [solana.transactionsHistory]);

  return (
    <>
      {matrixParticles.map((it) => (
        <MatrixParticle key={it.spawnedAt} startingPosition={it.startingPosition}>
          {it.tx}
        </MatrixParticle>
      ))}
    </>
  );
}

export default MatrixParticleSystem;
