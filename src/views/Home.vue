<template>
  <div>
    <NavBar></NavBar>
    <h1>Ultimi Capitoli</h1>
    
    <div class="album py-5 bg-light">
      <div class="container">
        <div class="d-flex justify-content-center" v-if="loading">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div class="row g-3" v-else>
          <div class="col-12 col-lg-6" v-for="manga in data" :key="manga">
            <div class="card">
              <div class="row justify-content-md-center g-5">
                <div class="col-5">
                  <router-link :to="'/manga/'+manga.manga.id"><img :src="manga.manga.cover" class="card-img-top" style='object-fit: cover; aspect-ratio: 12/17'></router-link>
                </div>
                <div class="card-body col-7">
                  <router-link :to="'/manga/'+manga.manga.id" style="text-decoration: none; color: black"><h4 class="card-title" style="font-weight: bold; margin-right: 15px">{{manga.manga.title}}</h4></router-link>
                  <table class='table table-borderless'>
                    <tbody>
                      <tr v-for="ch in manga.chapters" :key='ch'>
                        <th style="text-align: left"><router-link :to="'/chapter/'+manga.manga.id+'/'+ch.chapter">{{(ch.volume&&viewport>0 ? 'Vol.'+ch.volume+' ' : '') + 'Ch.'+ch.chapter}}{{ch.title&&viewport>3 ? ' - '+ch.title : ''}}</router-link></th>
                        <td style="text-align: right"><span class="text-muted" >{{ $timeSince(new Date(parseInt(ch.time))) }} fa</span></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
import { Manga, Chapter } from '../types'

export default defineComponent({
  name: 'Home',
  components: {
    NavBar
  },
  data() {
    return {
      data: [] as { manga: Manga; chapters: Chapter[]; }[],
      loading: true
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
          {
            chapters(limit: 20) {
              chapter
              volume
              title
              time
              manga {
                id
                title
                cover
              }
            }
          }
        `
      })

      const finish = () => {
        this.data = this.groupData(result.data.value.chapters)
        this.loading =  false
      }
      if(result.data.value){finish()}else{result.then(()=>{finish()})}
    },

    /** group the data to be used in the home */
    groupData(data: Chapter[]) {
      let res: {manga: Manga, chapters: Chapter[]}[] = []
      data.forEach(ch => {
        let index = -1;
        let i = 0;
        res.forEach(test => {
          if(test.manga.id === ch.manga.id) {
            index = i;
          }
          i++
        })
        if(index === -1) {
          res.push({manga: ch.manga, chapters: [ch]})
        } else {
          res[index].chapters.push(ch)
        }
      })
      return res
    }
  }
})
</script>