import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene';
import type { GameConfig } from '../types';

export class GameEngine {
  private game: Phaser.Game;
  private config: GameConfig;

  constructor(parent: string | HTMLElement) {
    this.config = {
      width: 800,
      height: 600,
      tileSize: 16,
      mapWidth: 100,
      mapHeight: 100
    };

    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: this.config.width,
      height: this.config.height,
      parent: parent,
      backgroundColor: '#222222',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [GameScene],
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    this.game = new Phaser.Game(gameConfig);
  }

  public destroy(): void {
    if (this.game) {
      this.game.destroy(true);
    }
  }

  public getConfig(): GameConfig {
    return this.config;
  }
}