import { createApp } from 'vue'
import App from './App.vue'
// Remove router import since it doesn't exist yet

// Create and mount the app
const app = createApp(App)
// app.use(router) // Comment out or remove this line
app.mount('#app')
