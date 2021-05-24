<template>
<header class="p-3 mb-3 border-bottom bg-white">
  <div class="container">
    <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">

      <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
        <li><router-link to="/" class="nav-link px-2 link-secondary" style='cursor: pointer;'>Home</router-link></li>
        <li><router-link to="/archive" class="nav-link px-2 link-dark" style='cursor: pointer;'>Archivio</router-link></li>
        <li><a href='https://github.com/Minettyx/CCM' class="nav-link px-2 link-dark" style='cursor: pointer;' target="_blank" rel="noreferrer">GitHub</a></li>
        <li><a href='https://paypal.me/pools/c/8ru3kh05Tu' class="nav-link px-2 link-dark" style='cursor: pointer;' target="_blank" rel="noreferrer">Donazioni</a></li>
        <li><a href='https://t.me/ccmtranslations' class="nav-link px-2 link-dark" style='cursor: pointer;' target="_blank" rel="noreferrer">Telegram</a></li>
      </ul>

      <a href="" class="nav-link px-2 link-dark" style='cursor: pointer;' @click="switchmode()"><fai :icon="getCookie('darkmode') == 'true' ? 'sun' : 'moon'"/></a>
      <form @submit.prevent="this.$router.push('/archive'+(search?'?title='+search:''))" class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
        <input v-model="search" type="search" class="form-control" placeholder="Cerca...">
      </form>

    </div>
  </div>
</header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
    enable as enableDarkMode,
    disable as disableDarkMode
} from 'darkreader'

export default defineComponent({
  name: 'NavBar',
  data() {
    return {
      search: ''
    }
  },
  mounted() {
    this.updatemode()
  },
  methods: {
    switchmode() {
      if(this.getCookie('darkmode') == 'true') {
        this.setCookie('darkmode', 'false', 36500)
      } else {
        this.setCookie('darkmode', 'true', 36500)
      }
      this.$router.push('')
    },
    updatemode() {
      if(this.getCookie('darkmode') == 'true') {
        enableDarkMode({
            brightness: 100,
            contrast: 90,
            sepia: 10,
        })
      } else {
        disableDarkMode()
      }
    },
    /* https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript */
    setCookie(name: string, value: string, days: number | false = false) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    },
    getCookie(name: string) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    },
    eraseCookie(name: string) {   
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }
});
</script>