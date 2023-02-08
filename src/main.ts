import { createApp } from 'vue'

import main from './main.vue'
import './main.css'

import { createPinia } from 'pinia'
import router from './router'

const app = createApp(main)

app.use(createPinia())
app.use(router)

app.mount('#app')
