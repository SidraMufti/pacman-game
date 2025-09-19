
import type { Tile, Position } from './types';
import { GhostMode, Direction } from './types';

export const TILE_SIZE = 20; // in pixels
export const GAME_SPEED = 150; // ms per game tick

// 1 = Wall, 2 = Pellet, 3 = Power Pellet, 4 = Ghost Lair
export const MAZE_LAYOUT: Tile[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,3,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,3,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,3,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,2,1,1,1,0,1,0,1,1,1,2,1,1,1,1],
  [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
  [1,1,1,1,2,1,0,1,1,4,1,1,0,1,2,1,1,1,1],
  [2,2,2,2,2,0,0,1,4,4,4,1,0,0,2,2,2,2,2],
  [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
  [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
  [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,3,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,3,1],
  [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
  [1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

export const PACMAN_START_POS: Position = { x: 9, y: 16 };
export const GHOST_START_POS: Position[] = [
  { x: 8, y: 10 },
  { x: 9, y: 10 },
  { x: 10, y: 10 },
  { x: 9, y: 9 },
];

export const INITIAL_GHOSTS = [
  { id: 1, position: GHOST_START_POS[0], direction: Direction.UP, mode: GhostMode.CHASE, color: 'bg-red-500', spawn: GHOST_START_POS[0] },
  { id: 2, position: GHOST_START_POS[1], direction: Direction.UP, mode: GhostMode.CHASE, color: 'bg-pink-400', spawn: GHOST_START_POS[1] },
  { id: 3, position: GHOST_START_POS[2], direction: Direction.UP, mode: GhostMode.CHASE, color: 'bg-cyan-400', spawn: GHOST_START_POS[2] },
  { id: 4, position: GHOST_START_POS[3], direction: Direction.UP, mode: GhostMode.CHASE, color: 'bg-orange-400', spawn: GHOST_START_POS[3] },
];

export const MAZE_WIDTH = MAZE_LAYOUT[0].length;
export const MAZE_HEIGHT = MAZE_LAYOUT.length;
export const POWER_PELLET_DURATION = 8000; // 8 seconds
export const GHOST_EATEN_DURATION = 5000; // 5 seconds
export const SCORE_PELLET = 10;
export const SCORE_POWER_PELLET = 50;
export const SCORE_GHOST = 200;
