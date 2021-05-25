class Affix {
  public init(): void {
    
    window.onscroll = () => {
      const els = document.querySelectorAll('[data-affix]')
      for (let i = 0; i < els.length; i++) {
        const el = els[i] as HTMLElement

        let ypos = 0

        if(window.scrollY > (ypos - parseInt(el.getAttribute('data-affix') || '0'))) {
          el.classList.add('sticky-top')
          el.style.top = (parseInt(el.getAttribute('data-affix') || '0'))+'px'
        } else {
          el.classList.remove('sticky-top')
          el.style.top = '0px'
          ypos = el.offsetTop
        } 
      }
    }
  }

  public unmount(): void {
    window.onscroll = () => {
      return
    }
  }
}

export default new Affix()