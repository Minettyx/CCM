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

      <img :src="page" class="img-fluid" style="width: 100%" v-for="page in pagesloading" :key="page" @load="loadNextImage()">
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
      loaded: 0,
      pagesloading: []
    }
  },
  mounted() {
    this.getMangadata();
    this.getdata();
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.getdata()
      },
      deep: true
    }
  },
  methods: {
    async getdata() {
      this.loading = true;
      this.loaded = 0;
      this.pagesloading = [];
      await this.axios
      .get('https://api.ccmscans.in/chapter/'+this.$route.params.manga+'/'+this.$route.params.id)
      .then(response => {
        this.data = response.data;
        this.pagesloading.push(response.data.images[0])
        this.loading = false;
      })
    },
    async getMangadata() {
      this.loadingmanga = true;
      await this.axios
      .get('https://api.ccmscans.in/manga/'+this.$route.params.manga)
      .then(response => {
        this.manga = response.data;
        this.loadingmanga = false;
      })
    },
    loadNextImage() {
      this.loaded++;
      this.pagesloading.push(this.data.images[this.loaded])
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
    }
  }
}
</script>