<template>
<div class="container-fluid">

  <div class="album py-5 bg-light" v-if="loading||error">
    <div class="d-flex justify-content-center" v-if="loading&&!error">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="d-flex justify-content-center" v-if="error">
      <h5>{{ error }}</h5>
    </div>
  </div>

  <div style="position: fixed; width: 100%; left: 0; right: 0; top: 10px;">
    <div v-if="!loading&&!error" class="container" :style="{'opacity': gui ? '1' : '0', 'visibility': gui ? 'visible' : 'hidden'}" style="display: flex; align-items: center; text-align: left; transition: visibility 0.25s, opacity 0.25s linear;">
      <div style="padding: 6px 10px; border-radius: 100px;" class="cborder"><router-link :to="'/manga/'+this.$route.params.manga"><fai icon='arrow-left' class="fa-lg"/></router-link></div>
      <div style="padding: 7px 7px 2px 7px;" class="cborder"><h6>{{ manga.title }}</h6><small>{{ (data.volume ? 'Vol.'+data.volume+' ' : '') + 'Ch.'+data.chapter }}{{ data.title ? ' - '+data.title : '' }}</small></div>
      <div style="padding: 6px 10px; border-radius: 100px; margin-left: auto;" class="cborder"><a type="button" data-bs-toggle="modal" data-bs-target="#settingsmodal"><fai icon='cog' class="fa-lg"/></a></div>
    </div>
  </div>

  <div style="position: fixed; width: 100%; left: 0; right: 0; bottom: 10px;">
    <div v-if="!loading&&!error" class="container" :style="{'opacity': gui ? '1' : '0', 'visibility': gui ? 'visible' : 'hidden'}" style="display: flex; align-items: center; transition: visibility 0.25s, opacity 0.25s linear;">
      <router-link v-if="readdir=='ltr'&&this.$route.params.id!=manga.chapters[0].chapter" :to="'/chapter/'+this.$route.params.manga+'/'+getChapter(-1)" class="cborder" style="padding: 1px 8px; margin-right: auto;"><fai icon='chevron-left' class="fa-lg"/></router-link>
      <router-link v-if="readdir=='rtl'&&this.$route.params.id!=manga.chapters.slice().pop().chapter" :to="'/chapter/'+this.$route.params.manga+'/'+getChapter(1)" class="cborder" style="padding: 1px 8px; margin-right: auto;"><fai icon='chevron-left' class="fa-lg"/></router-link>
      <input v-if="!data.webtoon" type="range" class="form-range cborder" min="0" :max="data.images.length-1" step="0" v-model="readingpage" style="padding: 10px;" :style="{ 'direction': readdir }">
      <router-link v-if="readdir=='ltr'&&this.$route.params.id!=manga.chapters.slice().pop().chapter" :to="'/chapter/'+this.$route.params.manga+'/'+getChapter(1)" class="cborder" style="padding: 1px 8px; margin-left: auto;"><fai icon='chevron-right' class="fa-lg"/></router-link>
      <router-link v-if="readdir=='rtl'&&this.$route.params.id!=manga.chapters[0].chapter" :to="'/chapter/'+this.$route.params.manga+'/'+getChapter(-1)" class="cborder" style="padding: 1px 8px; margin-left: auto;"><fai icon='chevron-right' class="fa-lg"/></router-link>
    </div>
  </div>

  <div class="row" v-if="!loading&&!error">
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

  <!-- Modal -->
  <div class="modal fade" id="settingsmodal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Impostazioni</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Direzione di lettura</p>
          <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" name="btnradio" value="ltr" id="btnradio1" autocomplete="off" v-model="readdir" checked>
            <label class="btn btn-outline-primary" for="btnradio1">Da sinistra a destra</label>
            <input type="radio" class="btn-check" name="btnradio" value="rtl" id="btnradio2" autocomplete="off" v-model="readdir">
            <label class="btn btn-outline-primary" for="btnradio2">Da destra a sinistra</label>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useQuery } from '@urql/vue';
import { IManga, IChapter } from '../interfaces/apidata'

export default defineComponent({
  name: 'Archive',
  data() {
    return {
      data: {} as IChapter,
      manga: {} as IManga,
      loading: true,
      error: false as string | false,
      readingpage: 0,
      loadlimit: 0,
      loadedimages: [] as number[],
      firsttoload: 0,
      gui: true,
      readdir: 'ltr'
    }
  },
  mounted() {
    this.getdata(() => {

      /** get current paga from hash if exist */
      const hashpage = parseInt(location.hash.substring(1))
      if(hashpage) {
        this.readingpage = (hashpage>=1&&hashpage<=this.data.images.length ? hashpage : 1)-1
      } else if(location.hash.substring(1) == 'last') {
        this.readingpage = this.data.images.length-1
      }

      /** array keys to navigate */
      // eslint-disable-next-line
      window.onkeydown = (e: any) => {
        if (e.key == 'ArrowLeft') {
          this.readleft()
        } else if(e.key == 'ArrowRight') {
          this.readright()
        }
      }

      /** getting reading direction from cookie */
      this.readdir = this.$getCookie('readdir') || 'ltr'
    })
  },
  beforeUnmount() {
    /** remove events */
    window.onkeydown = () => {return}
  },

  watch: {
    /** update hash on page change */
    'readingpage': {
      handler() {
        history.replaceState(history.state, '', '#'+(this.readingpage+1))
      }
    },

    /** update cokkie on reading diractiuon change */
    'readdir': {
      handler() {
        this.$setCookie('readdir', this.readdir, 36500)
      }
    }
  },
  methods: {
    /* Fetch data from the api */
    getdata(callback?: () => void) {
      this.readingpage = 0
      this.loadlimit = 0
      this.loading = true
      let result = useQuery({
        query: `
          query($manga: String!, $chapter: String!) {
            chapter(manga: $manga, chapter: $chapter) {
              chapter
              volume
              title
              manga {
                id
                title
                cover
                chapters {
                  chapter
                  volume
                  title
                }
              }
              webtoon
              images
            }
          }
        `,
        variables: {
          manga: this.$route.params.manga,
          chapter: this.$route.params.id
        }
      })

      const finish = () => {
        this.error = result.data.value.chapter===null ? 'Capitolo non trovato' : false
        if(this.error) return

        this.data = result.data.value.chapter;
        for (let i = 0; i < result.data.value.chapter.images.length; i++) {
          this.loadedimages[i] = 0;
        }
        this.manga = result.data.value.chapter.manga

        /** onyl call if defined */
        callback && callback()

        this.loading = false
      }
      if(result.data.value){finish()}else{result.then(()=>{finish()})}
    },

    /** get chapter relative to the current one */
    getChapter(val: number) {
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

    /** go to the page to the right */
    readright() {
      if(this.readdir == 'rtl') {
        this.realprevious()
      } else {
        this.realnext()
      }
    },
    /** go to the page to the left */
    readleft() {
      if(this.readdir == 'rtl') {
        this.realnext()
      } else {
        this.realprevious()
      }
    },
    /** go to the next page or next chapter */
    realnext() {
      if(!this.data.webtoon) {
        if(this.readingpage != this.data.images.length-1) {
          this.readingpage++
        } else if(this.$route.params.id!=this.manga.chapters.slice().pop()?.chapter) {
          this.$router.push('/chapter/'+this.$route.params.manga+'/'+this.getChapter(1))
        } else {
          this.$router.push('/manga/'+this.$route.params.manga)
        }
      } else {
        if(this.$route.params.id!=this.manga.chapters.slice().pop()?.chapter) {
          this.$router.push('/chapter/'+this.$route.params.manga+'/'+this.getChapter(1))
        } else {
          this.$router.push('/manga/'+this.$route.params.manga)
        }
      }
    },
    /** go to the previous page or previous chapter */
    realprevious() {
      if(!this.data.webtoon) {
        if(this.readingpage != 0) {
          this.readingpage--
        } else if(this.$route.params.id!=this.manga.chapters[0].chapter) {
          this.$router.push('/chapter/'+this.$route.params.manga+'/'+this.getChapter(-1)+'#last')
        } else {
          this.$router.push('/manga/'+this.$route.params.manga)
        }
      } else {
        if(this.$route.params.id!=this.manga.chapters[0].chapter) {
          this.$router.push('/chapter/'+this.$route.params.manga+'/'+this.getChapter(-1)+'#last')
        } else {
          this.$router.push('/manga/'+this.$route.params.manga)
        }
      }
    },
    /** update the next image to be loadded */
    updatefirsttoload() {
      for(let i = this.readingpage; i < this.loadedimages.length; i++) {
        if(this.loadedimages[i] == 0) {
          this.firsttoload = i;
          return
        }
      }
    },
    /** load next image after one has loaded */
    afterimageload(page: string) {
      this.loadedimages[this.data.images.indexOf(page)] = 1;
      this.updatefirsttoload();
    },
    /** calculate witch side of the image you clicked */
    // eslint-disable-next-line
    imageclick(e: any) {
      const width = e.target.getBoundingClientRect().width
      if(e.pageX-(screen.width-width)/2 > width/3*2) {
        this.readright()
      } else if(e.pageX-(screen.width-width)/2 < width/3) {
        this.readleft()
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