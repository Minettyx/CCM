import { App } from "vue"
import {
  enable as enableDarkMode,
  disable as disableDarkMode
} from 'darkreader'

export default {
  install: (app: App<Element>): void => {

    app.mixin({
      data() {
        return {
          darkmode: localStorage.darkmode == "true"
        }
      },
      watch: {
        'darkmode': {
          handler() {
            localStorage.darkmode = this.darkmode ? "true" : "false"
            this.updatedarkmode()
          }
        }
      },
      created() {
        if (!this.$parent) {
          this.updatedarkmode()
        }
      },
      methods: {
        /** update the actual style */
        updatedarkmode() {
          if (this.darkmode) {
            enableDarkMode({
              brightness: 100,
              contrast: 90,
              sepia: 10,
            })
          } else {
            disableDarkMode()
          }
        }
      }
    })
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    darkmode: boolean
  }
}