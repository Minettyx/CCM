import { App } from "vue"

export default {
  install: (app: App<Element>): void => {
    
    app.mixin({
      data() {
        return {
          viewport: 4
        }
      },
      created() {
        this.updateViewport()
        window.addEventListener('resize', this.updateViewport)
      },
      beforeUnmount() {
        window.removeEventListener('resize', this.updateViewport)
      },
      methods: {
        updateViewport() {
          const width = Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
          )
          if (width <= 576) { this.viewport = 0 }
          else if (width <= 768) { this.viewport= 1 }
          else if (width <= 992) { this.viewport = 2 }
          else if (width <= 1200) { this.viewport = 3 }
          else { this.viewport = 4 }
        }
      }
    })
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    viewport: number
  }
}