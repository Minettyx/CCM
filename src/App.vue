<template>
  <router-view :key="$route.fullPath" style="text-align: center;"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
    enable as enableDarkMode,
    disable as disableDarkMode
} from 'darkreader'

export default defineComponent({
  name: 'App',
  mounted() {
    this.updatemode()
  },
  methods: {
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
    getCookie(name: string) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
  }
});
</script>