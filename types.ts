
export enum Tile {
  EMPTY = 0,
  WALL = 1,
  PELLET = 2,
  POWER_PELLET = 3,
  GHOST_LAIR = 4,
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  STOP = 'STOP',
}

export interface Position {
  x: number;
  y: number;
}

export enum GhostMode {
  CHASE = 'CHASE',
  SCATTER = 'SCATTER', // Not implemented in this version, but good for future expansion
  FRIGHTENED = 'FRIGHTENED',
  EATEN = 'EATEN',
}

export interface GhostState {
  id: number;
  position: Position;
  direction: Direction;
  mode: GhostMode;
  color: string;
  spawn: Position;
}

export enum GameStatus {
  READY = 'READY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  LEVEL_WON = 'LEVEL_WON',
  GAME_OVER = 'GAME_OVER',
}
