
import { useState, useEffect, useCallback } from 'react';
// FIX: Import Direction as a value to access enum members.
import { Direction } from '../types';
import type { } from '../types';

export const useKeyPress = (): Direction | null => {
  const [keyPressed, setKeyPressed] = useState<Direction | null>(null);

  const downHandler = useCallback(({ key }: KeyboardEvent) => {
    let direction: Direction | null = null;
    switch (key) {
      // FIX: Use Direction enum members instead of string literals.
      case 'ArrowUp':
        direction = Direction.UP;
        break;
      case 'ArrowDown':
        direction = Direction.DOWN;
        break;
      case 'ArrowLeft':
        direction = Direction.LEFT;
        break;
      case 'ArrowRight':
        direction = Direction.RIGHT;
        break;
    }
    if (direction) {
      setKeyPressed(direction);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [downHandler]);

  return keyPressed;
};
