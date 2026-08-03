import '@vue-flow/core/dist/style.css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
