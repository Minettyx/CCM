<template>
<div>

  <div class="container" v-if="!loadingmanga">
    <div class="row">
      <div class="col-12 col-lg-9">
        <h3 @click="this.$router.push('/manga/'+this.$route.params.manga)" style="text-align: left; cursor: pointer;">{{manga.title}}</h3>
      </div>
      <div class="col-12 col-lg-3">
        <select class="form-select" @change="this.$router.push('/chapter/'+this.$route.params.manga+'/'+$event.target.value)">
          <option :value='ch.chapter' :selected="ch.chapter == this.$route.params.id" v-for="ch in manga.chapters" :key="ch">{{ (ch.volume ? 'Vol.'+ch.volume+' ' : '') + 'Ch.'+ch.chapter }}{{ ch.title ? ' - '+ch.title : '' }}</option>
        </select>
      </div>
    </div>
  </div>

  <div class="album py-5 bg-light">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="container" v-if="!loading">

      <div v-if="!data.webtoon">
        <div v-for="page in data.images" :key="page" class="imgbox">
          <img :src="data.images.indexOf(page)==readingpage||data.images.indexOf(page)==firsttoload||this.loadedimages[this.data.images.indexOf(page)]==1 ? page : ''" class="img-fluid center-fit" style="cursor: pointer;" v-show="Math.abs(data.images.indexOf(page)-readingpage)==0" @click='readnext()' @load="afterimageload(page)">
        </div>
      </div>
      <div v-if="data.webtoon">
        <div v-for="page in data.images" :key="page" >
         <img :src="page" class="img-fluid" style="width: 100%" v-if="data.images.indexOf(page)<=loadlimit" @load="loadlimit++">
        </div>
      </div>

      <br>
      <input type="range" class="form-range" min="0" :max="data.images.length-1" step="0" v-model="readingpage" v-if="!data.webtoon">
      <br>
      <br>
      <nav aria-label="..." class="d-flex justify-content-center" v-if="!loadingmanga">
        <ul class="pagination">
          <li class="page-item" :class="{disabled: this.$route.params.id==manga.chapters[0].chapter}">
            <a style='cursor: pointer;' class="page-link" tabindex="-1" aria-disabled="true" @click="this.$router.push('/chapter/'+this.$route.params.manga+'/'+getChapter(-1))" ><span aria-hidden="true">&laquo;</span></a>
          </li>
          <select class="form-select" @change="this.$router.push('/chapter/'+this.$route.params.manga+'/'+$event.target.value)">
            <option :value='ch.chapter' :selected="ch.chapter == this.$route.params.id" v-for="ch in manga.chapters" :key="ch">{{ (ch.volume ? 'Vol.'+ch.volume+' ' : '') + 'Ch.'+ch.chapter }}{{ ch.title ? ' - '+ch.title : '' }}</option>
          </select>
          <li class="page-item" :class="{disabled: this.$route.params.id==manga.chapters.slice().pop().chapter}">
            <a style='cursor: pointer;' class="page-link" @click="this.$router.push('/chapter/'+this.$route.params.manga+'/'+getChapter(1))"><span aria-hidden="true">&raquo;</span></a>
          </li>
        </ul>
      </nav>

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
      manga: {},
      loading: true,
      loadingmanga: true,
      readingpage: 0,
      loadlimit: 0,
      loadedimages: [],
      firsttoload: 0
    }
  },
  mounted() {
    this.getMangadata();
    this.getdata();
  },
  watch: {
    '$route.params.id': {
      handler() {
        if(this.$route.path.includes('/chapter')) {
          this.getdata()
        }
      },
      deep: true
    }
  },
  methods: {
    getdata() {
      this.readingpage = 0
      this.loadlimit = 0
      this.loading = true;
      this.axios
      .get('https://api.ccmscans.in/chapter/'+this.$route.params.manga+'/'+this.$route.params.id)
      .then(response => {
        this.data = response.data;
        for (let i = 0; i < response.data.images.length; i++) {
          this.loadedimages[i] = 0;
        }
        this.loading = false;
      })
      .catch(() => {
        this.$toast.error(
        "Errore durante il recupero dei dati, prova a ricaricare la pagina",
        {
          position:"bottom-right",
          duration: 5000,
          maxToasts: 1
        })
      })
    },
    getMangadata() {
      this.loadingmanga = true;
      this.axios
      .get('https://api.ccmscans.in/manga/'+this.$route.params.manga)
      .then(response => {
        this.manga = response.data;
        this.loadingmanga = false;
      })
      .catch(() => {
        this.$toast.error(
        "Errore durante il recupero dei dati, prova a ricaricare la pagina",
        {
          position:"bottom-right",
          duration: 5000,
          maxToasts: 1
        })
      })
    },
    getChapter(val) {
      var i = 0;
      var res = ''
      this.manga.chapters.forEach(el => {
        if(el.chapter == this.$route.params.id) {
          res = this.manga.chapters[i+val].chapter
        }
        i++;
      });
      return res
    },
    readnext() {
      if(this.readingpage != this.data.images.length-1) {
        this.readingpage++
      } else if(this.$route.params.id!=this.manga.chapters.slice().pop().chapter) {
        this.$router.push('/chapter/'+this.$route.params.manga+'/'+this.getChapter(1))
      }
    },
    updatefirsttoload() {
      for(let i = this.readingpage; i < this.loadedimages.length; i++) {
        if(this.loadedimages[i] == 0) {
          this.firsttoload = i;
          return
        }
      }
    },
    afterimageload(page) {
      this.loadedimages[this.data.images.indexOf(page)] = 1;
      this.updatefirsttoload();
    }
  }
}
</script>

<style>
.imgbox {
  display: grid;
  height: 100%;
}
.center-fit {
  max-width: 100%;
  max-height: 100vh;
  margin: auto;
}
</style>