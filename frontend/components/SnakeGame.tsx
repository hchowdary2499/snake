import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Point } from '../types';
import { GRID_SIZE, GAME_SPEED_MS } from '../constants';

interface SnakeGameProps {
  isActive: boolean;
}

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 }; // Moving Up

export const SnakeGame: React.FC<SnakeGameProps> = ({ isActive }) => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Use refs for mutable state that shouldn't trigger re-renders directly
  // or to avoid stale closures in the game loop interval.
  const directionRef = useRef<Point>(INITIAL_DIRECTION);
  const lastProcessedDirectionRef = useRef<Point>(INITIAL_DIRECTION);
  const foodRef = useRef<Point>({ x: 15, y: 5 });

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point = { x: 0, y: 0 };
    let valid = false;
    while (!valid) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      let onSnake = false;
      for (let i = 0; i < currentSnake.length; i++) {
        if (currentSnake[i].x === newFood.x && currentSnake[i].y === newFood.y) {
          onSnake = true;
          break;
        }
      }
      if (!onSnake) valid = true;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    lastProcessedDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    foodRef.current = generateFood(INITIAL_SNAKE);
  };

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;

      // Prevent default scrolling for game keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (isGameOver) {
          resetGame();
        } else {
          setIsPaused(p => !p);
        }
        return;
      }

      if (isGameOver || isPaused) return;

      const lastDir = lastProcessedDirectionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isGameOver, isPaused, generateFood]);

  // Game Loop
  useEffect(() => {
    if (!isActive || isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        // 1. Check Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // 2. Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // 3. Check Food Collision
        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          foodRef.current = generateFood(newSnake);
        } else {
          // Remove tail if no food eaten
          newSnake.pop();
        }

        lastProcessedDirectionRef.current = currentDir;
        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED_MS);
    return () => clearInterval(intervalId);
  }, [isActive, isGameOver, isPaused, generateFood, highScore]);

  const CELL_SIZE_PCT = 100 / GRID_SIZE;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      {/* Score Board */}
      <div className="w-full flex justify-between items-center mb-4 px-6 py-3 bg-gray-900/80 border border-neon-cyan/50 rounded-xl shadow-[0_0_15px_rgba(0,255,255,0.2)] backdrop-blur-sm">
        <div className="flex flex-col">
          <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Score</span>
          <span className="text-neon-cyan text-3xl font-black drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">High Score</span>
          <span className="text-neon-pink text-xl font-bold drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative w-full aspect-square bg-black/80 border-4 border-gray-800 rounded-lg shadow-[0_0_30px_rgba(57,255,20,0.15)] overflow-hidden">
        
        {/* Grid Background (Optional subtle grid lines) */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
            backgroundSize: `${CELL_SIZE_PCT}% ${CELL_SIZE_PCT}%`
          }}
        />

        {/* Food */}
        <div
          className="absolute bg-neon-pink rounded-full shadow-[0_0_15px_rgba(255,0,255,1)] animate-pulse-fast"
          style={{
            left: `${foodRef.current.x * CELL_SIZE_PCT}%`,
            top: `${foodRef.current.y * CELL_SIZE_PCT}%`,
            width: `${CELL_SIZE_PCT}%`,
            height: `${CELL_SIZE_PCT}%`,
            transform: 'scale(0.8)', // Make food slightly smaller than cell
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute rounded-sm transition-all duration-75 ${
                isHead 
                  ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10' 
                  : 'bg-neon-green shadow-[0_0_10px_rgba(57,255,20,0.6)] opacity-90'
              }`}
              style={{
                left: `${segment.x * CELL_SIZE_PCT}%`,
                top: `${segment.y * CELL_SIZE_PCT}%`,
                width: `${CELL_SIZE_PCT}%`,
                height: `${CELL_SIZE_PCT}%`,
                transform: isHead ? 'scale(1.05)' : 'scale(0.95)',
              }}
            />
          );
        })}

        {/* Overlays */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <h2 className="text-5xl font-black text-red-500 mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] tracking-widest uppercase">
              System Failure
            </h2>
            <p className="text-gray-300 mb-8 text-lg">Final Score: <span className="text-neon-cyan font-bold">{score}</span></p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-transparent border-2 border-neon-green text-neon-green font-bold rounded hover:bg-neon-green hover:text-black transition-all shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.8)] uppercase tracking-wider"
            >
              Reboot Sequence
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-neon-cyan drop-shadow-[0_0_15px_rgba(0,255,255,0.8)] tracking-widest uppercase animate-pulse">
              Paused
            </h2>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-gray-500 text-sm flex gap-4">
        <span><kbd className="bg-gray-800 px-2 py-1 rounded text-gray-300 border border-gray-700">WASD</kbd> or <kbd className="bg-gray-800 px-2 py-1 rounded text-gray-300 border border-gray-700">Arrows</kbd> to move</span>
        <span><kbd className="bg-gray-800 px-2 py-1 rounded text-gray-300 border border-gray-700">Space</kbd> to pause</span>
      </div>
    </div>
  );
};
