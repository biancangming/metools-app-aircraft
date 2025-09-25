<template>
  <div class="aircraft-game">
    <canvas class="game-canvas" ref="gameCanvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Game } from '@/game/Game.js'
import pkg from "../../package.json"

// 定义响应式变量
const gameCanvasRef = ref(null) // 可编辑的canvas引用
let game = null
let resizeObserver = null // ResizeObserver实例
/**
 * 初始化游戏实例
 * 确保DOM完全挂载后再初始化canvas，并设置自适应尺寸
 */
const initGame = async () => {
  // 等待DOM更新完成
  await new Promise(resolve => {
    setTimeout(()=>{
      resolve()
    }, 500)
  })
  const root = document.querySelector(pkg.name).shadowRoot;
  // 检查useTemplateRef获取的canvas元素是否存在
  gameCanvasRef.value = root.querySelector('.game-canvas')
  if (!gameCanvasRef.value) {
    console.error('Canvas元素未找到，无法初始化游戏')
    return
  }
  
  try {
    // 设置canvas自适应父级元素大小
    resizeCanvas()
    
    // 创建游戏实例
    game = new Game(gameCanvasRef.value)
    
    // 等待图片加载完成后开始渲染
    await game.loadImages()
    
    // 开始渲染循环（显示菜单）
    game.render()
    
    // 设置ResizeObserver（如果在onMounted中未设置）
     if (!resizeObserver && gameCanvasRef.value.parentElement) {
        resizeObserver = new ResizeObserver((entries) => {
          // 使用requestAnimationFrame确保在下一帧执行，避免ResizeObserver循环警告
          requestAnimationFrame(() => {
            resizeCanvas()
          })
        })
        
        // 观察父元素的大小变化
        resizeObserver.observe(gameCanvasRef.value.parentElement)
      }
    
    console.log('游戏初始化成功')
  } catch (error) {
    console.error('游戏初始化失败:', error)
  }
}

/**
 * 设置canvas自适应父级元素大小，支持高DPI屏幕
 */
const resizeCanvas = () => {
  if (!gameCanvasRef.value) return
  
  const container = gameCanvasRef.value.parentElement
  if (!container) return
  
  // 获取设备像素比，确保在高DPI屏幕上清晰显示
  const dpr = window.devicePixelRatio || 1
  
  // 获取父级元素的实际尺寸
  const containerRect = container.getBoundingClientRect()
  const containerWidth = containerRect.width
  const containerHeight = containerRect.height
  
  // 设置canvas的显示尺寸（CSS尺寸）
  gameCanvasRef.value.style.width = '100%'
  gameCanvasRef.value.style.height = '100%'
  
  // 设置canvas的实际分辨率，保持16:9的宽高比
  const aspectRatio = 16 / 9
  let displayWidth, displayHeight
  
  if (containerWidth / containerHeight > aspectRatio) {
    // 容器更宽，以高度为准
    displayHeight = Math.min(containerHeight, 600)
    displayWidth = displayHeight * aspectRatio
  } else {
    // 容器更高，以宽度为准
    displayWidth = Math.min(containerWidth, 800)
    displayHeight = displayWidth / aspectRatio
  }
  
  // 设置canvas的实际像素尺寸（考虑设备像素比）
  const canvasWidth = displayWidth * dpr
  const canvasHeight = displayHeight * dpr
  
  gameCanvasRef.value.width = canvasWidth
  gameCanvasRef.value.height = canvasHeight
  
  // 设置canvas的CSS显示尺寸
  gameCanvasRef.value.style.width = displayWidth + 'px'
  gameCanvasRef.value.style.height = displayHeight + 'px'
  
  // 获取2D上下文并重新设置缩放
  const ctx = gameCanvasRef.value.getContext('2d')
  if (ctx) {
    // 重置变换矩阵，避免累积缩放
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    // 应用设备像素比缩放
    ctx.scale(dpr, dpr)
  }
  
  // 如果游戏实例已存在，更新游戏尺寸并立即重绘
  if (game) {
    game.width = displayWidth  // 游戏逻辑使用显示尺寸
    game.height = displayHeight
    game.dpr = dpr  // 传递设备像素比给游戏实例
    
    // 立即触发一次渲染，避免内容消失
    game.render()
  }
}

// 组件挂载时初始化游戏
onMounted(() => {
  // 使用setTimeout确保在下一个事件循环中执行
  setTimeout(initGame, 0)
  
  // 使用ResizeObserver监听父元素大小变化
  if (gameCanvasRef.value && gameCanvasRef.value.parentElement) {
    resizeObserver = new ResizeObserver((entries) => {
      // 使用requestAnimationFrame确保在下一帧执行，避免ResizeObserver循环警告
      requestAnimationFrame(() => {
        resizeCanvas()
      })
    })
    
    // 观察父元素的大小变化
    resizeObserver.observe(gameCanvasRef.value.parentElement)
  }
  
  // 保留window resize监听作为备用
  window.addEventListener('resize', resizeCanvas)
})

// 组件卸载时清理资源
onUnmounted(() => {
  if (game && game.animationId) {
    cancelAnimationFrame(game.animationId)
    game = null
  }
  
  // 清理ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  
  // 移除window事件监听器
  window.removeEventListener('resize', resizeCanvas)
})

</script>

<style scoped>
.aircraft-game {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.game-canvas {
  border: 2px solid #ffffff;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  background: #0a0a2e;
  outline: none;
  /* 移除固定尺寸，让canvas自适应父级元素 */
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>