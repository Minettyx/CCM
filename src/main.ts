import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)

/* Axios */
import axios from 'axios'
import VueAxios from 'vue-axios'
app.use(VueAxios, axios)

/* Bootstrap */
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'

/* Fontawsome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSun, faMoon, faChevronRight, faChevronLeft, faArrowLeft, faCog} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faSun, faMoon, faChevronRight, faChevronLeft, faArrowLeft,faCog)
app.component('fai', FontAwesomeIcon)

/* Urql */
import urql from '@urql/vue'
app.use(urql, {
  url: 'https://graphql.ccmscans.in/'
})

/* my plugins */
import functions from './plugins/functions'
app.use(functions)
import viewport from './plugins/viewport'
app.use(viewport)

app.mount('#app')
