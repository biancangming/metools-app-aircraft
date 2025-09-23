/**
 * 飞机大战游戏核心类
 * 基于HTML5 Canvas的简洁游戏架构
 */
import playerPng from '@/assets/images/player.svg'
import enemyPng from '@/assets/images/enemy.svg'
import bulletPng from '@/assets/images/bullet.svg'
import enemyBulletPng from '@/assets/images/enemy-bullet.svg'
export class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.width = 800
    this.height = 600
    
    // 设置画布尺寸
    this.canvas.width = this.width
    this.canvas.height = this.height
    
    // 游戏状态
    this.gameState = 'menu' // menu, playing, paused, gameOver
    this.score = 0
    this.lives = 3
    
    // 游戏对象数组
    this.sprites = []
    this.bullets = []
    this.enemies = []
    
    // 输入状态
    this.keys = {}
    
    // 游戏循环
    this.lastTime = 0
    this.animationId = null
    
    // 敌机生成计时器
    this.enemySpawnTimer = 0
    this.enemySpawnInterval = 2000 // 2秒生成一个敌机
    
    // 预加载图片
    this.images = {}
    this.loadImages()
    
    // 绑定事件
    this.bindEvents()
  }
  
  /**
   * 预加载游戏图片
   */
  async loadImages() {
    const imageUrls = {
      player: playerPng,
      enemy: enemyPng,
      bullet: bulletPng,
      enemyBullet: enemyBulletPng
    }
    
    const loadPromises = Object.entries(imageUrls).map(([key, url]) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          this.images[key] = img
          resolve()
        }
        img.onerror = (error) => {
          console.warn(`图片加载失败: ${url}`, error)
          // 即使图片加载失败也继续，使用备用绘制方案
          resolve()
        }
        img.src = url
      })
    })
    
    try {
      await Promise.all(loadPromises)
      console.log('游戏图片加载完成')
    } catch (error) {
      console.warn('部分图片加载失败，将使用备用绘制方案:', error)
    }
  }
  
  /**
   * 绑定键盘事件
   */
  bindEvents() {
    window.addEventListener('keydown', (e) => {
      // 在菜单状态下直接处理空格键开始游戏
      if (e.code === 'Space' && this.gameState === 'menu') {
        this.start()
        e.preventDefault()
        return
      }
      
      // 设置按键状态
      this.keys[e.code] = true
      
      // 防止默认行为（但不包括游戏中的空格键）
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault()
      }
      
      // 只在非游戏状态下阻止空格键默认行为
      if (e.code === 'Space' && this.gameState !== 'playing') {
        e.preventDefault()
      }
    })
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false
    })
  }
  
  /**
   * 开始游戏
   */
  start() {
    if (this.gameState === 'menu') {
      this.gameState = 'playing'
      this.score = 0
      this.lives = 3
      
      // 清空游戏对象
      this.sprites = []
      this.bullets = []
      this.enemies = []
      
      // 创建玩家
      this.player = new Player(this.width / 2 - 20, this.height - 60, this)
      this.sprites.push(this.player)
      
      // 开始游戏循环
      this.gameLoop()
    }
  }
  
  /**
   * 暂停/恢复游戏
   */
  togglePause() {
    if (this.gameState === 'playing') {
      this.gameState = 'paused'
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
        this.animationId = null
      }
    } else if (this.gameState === 'paused') {
      this.gameState = 'playing'
      this.gameLoop()
    }
  }
  
  /**
   * 游戏结束
   */
  gameOver() {
    this.gameState = 'gameOver'
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }
  
  /**
   * 重新开始游戏
   */
  restart() {
    this.gameState = 'menu'
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }
  
  /**
   * 游戏主循环
   */
  gameLoop(currentTime = 0) {
    if (this.gameState !== 'playing') return
    
    const deltaTime = currentTime - this.lastTime
    this.lastTime = currentTime
    
    // 更新游戏逻辑
    this.update(deltaTime)
    
    // 渲染游戏画面
    this.render()
    
    // 继续下一帧
    this.animationId = requestAnimationFrame((time) => this.gameLoop(time))
  }
  
  /**
   * 更新游戏逻辑
   */
  update(deltaTime) {
    // 生成敌机
    this.spawnEnemies(deltaTime)
    
    // 更新所有精灵
    this.sprites.forEach(sprite => sprite.update(deltaTime))
    
    // 更新子弹
    this.bullets.forEach(bullet => bullet.update(deltaTime))
    
    // 移除超出边界的对象
    this.bullets = this.bullets.filter(bullet => bullet.active && bullet.y > -10 && bullet.y < this.height + 10)
    this.enemies = this.enemies.filter(enemy => enemy.active && enemy.y < this.height + 50)
    this.sprites = this.sprites.filter(sprite => sprite.active)
    
    // 碰撞检测
    this.checkCollisions()
    
    // 检查游戏结束条件
    if (this.lives <= 0) {
      this.gameOver()
    }
  }
  
  /**
   * 生成敌机
   */
  spawnEnemies(deltaTime) {
    this.enemySpawnTimer += deltaTime
    
    if (this.enemySpawnTimer >= this.enemySpawnInterval) {
      this.enemySpawnTimer = 0
      
      // 随机位置生成敌机
      const x = Math.random() * (this.width - 30)
      const enemy = new Enemy(x, -30, this)
      this.enemies.push(enemy)
      this.sprites.push(enemy)
    }
  }
  
  /**
   * 碰撞检测
   */
  checkCollisions() {
    // 玩家子弹与敌机碰撞
    this.bullets.forEach(bullet => {
      if (bullet.owner === 'player' && bullet.active) {
        this.enemies.forEach(enemy => {
          if (enemy.active && this.isColliding(bullet, enemy)) {
            bullet.active = false
            enemy.active = false
            this.score += 10
          }
        })
      }
    })
    
    // 敌机子弹与玩家碰撞
    this.bullets.forEach(bullet => {
      if (bullet.owner === 'enemy' && bullet.active && this.player.active) {
        if (this.isColliding(bullet, this.player)) {
          bullet.active = false
          this.lives--
          console.log('玩家被击中，剩余生命:', this.lives)
        }
      }
    })
    
    // 敌机与玩家碰撞
    this.enemies.forEach(enemy => {
      if (enemy.active && this.player.active) {
        if (this.isColliding(enemy, this.player)) {
          enemy.active = false
          this.lives--
          console.log('玩家与敌机碰撞，剩余生命:', this.lives)
        }
      }
    })
  }
  
  /**
   * 检测两个对象是否碰撞
   */
  isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y
  }
  
  /**
   * 渲染游戏画面
   */
  render() {
    // 清空画布
    this.ctx.fillStyle = '#0a0a2e'
    this.ctx.fillRect(0, 0, this.width, this.height)
    
    // 绘制星空背景
    this.drawStars()
    
    if (this.gameState === 'playing' || this.gameState === 'paused') {
      // 绘制所有精灵
      this.sprites.forEach(sprite => sprite.render(this.ctx))
      
      // 绘制所有子弹
      this.bullets.forEach(bullet => bullet.render(this.ctx))
      
      // 绘制UI
      this.drawUI()
      
      // 绘制暂停提示
      if (this.gameState === 'paused') {
        this.drawPauseScreen()
      }
    } else if (this.gameState === 'menu') {
      this.drawMenuScreen()
    } else if (this.gameState === 'gameOver') {
      this.drawGameOverScreen()
    }
  }
  
  /**
   * 绘制星空背景
   */
  drawStars() {
    this.ctx.fillStyle = '#ffffff'
    for (let i = 0; i < 50; i++) {
      const x = (i * 137.5) % this.width
      const y = (i * 73.3 + Date.now() * 0.01) % this.height
      const size = (i % 3) + 1
      this.ctx.fillRect(x, y, size, size)
    }
  }
  
  /**
   * 绘制UI信息
   */
  drawUI() {
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '20px Arial'
    this.ctx.fillText(`得分: ${this.score}`, 20, 30)
    this.ctx.fillText(`生命: ${this.lives}`, 20, 60)
  }
  
  /**
   * 绘制菜单界面
   */
  drawMenuScreen() {
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '48px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('飞机大战', this.width / 2, this.height / 2 - 50)
    
    this.ctx.font = '24px Arial'
    this.ctx.fillText('按空格键开始游戏', this.width / 2, this.height / 2 + 20)
    this.ctx.fillText('WASD移动，自动射击', this.width / 2, this.height / 2 + 60)
    
    this.ctx.textAlign = 'left'
  }
  
  /**
   * 绘制暂停界面
   */
  drawPauseScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    this.ctx.fillRect(0, 0, this.width, this.height)
    
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '36px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('游戏暂停', this.width / 2, this.height / 2)
    this.ctx.font = '20px Arial'
    this.ctx.fillText('按P键继续游戏', this.width / 2, this.height / 2 + 40)
    this.ctx.textAlign = 'left'
  }
  
  /**
   * 绘制游戏结束界面
   */
  drawGameOverScreen() {
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '48px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('游戏结束', this.width / 2, this.height / 2 - 50)
    
    this.ctx.font = '24px Arial'
    this.ctx.fillText(`最终得分: ${this.score}`, this.width / 2, this.height / 2 + 20)
    this.ctx.fillText('按R键重新开始', this.width / 2, this.height / 2 + 60)
    
    this.ctx.textAlign = 'left'
    
    // 检测重新开始按键
    if (this.keys['KeyR']) {
      this.restart()
      setTimeout(() => this.start(), 100) // 延迟一点避免立即触发
    }
  }
}

/**
 * 玩家类
 */
class Player {
  constructor(x, y, game) {
    this.x = x
    this.y = y
    this.width = 40
    this.height = 40
    this.speed = 5
    this.game = game
    this.active = true
    this.shootCooldown = 0
    this.shootInterval = 200 // 射击间隔200ms
  }
  
  update(deltaTime) {
    if (!this.active) return
    
    // 移动控制
    if (this.game.keys['KeyA'] || this.game.keys['ArrowLeft']) {
      this.x -= this.speed
    }
    if (this.game.keys['KeyD'] || this.game.keys['ArrowRight']) {
      this.x += this.speed
    }
    if (this.game.keys['KeyW'] || this.game.keys['ArrowUp']) {
      this.y -= this.speed
    }
    if (this.game.keys['KeyS'] || this.game.keys['ArrowDown']) {
      this.y += this.speed
    }
    
    // 边界检测
    this.x = Math.max(0, Math.min(this.game.width - this.width, this.x))
    this.y = Math.max(0, Math.min(this.game.height - this.height, this.y))
    
    // 自动射击控制
    this.shootCooldown -= deltaTime
    if (this.shootCooldown <= 0) {
      this.shoot()
      this.shootCooldown = this.shootInterval
    }
    
    // 暂停控制 - 使用单独的按键检测避免与射击冲突
    if (this.game.keys['KeyP']) {
      this.game.togglePause()
      // 防止重复触发，延迟重置按键状态
      setTimeout(() => {
        this.game.keys['KeyP'] = false
      }, 100)
    }
  }
  
  shoot() {
    const bullet = new Bullet(
      this.x + this.width / 2 - 2,
      this.y,
      0, -8, // 向上发射
      'player',
      this.game
    )
    this.game.bullets.push(bullet)
  }
  
  render(ctx) {
    if (!this.active) return
    
    if (this.game.images.player) {
      ctx.drawImage(this.game.images.player, this.x, this.y, this.width, this.height)
    } else {
      // 备用绘制方案
      ctx.fillStyle = '#4ecdc4'
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }
  }
}

/**
 * 敌机类
 */
class Enemy {
  constructor(x, y, game) {
    this.x = x
    this.y = y
    this.width = 30
    this.height = 30
    this.speed = 2
    this.game = game
    this.active = true
    this.shootCooldown = 0
    this.shootInterval = 1500 // 敌机射击间隔1.5秒
  }
  
  update(deltaTime) {
    if (!this.active) return
    
    // 向下移动
    this.y += this.speed
    
    // 射击
    this.shootCooldown -= deltaTime
    if (this.shootCooldown <= 0) {
      this.shoot()
      this.shootCooldown = this.shootInterval
    }
    
    // 超出边界则标记为非活跃
    if (this.y > this.game.height + 50) {
      this.active = false
    }
  }
  
  shoot() {
    const bullet = new Bullet(
      this.x + this.width / 2 - 2,
      this.y + this.height,
      0, 6, // 向下发射
      'enemy',
      this.game
    )
    this.game.bullets.push(bullet)
  }
  
  render(ctx) {
    if (!this.active) return
    
    if (this.game.images.enemy) {
      ctx.drawImage(this.game.images.enemy, this.x, this.y, this.width, this.height)
    } else {
      // 备用绘制方案
      ctx.fillStyle = '#e74c3c'
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }
  }
}

/**
 * 子弹类
 */
class Bullet {
  constructor(x, y, vx, vy, owner, game) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.width = 4
    this.height = 10
    this.owner = owner // 'player' 或 'enemy'
    this.game = game
    this.active = true
  }
  
  update(deltaTime) {
    if (!this.active) return
    
    this.x += this.vx
    this.y += this.vy
    
    // 超出边界则标记为非活跃
    if (this.y < -10 || this.y > this.game.height + 10) {
      this.active = false
    }
  }
  
  render(ctx) {
    if (!this.active) return
    
    const imageKey = this.owner === 'player' ? 'bullet' : 'enemyBullet'
    
    if (this.game.images[imageKey]) {
      ctx.drawImage(this.game.images[imageKey], this.x, this.y, this.width, this.height)
    } else {
      // 备用绘制方案
      ctx.fillStyle = this.owner === 'player' ? '#ffd700' : '#ff4757'
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }
  }
}