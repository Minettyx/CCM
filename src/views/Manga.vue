<template>
<div>
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
          <div class="card">
            <div class="row justify-content-md-center">
              <div class="col-6 col-lg-12">
                <img :src="data.cover" class="card-img-top" alt="...">
              </div>
              <div class="card-body col-6 col-lg-12">
                <h4 class="card-title" style="font-weight: bold;">{{ data.title }}</h4>
                <h6 class="card-subtitle mb-2 text-muted">Stato originale: {{ parseStatus(data.status) }}</h6>
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
                <td>{{ timeSince(ch.time) }} fa</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Archive',
  data() {
    return {
      data: {chapters: []},
      loading: true
    }
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.loading = true;
      this.axios
      .get('https://api.ccmscans.in/manga/'+this.$route.params.id)
      .then(response => {
        this.data = response.data;
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
    parseStatus(val) {
      switch (val) {
        case 1:
          return 'In corso'
        case 2:
          return 'Finito'
        case 3:
          return 'Cancellato'
        case 4:
          return 'In Stallo'
        default:
          return ''
      }
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