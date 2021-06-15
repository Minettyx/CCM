<template>
  <router-view :key="$route.fullPath" style="text-align: center;"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
});
</script>