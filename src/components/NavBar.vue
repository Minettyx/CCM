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

      <form @submit.prevent="this.$router.push('/archive'+(search?'?title='+search:''))" class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
        <input v-model="search" type="search" class="form-control" placeholder="Cerca...">
      </form>

    </div>
  </div>
</header>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      search: ''
    }
  }
}
</script>