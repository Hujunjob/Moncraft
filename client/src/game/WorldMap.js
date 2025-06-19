export class WorldMap {
  constructor(scene) {
    this.scene = scene
    this.map = null
    this.tileset = null
    this.groundLayer = null
    this.collisionLayer = null
    
    this.createMap()
  }

  createMap() {
    try {
      // Load the tilemap
      this.map = this.scene.make.tilemap({ key: 'map' })
      
      if (!this.map) {
        console.error('Failed to create tilemap - key "map" not found')
        this.createFallbackMap()
        return
      }
      
      // Add tileset
      this.tileset = this.map.addTilesetImage('tileset', 'tileset')
      
      if (!this.tileset) {
        console.error('Failed to add tileset - creating fallback')
        this.createFallbackMap()
        return
      }
      
      // Create layers
      this.groundLayer = this.map.createLayer('ground', this.tileset, 0, 0)
      
      // Create collision layer if it exists
      if (this.map.getLayer('collision')) {
        this.collisionLayer = this.map.createLayer('collision', this.tileset, 0, 0)
        this.collisionLayer.setCollisionByProperty({ collides: true })
      }
      
      // Set map dimensions
      this.mapWidth = this.map.widthInPixels
      this.mapHeight = this.map.heightInPixels
      
      console.log(`Map created: ${this.mapWidth}x${this.mapHeight}`)
      
    } catch (error) {
      console.error('Error creating tilemap:', error)
      this.createFallbackMap()
    }
  }

  createFallbackMap() {
    // Create a simple fallback map using rectangles
    console.log('Creating fallback map...')
    
    const mapWidth = 1280
    const mapHeight = 960
    const tileSize = 32
    
    // Create ground using graphics
    const graphics = this.scene.add.graphics()
    graphics.fillStyle(0x4a7c59)
    
    // Fill the entire area with grass-colored tiles
    for (let x = 0; x < mapWidth; x += tileSize) {
      for (let y = 0; y < mapHeight; y += tileSize) {
        graphics.fillRect(x, y, tileSize - 1, tileSize - 1)
      }
    }
    
    this.mapWidth = mapWidth
    this.mapHeight = mapHeight
    this.groundLayer = graphics
    
    console.log('Fallback map created')
  }

  getCollisionLayer() {
    return this.collisionLayer
  }

  getTileAt(x, y) {
    const tileX = Math.floor(x / 32)
    const tileY = Math.floor(y / 32)
    return this.map.getTileAt(tileX, tileY, false, 'collision')
  }

  worldToTileXY(worldX, worldY) {
    return {
      x: Math.floor(worldX / 32),
      y: Math.floor(worldY / 32)
    }
  }

  tileToWorldXY(tileX, tileY) {
    return {
      x: tileX * 32,
      y: tileY * 32
    }
  }
}