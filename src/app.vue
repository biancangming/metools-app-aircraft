<template>
  <div class="metools-app-aircraft">
    <AircraftGame />
  </div>
</template>

<script setup lang="ts">
import AircraftGame from './components/AircraftGame.vue'
</script>

<style scoped>
.metools-app-aircraft {
  width: 100%;
  height: 100%;
  min-height: 300px;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>