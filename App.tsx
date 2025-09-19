
import React from 'react';
import GameBoard from './components/GameBoard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-mono">
      <header className="mb-4">
        <h1 className="text-4xl font-bold text-yellow-400 tracking-widest">REACT PAC-MAN</h1>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <GameBoard />
      </main>
      <footer className="mt-4 text-xs text-gray-500">
        <p>Use Arrow Keys to Move</p>
      </footer>
    </div>
  );
};

export default App;
