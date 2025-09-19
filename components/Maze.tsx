
import React from 'react';
import type { Tile } from '../types';
import { TILE_SIZE } from '../constants';

interface MazeProps {
  layout: Tile[][];
}

const TileComponent: React.FC<{ tile: Tile }> = React.memo(({ tile }) => {
  switch (tile) {
    case 1: // WALL
      return <div className="w-full h-full bg-blue-800 border-blue-500 border"></div>;
    case 2: // PELLET
      return <div className="w-full h-full flex justify-center items-center">
               <div className="w-2 h-2 bg-yellow-200 rounded-full"></div>
             </div>;
    case 3: // POWER_PELLET
      return <div className="w-full h-full flex justify-center items-center">
               <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
             </div>;
    default: // EMPTY, GHOST_LAIR
      return <div className="w-full h-full"></div>;
  }
});

const Maze: React.FC<MazeProps> = ({ layout }) => {
  return (
    <div className="relative bg-black" style={{ 
      width: `${layout[0].length * TILE_SIZE}px`, 
      height: `${layout.length * TILE_SIZE}px`
    }}>
      {layout.map((row, y) => (
        <div key={y} className="flex">
          {row.map((tile, x) => (
            <div key={`${x}-${y}`} style={{ width: TILE_SIZE, height: TILE_SIZE }}>
              <TileComponent tile={tile} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Maze;
