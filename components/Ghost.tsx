
import React from 'react';
import type { GhostState } from '../types';
import { TILE_SIZE } from '../constants';
import { GhostMode } from '../types';

interface GhostProps {
  ghost: GhostState;
}

const Ghost: React.FC<GhostProps> = ({ ghost }) => {
  const ghostStyle: React.CSSProperties = {
    top: `${ghost.position.y * TILE_SIZE}px`,
    left: `${ghost.position.x * TILE_SIZE}px`,
    width: `${TILE_SIZE}px`,
    height: `${TILE_SIZE}px`,
  };

  const isFrightened = ghost.mode === GhostMode.FRIGHTENED;

  return (
    <div
      className={`absolute transition-all duration-150 ease-linear rounded-t-full ${isFrightened ? 'bg-blue-700 animate-pulse' : ghost.color}`}
      style={ghostStyle}
    >
      <div className="absolute bottom-0 w-full h-1/2 flex justify-center items-center">
          <div className={`w-3 h-3 rounded-full ${isFrightened ? 'bg-pink-300' : 'bg-white'} relative -top-2 left-[-4px]`}>
            <div className="w-1.5 h-1.5 rounded-full bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div className={`w-3 h-3 rounded-full ${isFrightened ? 'bg-pink-300' : 'bg-white'} relative -top-2 left-[4px]`}>
            <div className="w-1.5 h-1.5 rounded-full bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
      </div>
    </div>
  );
};

export default Ghost;
