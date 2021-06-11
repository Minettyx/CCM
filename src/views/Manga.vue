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
    <div class="d-flex justify-content-center" v-else-if="error">
      <h5>{{ error }}</h5>
    </div>
    <div class="container" v-else>
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
                <router-link :to="'/chapter/'+this.$route.params.id+'/'+data.chapters[0].chapter" class="btn btn-primary">Leggi</router-link>
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
              <tr v-for="ch in data.chapters.slice().reverse()" :key="ch">
                <th style="padding: 0px"><router-link :to="'/chapter/'+this.$route.params.id+'/'+ch.chapter" style="text-decoration: none; color: rgb(33, 37, 41); display: block; padding: 8px">{{ (ch.volume ? 'Vol.'+ch.volume+' ' : '') + 'Ch.'+ch.chapter }}</router-link></th>
                <th style="padding: 0px"><router-link :to="'/chapter/'+this.$route.params.id+'/'+ch.chapter" style="text-decoration: none; color: rgb(33, 37, 41); display: block; padding: 8px">{{ch.title||'&nbsp;'}}</router-link></th>
                <td style="padding: 0px"><router-link :to="'/chapter/'+this.$route.params.id+'/'+ch.chapter" style="text-decoration: none; color: rgb(33, 37, 41); display: block; padding: 8px">{{ $timeSince(parseInt(ch.time)) }} fa</router-link></td>
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
import { IManga } from '@/interfaces/apidata';

export default defineComponent({
  name: 'Archive',
  components: {
    NavBar
  },
  data() {
    return {
      data: {} as IManga,
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
          "id": [this.$route.params.id].join()
        }
      })

      const finish = () => {
        this.error = result.data.value.manga===null ? 'Manga non trovato' : false
        this.data = this.error ? this.data : result.data.value.manga
        this.loading =  false
      }
      if(result.data.value){finish()}else{result.then(()=>{finish()})}
    }
  }
})
</script>