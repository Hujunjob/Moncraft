import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private map!: Phaser.Tilemaps.Tilemap;
  private tileset!: Phaser.Tilemaps.Tileset;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private obstacleLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    // Create a tileset image with multiple tiles
    this.createTilesetImage();
    
    // Create player texture
    this.add.graphics()
      .fillStyle(0xff4444)
      .fillRect(0, 0, 16, 16)
      .generateTexture('player', 16, 16);
  }

  private createTilesetImage(): void {
    // Create a 64x16 tileset with 4 tiles (16x16 each)
    const tilesetWidth = 64;
    const tilesetHeight = 16;
    const tileSize = 16;
    
    const graphics = this.add.graphics();
    
    // Clear background
    graphics.clear();
    
    // Tile 0: Grass (bright green)
    graphics.fillStyle(0x4a9d4a);
    graphics.fillRect(0, 0, tileSize, tileSize);
    
    // Tile 1: Dark grass (darker green)  
    graphics.fillStyle(0x3a7a2a);
    graphics.fillRect(tileSize, 0, tileSize, tileSize);
    
    // Tile 2: Stone (gray)
    graphics.fillStyle(0x666666);
    graphics.fillRect(tileSize * 2, 0, tileSize, tileSize);
    
    // Tile 3: Tree (brown)
    graphics.fillStyle(0x8B4513);
    graphics.fillRect(tileSize * 3, 0, tileSize, tileSize);
    
    // Generate the tileset texture
    graphics.generateTexture('tileset', tilesetWidth, tilesetHeight);
    graphics.destroy();
    
    console.log('Tileset created with 4 tiles');
  }

  create(): void {
    console.log("create");
    
    // Create tilemap
    this.createTilemap();
    
    // Create player
    this.createPlayer();
    
    // Setup camera
    this.setupCamera();
    
    // Setup input
    this.setupInput();
    
    // Setup physics
    this.setupPhysics();
  }

  private createTilemap(): void {
    console.log("createTilemap");
    
    const mapWidth = 100;
    const mapHeight = 100;
    const tileSize = 16;

    // Create blank tilemap
    this.map = this.make.tilemap({
      tileWidth: tileSize,
      tileHeight: tileSize,
      width: mapWidth,
      height: mapHeight
    });

    // Add tileset
    this.tileset = this.map.addTilesetImage('tiles', 'tileset', tileSize, tileSize)!;
    console.log('Tileset added:', this.tileset);
    console.log('Tileset total:', this.tileset.total);
    console.log('Tileset firstgid:', this.tileset.firstgid);

    // Create layers
    this.groundLayer = this.map.createBlankLayer('ground', this.tileset)!;
    this.obstacleLayer = this.map.createBlankLayer('obstacles', this.tileset)!;

    // Generate map data
    this.generateMapData();
  }

  private generateMapData(): void {
    console.log("generateMapData");
    try {
      
    const mapWidth = this.map.width;
    const mapHeight = this.map.height;
    console.log(this.groundLayer);
    console.log(this.obstacleLayer);
    console.log("%s,%s",mapWidth,mapHeight);
    
     const firstGid = this.tileset.firstgid;
     console.log("firstGid",firstGid);
     
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const random = Math.random();
        
        // Ground layer - always place grass or dark grass
       
        if (random < 0.7) {
          this.groundLayer.putTileAt(firstGid, x, y); // Grass (first tile in tileset)
        } else {
          this.groundLayer.putTileAt(firstGid + 1, x, y); // Dark grass (second tile in tileset)
        }
        
        // Obstacle layer - randomly place obstacles
        if (random > 0.82 && random < 0.91) {
          this.obstacleLayer.putTileAt(firstGid + 2, x, y); // Stone (third tile in tileset)
        } else if (random >= 0.91) {
          this.obstacleLayer.putTileAt(firstGid + 3, x, y); // Tree (fourth tile in tileset)
        }
        // console.log("%s,%s,%s",x,y,random);
        
      }
    }
    } catch (error) {
        console.error(error);
        
    }
    
  }

  private createPlayer(): void {
    // Create player sprite at center of map
    const centerX = (this.map.width * this.map.tileWidth) / 2;
    const centerY = (this.map.height * this.map.tileHeight) / 2;
    
    this.player = this.physics.add.sprite(centerX, centerY, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setSize(14, 14);
  }

  private setupCamera(): void {
    // Set world bounds
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    
    // Camera follows player
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.setZoom(2);
  }

  private setupInput(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys('W,S,A,D') as any;
  }

  private setupPhysics(): void {
    // Set collision for obstacle tiles (stone and tree)
    const firstGid = this.tileset.firstgid;
    this.obstacleLayer.setCollisionBetween(firstGid + 2, firstGid + 3);
    
    // Add collision between player and obstacle layer
    this.physics.add.collider(this.player, this.obstacleLayer);
  }

  update(): void {
    this.handlePlayerMovement();
  }

  private handlePlayerMovement(): void {
    const speed = 80;

    // Reset velocity
    this.player.setVelocity(0);

    // Check input
    if (this.cursors.left?.isDown || this.wasd.A.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right?.isDown || this.wasd.D.isDown) {
      this.player.setVelocityX(speed);
    }

    if (this.cursors.up?.isDown || this.wasd.W.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down?.isDown || this.wasd.S.isDown) {
      this.player.setVelocityY(speed);
    }

    // Normalize diagonal movement
    if (this.player.body && this.player.body.velocity.x !== 0 && this.player.body.velocity.y !== 0) {
      const normalizedSpeed = speed * 0.707;
      this.player.setVelocity(
        this.player.body.velocity.x > 0 ? normalizedSpeed : -normalizedSpeed,
        this.player.body.velocity.y > 0 ? normalizedSpeed : -normalizedSpeed
      );
    }
  }
}