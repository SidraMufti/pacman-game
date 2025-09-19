
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Maze from './Maze';
import Pacman from './Pacman';
import Ghost from './Ghost';
import Scoreboard from './Scoreboard';
import { useKeyPress } from '../hooks/useKeyPress';
import { useGameLoop } from '../hooks/useGameLoop';
import {
  MAZE_LAYOUT,
  PACMAN_START_POS,
  INITIAL_GHOSTS,
  TILE_SIZE,
  GAME_SPEED,
  SCORE_PELLET,
  SCORE_POWER_PELLET,
  SCORE_GHOST,
  POWER_PELLET_DURATION,
  GHOST_EATEN_DURATION,
} from '../constants';
// FIX: Import Direction as a value, not just a type.
import { Direction } from '../types';
import type { Position, Tile, GhostState } from '../types';
import { GameStatus, GhostMode } from '../types';
import { isWall, getNextPosition, getGhostNextMove } from '../utils/gameLogic';

const GameBoard: React.FC = () => {
  const [mazeData, setMazeData] = useState<Tile[][]>(MAZE_LAYOUT);
  const [pacmanPos, setPacmanPos] = useState<Position>(PACMAN_START_POS);
  // FIX: Use Direction enum member for initial state.
  const [pacmanDir, setPacmanDir] = useState<Direction>(Direction.STOP);
  const [nextDir, setNextDir] = useState<Direction>(Direction.STOP);
  const [ghosts, setGhosts] = useState<GhostState[]>(INITIAL_GHOSTS);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('pacmanHighScore') || 0));
  const [lives, setLives] = useState(3);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.READY);
  const [frightenedMode, setFrightenedMode] = useState(false);
  // FIX: Use `number` for browser `setTimeout` return type instead of `NodeJS.Timeout`.
  const [frightenedTimer, setFrightenedTimer] = useState<number | null>(null);

  const totalPellets = useMemo(() => MAZE_LAYOUT.flat().filter(tile => tile === 2 || tile === 3).length, []);

  const keyPressed = useKeyPress();

  useEffect(() => {
    if (keyPressed) {
      if(gameStatus === GameStatus.READY) {
        setGameStatus(GameStatus.PLAYING);
      }
      setNextDir(keyPressed);
    }
  }, [keyPressed, gameStatus]);
  
  const resetLevel = useCallback((isNewLife: boolean) => {
    setPacmanPos(PACMAN_START_POS);
    // FIX: Use Direction enum member to set state.
    setPacmanDir(Direction.STOP);
    setNextDir(Direction.STOP);
    setGhosts(INITIAL_GHOSTS.map(g => ({ ...g, mode: GhostMode.CHASE })));
    if (frightenedTimer) clearTimeout(frightenedTimer);
    setFrightenedMode(false);
    if (!isNewLife) {
        setGameStatus(GameStatus.READY);
    } else {
        setTimeout(() => setGameStatus(GameStatus.PLAYING), 1000);
    }
  }, [frightenedTimer]);

  const handleLoseLife = useCallback(() => {
    setLives(prev => prev - 1);
    setGameStatus(GameStatus.PAUSED);
    if (lives - 1 <= 0) {
      setGameStatus(GameStatus.GAME_OVER);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('pacmanHighScore', score.toString());
      }
    } else {
      resetLevel(true);
    }
  }, [lives, score, highScore, resetLevel]);

  const gameTick = useCallback(() => {
    if (gameStatus !== GameStatus.PLAYING) return;
    
    // Update Pacman position
    let currentDir = pacmanDir;
    let nextPos = getNextPosition(pacmanPos, nextDir);
    if (!isWall(nextPos)) {
      currentDir = nextDir;
    } else {
      nextPos = getNextPosition(pacmanPos, currentDir);
      if (isWall(nextPos)) {
        // FIX: Use Direction enum member for assignment.
        currentDir = Direction.STOP;
      }
    }
    
    // FIX: Use Direction enum member for comparison.
    if (currentDir !== Direction.STOP) {
      const finalPos = getNextPosition(pacmanPos, currentDir);
      setPacmanPos(finalPos);
      setPacmanDir(currentDir);

      // Pellet collision
      const tile = mazeData[finalPos.y][finalPos.x];
      if (tile === 2 || tile === 3) {
        const newMazeData = mazeData.map(row => [...row]);
        newMazeData[finalPos.y][finalPos.x] = 0;
        setMazeData(newMazeData);

        if (tile === 2) {
            setScore(s => s + SCORE_PELLET);
        } else { // Power Pellet
            setScore(s => s + SCORE_POWER_PELLET);
            setFrightenedMode(true);
            setGhosts(prev => prev.map(g => g.mode !== GhostMode.EATEN ? { ...g, mode: GhostMode.FRIGHTENED } : g));
            if (frightenedTimer) clearTimeout(frightenedTimer);
            const timer = setTimeout(() => {
                setFrightenedMode(false);
                setGhosts(prev => prev.map(g => g.mode !== GhostMode.EATEN ? { ...g, mode: GhostMode.CHASE } : g));
            }, POWER_PELLET_DURATION);
            setFrightenedTimer(timer as unknown as number);
        }
      }
    }

    // Update Ghost positions
    setGhosts(prevGhosts => prevGhosts.map(ghost => {
        if(ghost.mode === GhostMode.EATEN) {
          if (ghost.position.x === ghost.spawn.x && ghost.position.y === ghost.spawn.y) {
            return { ...ghost, mode: GhostMode.CHASE };
          }
        }

        const { nextPos, nextDir } = getGhostNextMove(ghost, pacmanPos);
        return { ...ghost, position: nextPos, direction: nextDir };
    }));

    // Ghost collision
    for (const ghost of ghosts) {
      if (ghost.position.x === pacmanPos.x && ghost.position.y === pacmanPos.y) {
        if (ghost.mode === GhostMode.FRIGHTENED) {
            setScore(s => s + SCORE_GHOST);
            setGhosts(prev => prev.map(g => g.id === ghost.id ? { ...g, mode: GhostMode.EATEN } : g));
        } else if (ghost.mode === GhostMode.CHASE) {
            handleLoseLife();
            return;
        }
      }
    }
    
    // Win condition
    const remainingPellets = mazeData.flat().filter(tile => tile === 2 || tile === 3).length;
    if (remainingPellets === 0) {
        setGameStatus(GameStatus.LEVEL_WON);
         if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('pacmanHighScore', score.toString());
        }
    }
  }, [gameStatus, pacmanDir, nextDir, pacmanPos, mazeData, ghosts, score, highScore, frightenedTimer, handleLoseLife]);

  useGameLoop(gameTick, gameStatus === GameStatus.PLAYING ? GAME_SPEED : Infinity);

  const boardWidth = MAZE_LAYOUT[0].length * TILE_SIZE;
  const boardHeight = MAZE_LAYOUT.length * TILE_SIZE;

  const restartGame = () => {
    setMazeData(MAZE_LAYOUT);
    setScore(0);
    setLives(3);
    resetLevel(false);
  }

  const GameOverlay = () => {
    let message = '';
    let subMessage = '';
    if (gameStatus === GameStatus.READY) {
      message = "READY!";
      subMessage = 'Press any arrow key to start';
    } else if (gameStatus === GameStatus.GAME_OVER) {
      message = "GAME OVER";
      subMessage = 'Click to play again';
    } else if (gameStatus === GameStatus.LEVEL_WON) {
      message = "YOU WIN!";
      subMessage = 'Click to play again';
    } else {
      return null;
    }
  
    return (
        <div 
          className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-10"
          onClick={(gameStatus === GameStatus.GAME_OVER || gameStatus === GameStatus.LEVEL_WON) ? restartGame : undefined}
        >
          <h2 className="text-5xl font-bold text-yellow-400">{message}</h2>
          {subMessage && <p className="text-xl text-white mt-4 animate-pulse">{subMessage}</p>}
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <Scoreboard score={score} highScore={highScore} lives={lives} />
      <div className="relative border-4 border-blue-500 shadow-lg shadow-blue-500/50" style={{ width: boardWidth, height: boardHeight }}>
        <GameOverlay />
        <Maze layout={mazeData} />
        <Pacman position={pacmanPos} direction={pacmanDir} />
        {ghosts.map(ghost => (
          <Ghost key={ghost.id} ghost={ghost} />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
