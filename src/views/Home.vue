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
        <div class="row g-3" v-if="!loading">
          <div class="col-12 col-lg-6" v-for="manga in data" :key="manga">
            <div class="card">
              <div class="row justify-content-md-center g-5">
                <div class="col-5">
                  <img :src="manga.manga.cover" class="card-img-top" alt="..." @click="this.$router.push('/manga/'+manga.manga.id)" style='cursor: pointer; object-fit: cover; aspect-ratio: 12/17'>
                </div>
                <div class="card-body col-7">
                  <h4 class="card-title" style="font-weight: bold; cursor: pointer; margin-right: 15px"  @click="this.$router.push('/manga/'+manga.manga.id)" >{{manga.manga.title}}</h4>
                  <table class='table table-borderless'>
                    <tbody>
                      <tr v-for="ch in manga.chapters" :key='ch'>
                        <th style="text-align: left;"><a @click="this.$router.push('/chapter/'+manga.manga.id+'/'+ch.chapter)" class="link" style='cursor: pointer;'>{{(ch.volume&&viewport>0 ? 'Vol.'+ch.volume+' ' : '') + 'Ch.'+ch.chapter}}{{ch.title&&viewport>3 ? ' - '+ch.title : ''}}</a></th>
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
import { IManga, IChapter } from '../interfaces/apidata'

export default defineComponent({
  name: 'Home',
  components: {
    NavBar
  },
  data() {
    return {
      data: [] as IChapter[],
      loading: true,
      error: undefined
    }
  },
  watch: {
    'error'() {
      // @ts-expect-error: $toast actually exist, there's probably something set up incorrectly but i don't know
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

      if(result.data.value){finish(this)}else{result.then(()=>{finish(this)})}
      // eslint-disable-next-line
      function finish(v: any) {
        v.loading =  false
        v.data = v.groupData(result.data.value.chapters)
        v.error = result.error
      }
    },

    /** group the data to be used in the home */
    groupData(data: IChapter[]) {
      let res: {manga: IManga, chapters: IChapter[]}[] = []
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