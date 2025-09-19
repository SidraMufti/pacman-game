
import { Direction, Tile } from '../types';
import type { Position, GhostState } from '../types';
import { MAZE_LAYOUT, MAZE_WIDTH, MAZE_HEIGHT } from '../constants';

export const isWall = (position: Position): boolean => {
  if (position.x < 0 || position.x >= MAZE_WIDTH || position.y < 0 || position.y >= MAZE_HEIGHT) {
    return true;
  }
  // FIX: Use Tile enum as a value, which requires a value import.
  const tile = MAZE_LAYOUT[position.y][position.x];
  return tile === Tile.WALL;
};

export const getNextPosition = (position: Position, direction: Direction): Position => {
  // FIX: Use Direction enum members in case statements for consistency.
  switch (direction) {
    case Direction.UP:
      // Handle tunnel logic
      if (position.y === 0 && position.x === 9) return { ...position, y: MAZE_HEIGHT - 1 };
      return { ...position, y: position.y - 1 };
    case Direction.DOWN:
       if (position.y === MAZE_HEIGHT - 1 && position.x === 9) return { ...position, y: 0 };
      return { ...position, y: position.y + 1 };
    case Direction.LEFT:
      // Handle tunnel logic
      if (position.x === 0) return { ...position, x: MAZE_WIDTH - 1 };
      return { ...position, x: position.x - 1 };
    case Direction.RIGHT:
      if (position.x === MAZE_WIDTH - 1) return { ...position, x: 0 };
      return { ...position, x: position.x + 1 };
    case Direction.STOP:
      return position;
  }
};

export const getOppositeDirection = (direction: Direction): Direction => {
  // FIX: Use Direction enum members for return values and case statements.
  switch (direction) {
    case Direction.UP: return Direction.DOWN;
    case Direction.DOWN: return Direction.UP;
    case Direction.LEFT: return Direction.RIGHT;
    case Direction.RIGHT: return Direction.LEFT;
    default: return Direction.STOP;
  }
};

export const getGhostNextMove = (ghost: GhostState, pacmanPos: Position): { nextPos: Position, nextDir: Direction } => {
  // FIX: Use Direction enum members instead of string literals for array initialization.
  const possibleMoves: Direction[] = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
  const validMoves: { direction: Direction; position: Position; distance: number }[] = [];

  const oppositeDir = getOppositeDirection(ghost.direction);

  for (const dir of possibleMoves) {
    if (dir === oppositeDir) continue; // Ghosts can't reverse direction unless they have to

    const nextPos = getNextPosition(ghost.position, dir);
    if (!isWall(nextPos)) {
      const distance = Math.hypot(nextPos.x - pacmanPos.x, nextPos.y - pacmanPos.y);
      validMoves.push({ direction: dir, position: nextPos, distance });
    }
  }

  // If no other valid move, allow reversal
  if (validMoves.length === 0) {
      const nextPos = getNextPosition(ghost.position, oppositeDir);
      if(!isWall(nextPos)) {
        const distance = Math.hypot(nextPos.x - pacmanPos.x, nextPos.y - pacmanPos.y);
        validMoves.push({ direction: oppositeDir, position: nextPos, distance });
      } else {
        return { nextPos: ghost.position, nextDir: ghost.direction }; // Stuck
      }
  }

  // Basic chase logic: pick move that gets closer to Pacman
  // Frightened logic: pick move that gets further away
  // Eaten logic: target spawn point
  let targetPos = pacmanPos;
  if(ghost.mode === 'FRIGHTENED') {
      // Pick the move that maximizes distance
      validMoves.sort((a, b) => b.distance - a.distance);
  } else if (ghost.mode === 'EATEN') {
      targetPos = ghost.spawn;
      // Recalculate distance to spawn
      validMoves.forEach(move => {
          move.distance = Math.hypot(move.position.x - targetPos.x, move.position.y - targetPos.y);
      });
      validMoves.sort((a, b) => a.distance - b.distance);
  } else { // Chase mode
      validMoves.sort((a, b) => a.distance - b.distance);
  }
  
  // Add some randomness if multiple moves have similar "goodness"
  const bestMove = validMoves[0];
  const tiedMoves = validMoves.filter(m => Math.abs(m.distance - bestMove.distance) < 0.1);
  const chosenMove = tiedMoves[Math.floor(Math.random() * tiedMoves.length)];

  return { nextPos: chosenMove.position, nextDir: chosenMove.direction };
};
