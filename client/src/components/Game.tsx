import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../utils/GameEngine';

export const Game: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (gameRef.current && !gameEngineRef.current && !isInitialized.current) {
      console.log('Initializing GameEngine...');
      isInitialized.current = true;
      gameEngineRef.current = new GameEngine(gameRef.current);
    }

    return () => {
      if (gameEngineRef.current) {
        console.log('Destroying GameEngine...');
        gameEngineRef.current.destroy();
        gameEngineRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []);

  return (
    <div 
      ref={gameRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }} 
    />
  );
};