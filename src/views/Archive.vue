<template>
  <div>
    <NavBar></NavBar>
    <h1>Archivio</h1>

    <div class="album py-5 bg-light">
      <div class="container">
        <div class="d-flex justify-content-center" v-if="loading">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3" v-if="!loading">
          <div class="col" v-for="o in data" :key="o">
            <div class="card shadow-sm" style='cursor: pointer;' @click="this.$router.push('/manga/'+o.id)">
              <img class="bd-placeholder-img card-img-top" style="object-fit: cover; aspect-ratio: 12/17" :src="o.cover" role="img">

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

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from '../components/NavBar.vue'
import { useQuery } from '@urql/vue';

export default defineComponent({
  name: 'Archive',
  components: {
    NavBar
  },
  data() {
    return {
      data: {},
      loading: true,
      error: undefined
    }
  },
  watch: {
    'error'() {
      // @ts-expect-error: $toast actually exist
      this.$toast.error("Errore durante il recupero dei dati, prova a ricaricare la pagina",{position:"bottom-right",duration:5000,maxToasts:1})
    }
  },
  mounted() {
    this.getdata()
  },
  methods: {
    /* Fetch data from the api */
    getdata() {
      this.loading = true
      let result = useQuery({
        query: `
          query($title: String!) {
            mangas(search: $title) {
              title
              cover
              id
            }
          }
        `,
        variables: {
          title: (this.$route.query.title||'')
        }
      })

      if(result.data.value){finish(this)}else{result.then(()=>{finish(this)})}
      // eslint-disable-next-line
      function finish(v: any) {
        v.loading =  false
        v.data = result.data.value.mangas
        v.error = result.error
      }
    }
  }
})
</script>