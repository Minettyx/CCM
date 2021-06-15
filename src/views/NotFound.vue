<template>
<div>
  <NavBar></NavBar>
  <h1>Errore</h1>
  <div class="album py-5 bg-light">
    <div class="d-flex justify-content-center">
      <h5>Pagina non trovata</h5>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from '@/components/NavBar.vue'

export default defineComponent({
  name: 'Archive',
  components: {
    NavBar
  }
})
</script>