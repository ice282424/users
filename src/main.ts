// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// import { createPinia } from 'pinia'

// const pinia = createPinia()

// const app = createApp(App)

// app.use(router)
// app.use(pinia)
// app.use(ElementPlus, {
//   locale: zhCn,
// })

// app.mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

// 集成路由、状态管理、UI框架
app.use(router)
app.use(pinia)
app.use(ElementPlus, { locale: zhCn })

app.mount('#app')
