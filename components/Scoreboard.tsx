
import React from 'react';
import PacmanIcon from './icons/PacmanIcon';

interface ScoreboardProps {
  score: number;
  highScore: number;
  lives: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, highScore, lives }) => {
  return (
    <div className="w-full flex justify-between items-center text-xl font-bold p-2 text-white">
      <div>
        SCORE: <span className="text-yellow-400">{score}</span>
      </div>
      <div>
        HIGH SCORE: <span className="text-yellow-400">{highScore}</span>
      </div>
      <div className="flex items-center">
        LIVES: 
        <div className="flex ml-2">
          {Array.from({ length: Math.max(0, lives - 1) }).map((_, i) => (
            <PacmanIcon key={i} className="w-6 h-6 text-yellow-400" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
