<template>
<header class="p-1 mb-3 border-bottom bg-white" :class="{'sticky-top': width>=992}">
  <div class="container">
    <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">

      <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
        <li><router-link to="/" class="nav-link px-2 link-secondary" style='cursor: pointer;'>Home</router-link></li>
        <li><router-link to="/archive" class="nav-link px-2 link-dark" style='cursor: pointer;'>Archivio</router-link></li>
        <li><a href='https://github.com/Minettyx/CCM' class="nav-link px-2 link-dark" style='cursor: pointer;' target="_blank" rel="noreferrer">GitHub</a></li>
        <li><a href='https://paypal.me/pools/c/8ru3kh05Tu' class="nav-link px-2 link-dark" style='cursor: pointer;' target="_blank" rel="noreferrer">Donazioni</a></li>
        <li><a href='https://t.me/ccmtranslations' class="nav-link px-2 link-dark" style='cursor: pointer;' target="_blank" rel="noreferrer">Telegram</a></li>
      </ul>

      <ul class="nav col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3 justify-content-center">
        <li><a href="" class="nav-link px-2 link-dark" style='cursor: pointer;' @click="switchmode()"><fai :icon="$getCookie('darkmode') == 'true' ? 'sun' : 'moon'"/></a></li>
        <li>
          <form @submit.prevent="this.$router.push('/archive'+(search?'?title='+search:''))">
            <input v-model="search" type="search" class="form-control" placeholder="Cerca...">
          </form>
        </li>
      </ul>

    </div>
  </div>
</header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NavBar',
  data() {
    return {
      search: '',
      width: window.innerWidth
    }
  },
  mounted() {
    window.onresize = () => {
      this.width = window.innerWidth
    }
  },
  beforeUnmount() {
    window.onresize = () => {return}
  },
  methods: {
    switchmode() {
      if(this.$getCookie('darkmode') == 'true') {
        this.$setCookie('darkmode', 'false', 36500)
      } else {
        this.$setCookie('darkmode', 'true', 36500)
      }
      this.$router.push('')
    }
  }
});
</script>