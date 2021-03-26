<template>
  <div>
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
                  <img :src="manga.cover" class="card-img-top" alt="..." @click="this.$router.push('/manga/'+manga.id)" style='cursor: pointer; object-fit: cover; aspect-ratio: 2/3'>
                </div>
                <div class="card-body col-7">
                  <h4 class="card-title" style="font-weight: bold; cursor: pointer;"  @click="this.$router.push('/manga/'+manga.id)" >{{manga.title}}</h4>
                  <table class='table table-borderless'>
                    <tbody>
                      <tr v-for="ch in manga.chapters" :key='ch'>
                        <th style="text-align: left;"><a @click="this.$router.push('/chapter/'+manga.id+'/'+ch.chapter)" class="link" style='cursor: pointer;'>{{(ch.volume ? 'Vol.'+ch.volume+' ' : '') + 'Ch.'+ch.chapter}}{{ch.title ? ' - '+ch.title : ''}}</a></th>
                        <td style="text-align: right"><span class="text-muted" >{{timeSince(ch.time)}} fa</span></td>
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

<script>
export default {
  name: 'Home',
  data() {
    return {
      data: [],
      loading: true
    }
  },
  mounted() {
    this.getdata();
  },
  methods: {
    async getdata() {
      this.loading = true;
      await this.axios
      .get('https://api.ccmscans.in/chapters?sort=time&limit=20&grouped=1')
      .then(response => {
        this.data = response.data;
        this.loading = false;
      })
    },
    timeSince(date) {

      var seconds = Math.floor((new Date() - new Date(date)) / 1000);

      var interval = seconds / 31536000;

      if (interval > 1) {
        if(Math.floor(interval) == 1) {
          return Math.floor(interval) + " anno";
        } else {
          return Math.floor(interval) + " anni";
        }
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        if(Math.floor(interval) == 1) {
          return Math.floor(interval) + " mese";
        } else {
          return Math.floor(interval) + " mesi";
        }
      }
      interval = seconds / 86400;
      if (interval > 1) {
        if(Math.floor(interval) == 1) {
          return Math.floor(interval) + " giorno";
        } else {
          return Math.floor(interval) + " giorni";
        }
      }
      interval = seconds / 3600;
      if (interval > 1) {
        if(Math.floor(interval) == 1) {
          return Math.floor(interval) + " ora";
        } else {
          return Math.floor(interval) + " ore";
        }
      }
      interval = seconds / 60;
      if (interval > 1) {
        if(Math.floor(interval) == 1) {
          return Math.floor(interval) + " minuto";
        } else {
          return Math.floor(interval) + " minuti";
        }
      }
      if(Math.floor(interval) == 1) {
        return Math.floor(interval) + " secondo";
      } else {
        return Math.floor(interval) + " secondi";
      }
    }
  }
}
</script>