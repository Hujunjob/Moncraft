export class Player {
  constructor(scene, x, y) {
    this.scene = scene
    this.speed = 200
    
    // Create player sprite
    this.sprite = scene.physics.add.sprite(x, y, 'player')
    this.sprite.setDisplaySize(24, 24)
    this.sprite.setTint(0x00ff00) // Green color for player
    
    // Physics properties
    this.sprite.setCollideWorldBounds(true)
    this.sprite.body.setSize(20, 20) // Smaller collision box
    
    // Movement properties
    this.isMoving = false
    this.facing = 'down'
    
    // Animation states
    this.animationState = 'idle'
    
    // Create simple movement animations by changing tint
    this.createAnimations()
  }

  createAnimations() {
    // We'll simulate animations by changing the tint color slightly
    this.animations = {
      idle: 0x00ff00,      // Green
      moving: 0x00cc00,    // Darker green when moving
      up: 0x0000ff,        // Blue when moving up
      down: 0x00ff00,      // Green when moving down
      left: 0xff8800,      // Orange when moving left
      right: 0x8800ff      // Purple when moving right
    }
  }

  update(cursors, wasd) {
    let velocityX = 0
    let velocityY = 0
    let newFacing = this.facing
    let isMoving = false

    // Handle input
    if (cursors.left.isDown || wasd.A.isDown) {
      velocityX = -this.speed
      newFacing = 'left'
      isMoving = true
    } else if (cursors.right.isDown || wasd.D.isDown) {
      velocityX = this.speed
      newFacing = 'right'
      isMoving = true
    }

    if (cursors.up.isDown || wasd.W.isDown) {
      velocityY = -this.speed
      newFacing = 'up'
      isMoving = true
    } else if (cursors.down.isDown || wasd.S.isDown) {
      velocityY = this.speed
      newFacing = 'down'
      isMoving = true
    }

    // Set velocity
    this.sprite.setVelocity(velocityX, velocityY)
    
    // Update facing direction and animation
    if (this.facing !== newFacing || this.isMoving !== isMoving) {
      this.facing = newFacing
      this.isMoving = isMoving
      this.updateAnimation()
    }
  }

  updateAnimation() {
    if (this.isMoving) {
      this.sprite.setTint(this.animations[this.facing])
      this.animationState = 'moving'
    } else {
      this.sprite.setTint(this.animations.idle)
      this.animationState = 'idle'
    }
  }

  getPosition() {
    return {
      x: this.sprite.x,
      y: this.sprite.y
    }
  }

  setPosition(x, y) {
    this.sprite.setPosition(x, y)
  }

  getFacing() {
    return this.facing
  }

  getAnimationState() {
    return this.animationState
  }

  destroy() {
    if (this.sprite) {
      this.sprite.destroy()
    }
  }
}