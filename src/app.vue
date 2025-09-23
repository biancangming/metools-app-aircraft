<template>
  <div class="metools-app-aircraft">
    <AircraftGame />
  </div>
</template>

<script setup lang="ts">
import AircraftGame from './components/AircraftGame.vue'

// 定义 info 对象的类型
interface Info {
  version: string
  name: string
  enName: string
  description: string
  author: string
  icon: string
}

// 为 info 对象指定类型
const info: Info = {
  "version": "1.0.0",
  "name": "打飞机游戏",
  "enName": "aircraft-game",
  "description": "类似微信打飞机的经典射击游戏",
  "author": "metools",
  "icon": "https://cdn.jsdelivr.net/gh/metools/metools-app-aircraft@latest/icon.png"
}
</script>

<style scoped>
.metools-app-aircraft {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>