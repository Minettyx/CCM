// import { Query } from "@/types";
// import { UseQueryResponse } from "@urql/vue";
import { App } from "vue"

export default {
  install: (app: App<Element>): void => {

    /* Calculate the "x ... ago" string from a date */
    app.config.globalProperties.$timeSince = (date: Date | string | number): string => {

      const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

      let interval = seconds / 31536000;

      if (interval > 1) {
        if(Math.floor(interval) == 1) {
          return Math.floor(interval) + " anno"
        } else {
          return Math.floor(interval) + " anni"
        }
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        if(Math.floor(interval) == 1) {
          return Math.floor(interval) + " mese"
        } else {
          return Math.floor(interval) + " mesi"
        }
      }
      interval = seconds / 86400;
      if (interval > 1) {
        if(Math.floor(interval) == 1) {
          return Math.floor(interval) + " giorno"
        } else {
          return Math.floor(interval) + " giorni"
        }
      }
      interval = seconds / 3600;
      if (interval > 1) {
        if(Math.floor(interval) == 1) {
          return Math.floor(interval) + " ora"
        } else {
          return Math.floor(interval) + " ore"
        }
      }
      interval = seconds / 60;
      if (interval > 1) {
        if(Math.floor(interval) == 1) {
          return Math.floor(interval) + " minuto"
        } else {
          return Math.floor(interval) + " minuti"
        }
      }
      if(Math.floor(interval) == 1) {
        return Math.floor(interval) + " secondo"
      } else {
        return Math.floor(interval) + " secondi"
      }
    }

    app.config.globalProperties.$parseStatus = (val: number) => {
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
    }

    /* https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript */
    app.config.globalProperties.$setCookie = (name: string, value: string, days: number | false = false): void => {
      let expires = "";
      if (days) {
        const date = new Date();
          date.setTime(date.getTime() + (days*24*60*60*1000));
          expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    },
    app.config.globalProperties.$getCookie = (name: string): string | null => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    app.config.globalProperties.$eraseCookie = (name: string): void => {   
      document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // eslint-disable-next-line
    // app.config.globalProperties.$onQueryFinish = (query: UseQueryResponse<any, any>): Promise<Query> => {
    //   return new Promise<Query>((resolve) => {
    //     if(query.data.value) {
    //       resolve(query.data.value)
    //     } else {
    //       query.then(() => {
    //         resolve(query.data.value)
    //       })
    //     }
    //   })
    // }
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $timeSince: (date: Date | string | number) => string
    $parseStatus: (val: number) => string
    $setCookie: (name: string, value: string, days: number | false) => void
    $getCookie: (name: string) => string | null
    $eraseCookie: (name: string) => void
    // $onQueryFinish: (query: UseQueryResponse<any, any>) => Promise<Query> // eslint-disable-line
  }
}