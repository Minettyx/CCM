import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Toaster from "@meforma/vue-toaster";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSun, faMoon, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSun, faMoon, faChevronRight, faChevronLeft)

const app = createApp(App)

app.use(router)
app.component('fai', FontAwesomeIcon)
app.use(VueAxios, axios)
app.use(Toaster)

app.mount('#app')
