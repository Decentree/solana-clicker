
import React from 'react'
import RingParticle from './RingParticle'


export type RingParticleEvent = {
    spawnedAt: number,
    startingPositionX: number,
    startingPositionY: number
}

type Props = {
    particles: RingParticleEvent[]
}

function RingParticleSystem({ particles }: Props) {
    return (
        <div>
            {
                particles.map((particle) => {
                    return (<RingParticle key={particle.spawnedAt} startingPositionX={particle.startingPositionX} startingPositionY={particle.startingPositionY} />)
                })
            }
        </div>
    );
}

export default RingParticleSystem