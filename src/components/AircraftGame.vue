<template>
  <div class="aircraft-game">
    <canvas 
      ref="gameCanvas" 
      class="game-canvas"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Game } from '@/game/Game.js'

// 响应式数据
const gameCanvas = ref(null)
let game = null

// 组件挂载时初始化游戏
onMounted(async () => {
  if (gameCanvas.value) {
    // 创建游戏实例
    game = new Game(gameCanvas.value)
    
    // 等待图片加载完成后开始渲染
    await game.loadImages()
    
    // 开始渲染循环（显示菜单）
    game.render()
  }
})

</script>

<style scoped>
.aircraft-game {
  width: 100%;
  height: 100vh;
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
}

/* 响应式设计 */
@media (max-width: 900px) {
  .game-canvas {
    width: 100%;
    max-width: 600px;
    height: auto;
  }
}
</style>