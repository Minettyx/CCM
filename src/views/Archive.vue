<template>
  <div class="about">
    <h1>Archivio</h1>



<div class="album py-5 bg-light">
    <div class="container">
      <div class="d-flex justify-content-center" v-if="loading">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-5" v-if="!loading">
        <div class="col" v-for="o in data" :key="o">
          <div class="card shadow-sm" style='cursor: pointer;' @click="this.$router.push('/manga/'+o.id)">
            <img class="bd-placeholder-img card-img-top" style="object-fit: cover; aspect-ratio: 2/3" :src="'https://cdn.ccmscans.in/mangas/'+o.id+'/cover.jpg'" role="img">

            <div class="card-body">
              <h5 class="card-text">{{o.title}}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  </div>
</template>

<script>
export default {
  name: 'Archive',
  data() {
    return {
      data: {},
      loading: true
    }
  },
  watch: {
    '$route.query.title'() {
      this.getdata();
    }
  },
  mounted() {
    this.getdata();
  },
  methods: {
    async getdata() {
      this.loading = true;
      await this.axios
      .get('https://api.ccmscans.in/mangas?title='+(this.$route.query.title||''))
      .then(response => {
        this.data = response.data;
        this.loading = false;
      })
    }
  }
}
</script>