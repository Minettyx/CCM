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
      if(this.$getCookie('darkmode') == 'true') {
        enableDarkMode({
            brightness: 100,
            contrast: 90,
            sepia: 10,
        })
      } else {
        disableDarkMode()
      }
    }
  }
});
</script>