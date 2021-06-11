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
        <div class="d-flex justify-content-center" v-else-if="error">
          <h5>{{ error }}</h5>
        </div>
        <div class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3" v-else>
          <div class="col" v-for="o in data" :key="o">
            <router-link :to="'/manga/'+o.id" style="text-decoration: none; color: black">
              <div class="card shadow-sm">
                <img class="bd-placeholder-img card-img-top" style="object-fit: cover; aspect-ratio: 12/17" :src="o.cover" role="img">

                <div class="card-body">
                  <h5 class="card-text" >{{o.title}}</h5>
                </div>
              </div>
            </router-link>
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
import { IManga } from '@/interfaces/apidata';

export default defineComponent({
  name: 'Archive',
  components: {
    NavBar
  },
  data() {
    return {
      data: {} as IManga[],
      loading: true,
      error: false as string | false
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
          title: [this.$route.query.title].join()
        }
      })

      const finish = () => {
        this.error = result.data.value.mangas.length==0 ? 'Nessun risultato' : false
        this.data = this.error ? this.data : result.data.value.mangas
        this.loading =  false
      }
      if(result.data.value){finish()}else{result.then(()=>{finish()})}
    }
  }
})
</script>