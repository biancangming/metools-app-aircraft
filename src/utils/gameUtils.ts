/**
 * 游戏工具函数
 */

import type { Position, Size, GameObject } from '../types/game'

/**
 * 检测两个矩形是否碰撞
 * @param obj1 游戏对象1
 * @param obj2 游戏对象2
 * @returns 是否碰撞
 */
export function checkCollision(obj1: GameObject, obj2: GameObject): boolean {
  return (
    obj1.position.x < obj2.position.x + obj2.size.width &&
    obj1.position.x + obj1.size.width > obj2.position.x &&
    obj1.position.y < obj2.position.y + obj2.size.height &&
    obj1.position.y + obj1.size.height > obj2.position.y
  )
}

/**
 * 检查对象是否在画布范围内
 * @param obj 游戏对象
 * @param canvasWidth 画布宽度
 * @param canvasHeight 画布高度
 * @returns 是否在范围内
 */
export function isInBounds(obj: GameObject, canvasWidth: number, canvasHeight: number): boolean {
  return (
    obj.position.x + obj.size.width >= 0 &&
    obj.position.x <= canvasWidth &&
    obj.position.y + obj.size.height >= 0 &&
    obj.position.y <= canvasHeight
  )
}

/**
 * 生成随机数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机数
 */
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * 生成随机整数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(random(min, max + 1))
}

/**
 * 限制数值在指定范围内
 * @param value 数值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的数值
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * 计算两点之间的距离
 * @param pos1 位置1
 * @param pos2 位置2
 * @returns 距离
 */
export function distance(pos1: Position, pos2: Position): number {
  const dx = pos1.x - pos2.x
  const dy = pos1.y - pos2.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

/**
 * 线性插值
 * @param start 起始值
 * @param end 结束值
 * @param t 插值参数 (0-1)
 * @returns 插值结果
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

/**
 * 角度转弧度
 * @param degrees 角度
 * @returns 弧度
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * 弧度转角度
 * @param radians 弧度
 * @returns 角度
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}