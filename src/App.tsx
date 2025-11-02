import { useEffect } from 'react';
import { useGameStore } from './gameStore';
import { GameField } from './field/GameField';
import { GameButtons } from './buttons/GameButtons';

export function App() {
  const { tiles, gameOver, init, moveRight, moveLeft, moveUp, moveDown } = useGameStore();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          moveRight();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          moveUp();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          moveDown();
          break;
        case 'r':
        case 'R':
          init();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveLeft, moveRight, moveUp, moveDown, init]);

  return (
    <div className="game-field-container">
      <GameField tiles={tiles} />
      <GameButtons
        gameOver={gameOver}
        init={init}
        moveRight={moveRight}
        moveLeft={moveLeft}
        moveUp={moveUp}
        moveDown={moveDown}
      />
    </div>
  );
}
