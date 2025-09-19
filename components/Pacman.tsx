
import React, { useState, useEffect } from 'react';
import type { Position, Direction } from '../types';
import { TILE_SIZE } from '../constants';

interface PacmanProps {
  position: Position;
  direction: Direction;
}

const Pacman: React.FC<PacmanProps> = ({ position, direction }) => {
  const [mouthOpen, setMouthOpen] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setMouthOpen(prev => !prev);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  const rotationMap: { [key in Direction]: string } = {
    UP: '-rotate-90',
    DOWN: 'rotate-90',
    LEFT: 'rotate-180',
    RIGHT: 'rotate-0',
    STOP: 'rotate-0',
  };

  const mouthClass = mouthOpen ? 'pacman-mouth-open' : 'pacman-mouth-closed';

  const pacmanStyle: React.CSSProperties = {
    top: `${position.y * TILE_SIZE}px`,
    left: `${position.x * TILE_SIZE}px`,
    width: `${TILE_SIZE}px`,
    height: `${TILE_SIZE}px`,
  };

  return (
    <>
      <style>{`
        .pacman-mouth-open {
          clip-path: polygon(0% 0%, 100% 0%, 100% 40%, 50% 50%, 100% 60%, 100% 100%, 0% 100%, 0% 60%, 50% 50%, 0% 40%);
        }
        .pacman-mouth-closed {
          clip-path: circle(50% at 50% 50%);
        }
      `}</style>
      <div
        className={`absolute bg-yellow-400 transition-transform duration-100 ease-linear ${rotationMap[direction]} ${mouthClass}`}
        style={pacmanStyle}
      ></div>
    </>
  );
};

export default Pacman;
