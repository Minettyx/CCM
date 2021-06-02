<template>
<div class="container-fluid">

  <div class="album py-5 bg-light" v-if="loading">
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>

  <div style="position: fixed; width: 100%; left: 0; right: 0; top: 10px;">
    <div v-if="!loading" class="container" :style="{'opacity': gui ? '1' : '0', 'visibility': gui ? 'visible' : 'hidden'}" style="display: flex; align-items: center; text-align: left; transition: visibility 0.25s, opacity 0.25s linear;">
      <div style="padding: 6px 10px; border-radius: 100px;" class="cborder"><router-link :to="'/manga/'+this.$route.params.manga"><fai icon='arrow-left' class="fa-lg"/></router-link></div>
      <div style="padding: 7px 7px 2px 7px;" class="cborder"><h6>{{ manga.title }}</h6><small>{{ (data.volume ? 'Vol.'+data.volume+' ' : '') + 'Ch.'+data.chapter }}{{ data.title ? ' - '+data.title : '' }}</small></div>
      <!-- <div style="padding: 6px 10px; border-radius: 100px; margin-left: auto;" class="cborder"><a type="button"><fai icon='cog' class="fa-lg"/></a></div> -->
    </div>
  </div>

  <div style="position: fixed; width: 100%; left: 0; right: 0; bottom: 10px;">
    <div v-if="!loading" class="container" :style="{'opacity': gui ? '1' : '0', 'visibility': gui ? 'visible' : 'hidden'}" style="display: flex; align-items: center; transition: visibility 0.25s, opacity 0.25s linear;">
      <router-link v-if="this.$route.params.id!=manga.chapters[0].chapter" :to="'/chapter/'+this.$route.params.manga+'/'+getChapter(-1)" class="cborder" style="padding: 1px 8px; margin-left: auto;"><fai icon='chevron-left' class="fa-lg"/></router-link>
      <input v-if="!data.webtoon" type="range" class="form-range cborder" min="0" :max="data.images.length-1" step="0" v-model="readingpage" style="padding: 10px;">
      <router-link v-if="this.$route.params.id!=manga.chapters.slice().pop().chapter" :to="'/chapter/'+this.$route.params.manga+'/'+getChapter(1)" class="cborder" style="padding: 1px 8px; margin-right: auto;"><fai icon='chevron-right' class="fa-lg"/></router-link>
    </div>
  </div>

  <div class="row" v-if="!loading">
    <div class="col-0 col-lg-1 col-xl-2"></div>
    <div class="col-12 col-lg-10 col-xl-8" style="padding: 0px">
      <div>
        <div v-if="!data.webtoon">
          <div v-for="page in data.images" :key="page" class="imgbox" :style="{ 'height': Math.abs(data.images.indexOf(page)-readingpage)==0 ? '100vh' : '0px' }">
            <img
              :src="data.images.indexOf(page)==readingpage||data.images.indexOf(page)==firsttoload||this.loadedimages[this.data.images.indexOf(page)]==1 ? page : ''"
              class="img-fluid cimage"
              style="cursor: pointer;"
              v-show="Math.abs(data.images.indexOf(page)-readingpage)==0"
              @click='imageclick($event)'
              @load="afterimageload(page)"
            >
          </div>
        </div>
        <div v-if="data.webtoon">
          <div v-for="page in data.images" :key="page" >
          <img :src="page" class="img-fluid" style="width: 100%" v-if="data.images.indexOf(page)<=loadlimit" @load="loadlimit++" @click="gui = !gui">
          </div>
        </div>
      </div>
    </div>
    <div class="col-0 col-lg-1 col-xl-2"></div>
  </div>

</div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Archive',
  data() {
    return {
      data: {},
      manga: {},
      loading: true,
      readingpage: 0,
      loadlimit: 0,
      loadedimages: [],
      firsttoload: 0,
      gui: true
    }
  },
  mounted() {
    this.getdata()
    window.onkeydown = (e) => {
      if(!this.loading) {
        if (e.key == 'ArrowLeft') {
          this.readprevious()
        } else if(e.key == 'ArrowRight') {
          this.readnext()
        }
      }
    }
  },
  beforeUnmount() {
    window.onkeydown = () => {return}
  },
  watch: {
    '$route.params.id': {
      handler() {
        if(this.$route.path.includes('/chapter')) {
          this.getdata()
        }
      },
      deep: true
    },
    'readingpage': {
      handler() {
        history.pushState(history.state, '', '#'+(parseInt(this.readingpage)+1))
      }
    }
  },
  methods: {
    getdata() {
      this.readingpage = 0
      this.loadlimit = 0
      this.loading = true;
      this.axios
      .get('https://api.ccmscans.in/chapter/'+this.$route.params.manga+'/'+this.$route.params.id+'?mangainfo=1')
      .then(response => {
        this.data = response.data;
        for (let i = 0; i < response.data.images.length; i++) {
          this.loadedimages[i] = 0;
        }
        this.manga = response.data.manga
        this.loading = false
        const hashpage = parseInt(location.hash.substring(1))
        if(hashpage) {
          this.readingpage = (hashpage>=1&&hashpage<=this.data.images.length ? hashpage : 1)-1
        } else if(location.hash.substring(1) == 'last') {
          this.readingpage = this.data.images.length-1
        }
        
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
        i++
      })
      return res
    },
    readnext() {
      if(this.readingpage != this.data.images.length-1) {
        this.readingpage++
      } else if(this.$route.params.id!=this.manga.chapters.slice().pop().chapter) {
        this.$router.push('/chapter/'+this.$route.params.manga+'/'+this.getChapter(1))
      }
    },
    readprevious() {
      if(this.readingpage != 0) {
        this.readingpage--
      } else if(this.$route.params.id!=this.manga.chapters[0].chapter) {
        this.$router.push('/chapter/'+this.$route.params.manga+'/'+this.getChapter(-1)+'#last')
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
    },
    imageclick(e) {
      const width = e.target.getBoundingClientRect().width
      if(e.pageX-(screen.width-width)/2 > width/3*2) {
        this.readnext()
      } else if(e.pageX-(screen.width-width)/2 < width/3) {
        this.readprevious()
      } else {
        this.gui = !this.gui
      }
    }
  }
})
</script>

<style>
.imgbox {
  display: grid;
  width:100%;
  vertical-align:top;
  text-align:center;
  overflow-x:hidden;
}
.cimage {
  max-width: 100%;
  max-height: 100vh;
  display: block;
  margin: auto;
}
.cborder {
  background: #ebebeb;
  border-radius: 15px;
}
</style>