/**
 * 游戏相关类型定义
 */

// 位置坐标接口
export interface Position {
  x: number
  y: number
}

// 尺寸接口
export interface Size {
  width: number
  height: number
}

// 速度接口
export interface Velocity {
  x: number
  y: number
}

// 游戏对象基础接口
export interface GameObject {
  id: string
  position: Position
  size: Size
  velocity: Velocity
  active: boolean
}

// 玩家飞机接口
export interface Player extends GameObject {
  health: number
  maxHealth: number
  score: number
  shootCooldown: number
}

// 敌机接口
export interface Enemy extends GameObject {
  health: number
  type: EnemyType
  shootCooldown?: number
  points: number
}

// 子弹接口
export interface Bullet extends GameObject {
  damage: number
  owner: 'player' | 'enemy'
}

// 敌机类型枚举
export enum EnemyType {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  BOSS = 'boss'
}

// 游戏状态枚举
export enum GameState {
  MENU = 'menu',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'game_over',
  VICTORY = 'victory'
}

// 游戏配置接口
export interface GameConfig {
  canvas: {
    width: number
    height: number
  }
  player: {
    speed: number
    shootInterval: number
    maxHealth: number
  }
  enemies: {
    spawnInterval: number
    maxCount: number
  }
  bullets: {
    speed: number
    maxCount: number
  }
}

// 游戏统计接口
export interface GameStats {
  score: number
  level: number
  enemiesDestroyed: number
  bulletsShot: number
  accuracy: number
  playTime: number
}