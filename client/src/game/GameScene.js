import Phaser from 'phaser'
import { Player } from './Player'
import { WorldMap } from './WorldMap'
import { Session } from "@croquet/croquet"
import { RPGGameModel } from './CroquetModels'
import { RPGGameView } from './CroquetView'

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
    this.player = null
    this.worldMap = null
    this.cursors = null
    this.playerName = ''
    this.croquetSession = null
    this.croquetView = null
    this.lastPlayerUpdate = 0
    this.playerCountText = null
    this.chatMessages = []
  }

  preload() {
    // Create simple sprites directly in preload
    this.createSprites()
    
    // Load tilemap data from public directory
    this.load.tilemapTiledJSON('map', '/assets/tilemaps/basic-map.json')
    
    // Wait for assets to load
    this.load.once('complete', () => {
      console.log('Assets loaded successfully')
    })
  }

  createSprites() {
    // Create player sprite texture
    const playerCanvas = document.createElement('canvas')
    playerCanvas.width = 16
    playerCanvas.height = 16
    const playerCtx = playerCanvas.getContext('2d')
    playerCtx.fillStyle = '#00ff00'
    playerCtx.fillRect(0, 0, 16, 16)
    this.load.image('player', playerCanvas.toDataURL())

    // Create tileset texture
    const tileCanvas = document.createElement('canvas')
    tileCanvas.width = 32
    tileCanvas.height = 32
    const tileCtx = tileCanvas.getContext('2d')
    
    // Draw grass tile
    tileCtx.fillStyle = '#4a7c59'
    tileCtx.fillRect(0, 0, 32, 32)
    tileCtx.fillStyle = '#5d8f6a'
    tileCtx.fillRect(4, 4, 24, 24)
    
    // Add some texture
    for (let i = 0; i < 8; i++) {
      tileCtx.fillStyle = '#6ba077'
      tileCtx.fillRect(Math.floor(Math.random() * 28) + 2, Math.floor(Math.random() * 28) + 2, 2, 2)
    }
    
    this.load.image('tileset', tileCanvas.toDataURL())
  }

  async create() {
    // Create world map
    this.worldMap = new WorldMap(this)
    
    // Create player
    this.player = new Player(this, 400, 300)
    
    // Create camera follow with smooth following
    this.cameras.main.startFollow(this.player.sprite, true, 0.05, 0.05)
    this.cameras.main.setZoom(1.5) // Zoom in for better view
    
    // Set world bounds
    this.physics.world.setBounds(0, 0, this.worldMap.mapWidth, this.worldMap.mapHeight)
    this.cameras.main.setBounds(0, 0, this.worldMap.mapWidth, this.worldMap.mapHeight)
    
    // Configure camera deadzone for smoother following
    this.cameras.main.setDeadzone(50, 50)
    
    // Create input
    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = this.input.keyboard.addKeys('W,S,A,D')
    
    // Create UI elements
    this.createUI()
    
    // Initialize Croquet multiplayer
    await this.initializeCroquet()
  }

  createUI() {
    // Add player name text
    this.playerNameText = this.add.text(16, 16, `Player: ${this.playerName}`, {
      fontSize: '16px',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 8, right: 8, top: 4, bottom: 4 }
    })
    this.playerNameText.setScrollFactor(0)
    
    // Add player count text
    this.playerCountText = this.add.text(16, 50, 'Players: 1', {
      fontSize: '14px',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 8, right: 8, top: 4, bottom: 4 }
    })
    this.playerCountText.setScrollFactor(0)

    // Add connection status text
    this.connectionText = this.add.text(16, 84, 'Connecting...', {
      fontSize: '14px',
      fill: '#ffff00',
      backgroundColor: '#000000',
      padding: { left: 8, right: 8, top: 4, bottom: 4 }
    })
    this.connectionText.setScrollFactor(0)
  }

  async initializeCroquet() {
    try {
      const apiKey = import.meta.env.VITE_CROQUET_API_KEY || 'test-key'
      const sessionName = 'rpg-game-session'
      
      this.croquetSession = await Session.join({
        apiKey: apiKey,
        name: sessionName,
        password: 'optional-password',
        model: RPGGameModel,
        view: RPGGameView,
        tps: 30 // ticks per second
      })
      
      this.croquetView = this.croquetSession.view
      this.croquetView.setGameScene(this)
      
      // Update connection status
      this.connectionText.setText('Connected')
      this.connectionText.setFill('#00ff00')
      
      console.log('Croquet session joined successfully')
    } catch (error) {
      console.error('Failed to join Croquet session:', error)
      this.connectionText.setText('Connection Failed')
      this.connectionText.setFill('#ff0000')
    }
  }

  update() {
    if (this.player) {
      const oldPos = { x: this.player.sprite.x, y: this.player.sprite.y }
      const oldFacing = this.player.facing
      const oldAnimState = this.player.animationState
      
      this.player.update(this.cursors, this.wasd)
      
      // Send updates to other players if position or state changed
      if (this.croquetView && 
          (Math.abs(oldPos.x - this.player.sprite.x) > 1 || 
           Math.abs(oldPos.y - this.player.sprite.y) > 1 || 
           oldFacing !== this.player.facing || 
           oldAnimState !== this.player.animationState)) {
        
        const now = this.time.now
        if (now - this.lastPlayerUpdate > 50) { // Throttle updates to 20fps
          this.croquetView.publishPlayerMove(
            this.player.sprite.x,
            this.player.sprite.y,
            this.player.facing,
            this.player.animationState,
            this.player.isMoving
          )
          this.lastPlayerUpdate = now
        }
      }
    }
  }

  updatePlayerCount(count) {
    if (this.playerCountText) {
      this.playerCountText.setText(`Players: ${count}`)
    }
  }

  displayChatMessage(playerName, message) {
    // Simple chat display (you can enhance this)
    console.log(`${playerName}: ${message}`)
  }

  destroy() {
    if (this.croquetSession) {
      this.croquetSession.leave()
    }
    super.destroy()
  }
}