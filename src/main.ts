import { createApp } from 'vue'
import App from './app.vue'
import './assets/styles/tailwind.css'

// 创建Vue应用实例
const app = createApp(App)

// 挂载应用
app.mount('#app')