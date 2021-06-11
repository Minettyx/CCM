<template>
<div>
  <NavBar></NavBar>
  <h1 v-if="!loading">{{ data.title }}</h1>
  <div class="album py-5 bg-light">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="container" v-if="!loading">
      <div class="row justify-content-md-center">
        <div class="col-lg-3">
          <div class="card sticky-top" style="top: 70px; z-index: 0">
            <div class="row justify-content-md-center">
              <div class="col-6 col-lg-12">
                <img :src="data.cover" class="card-img-top" alt="...">
              </div>
              <div class="card-body col-6 col-lg-12">
                <h4 class="card-title" style="font-weight: bold;">{{ data.title }}</h4>
                <h6 class="card-subtitle mb-2 text-muted">Stato originale: {{ $parseStatus(data.status) }}</h6>
                <h6 class="card-subtitle mb-2 text-muted" v-if="data.author">Autore: {{ data.author }}</h6>
                <h6 class="card-subtitle mb-2 text-muted" v-if="data.artist">Artista: {{ data.artist }}</h6>
                <a @click="this.$router.push('/chapter/'+this.$route.params.id+'/'+data.chapters[0].chapter)" class="btn btn-primary">Leggi</a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-9">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Titolo</th>
                <th scope="col">Data</th>
              </tr>
            </thead>
            <tbody>
              <tr style='cursor: pointer;' @click="this.$router.push('/chapter/'+this.$route.params.id+'/'+ch.chapter)" v-for="ch in data.chapters.slice().reverse()" :key="ch">
                <th>{{ (ch.volume ? 'Vol.'+ch.volume+' ' : '') + 'Ch.'+ch.chapter }}</th>
                <th>{{ch.title}}</th>
                <td>{{ $timeSince(parseInt(ch.time)) }} fa</td>
              </tr>
            </tbody>
          </table>
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
      // eslint-disable-next-line
      errore: undefined
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
          query ($id: String!) {
            manga(id: $id) {
              id
              title
              cover
              status
              author
              artist
              chapters {
                chapter
                volume
                title
                time
              }
            }
          }
        `,
        variables: {
          "id": this.$route.params.id
        }
      })

      if(result.data.value){finish(this)}else{result.then(()=>{finish(this)})}
      // eslint-disable-next-line
      function finish(v: any) {
        v.loading =  false
        v.data = result.data.value.manga
        v.error = result.error
      }
    }
  }
})
</script>