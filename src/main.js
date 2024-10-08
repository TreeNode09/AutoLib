import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

const store = createPinia()

const app = createApp(App)
app.use(store).use(router)
app.mount('#app')
