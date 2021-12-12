const tvContainer = document.getElementById('tvContainer')

const displayDuration = 60 // seconds

let nowDisplaying = {
  url: null
}

const CODEPEN_PATTERN = /codepen\.io/
const IMAGE_PATTERN = /(\.png|\.jpg|\.jpeg|\.svg|\.gif|\.webp)$/

const getRandomFrom = (list) => {
  nowDisplaying = list.filter(l => l.url != nowDisplaying.url)[Math.floor(Math.random() * (list.length - 1))]
  return nowDisplaying
}

const getElementFromMarkup = (markup) => {
  const el = document.createElement('div')
  el.innerHTML = markup
  return el.firstElementChild
}

const Renderers = {
  codepen: (() => {
    const getPenDataFromLink = (url) => {
      const [ , user, slugHash ] = url.match(/(\w+)\/pen\/(\w+)/)
      return { user, slugHash }
    }

    const createIframe = (penData) => {
      const link = (
        "https://codepen.io/" +
        penData.user +
        "/embed/" +
        penData.slugHash +
        "?user=" +
        penData.user +
        "&amp;slug-hash=" +
        penData.slugHash +
        "&amp;height=100&amp;default-tab=result&amp;name=cp_embed_1"
      )
      const html = `
           <iframe
               allowfullscreen="true"
               allowtransparency="true"
               class="cp_embed_iframe tv tv-codepen"
               frameborder="0"
               name="cp_embed_1"
               scrolling="no"
               loading="lazy"
               id="cp_embed_${penData.slugHash}"
               src="${link}">
           </iframe>
      `
      return getElementFromMarkup(html)
    }

    const render = ({ url }) => {
      const pen = getPenDataFromLink(url)
      return createIframe(pen)
    }

    return {
      render
    }
  })(),

  image: (() => {
    const createImage = ({ url, title, author }) => {
      const html = `<img src="${url}" alt="${title} by ${author}" class="tv tv-image" />`
      return getElementFromMarkup(html)
    }

    const render = (link) => {
      return createImage(link)
    }

    return {
      render
    }
  })()
}

const render = (visual) => {
  const tv = document.querySelector('.tv')
  let result
  if (CODEPEN_PATTERN.test(visual.url)) {
    result = Renderers.codepen.render(visual)
  } else if (IMAGE_PATTERN.test(visual.url)) {
    result = Renderers.image.render(visual)
  }
  tvContainer.appendChild(result)
  setTimeout(() => {
    result.style.zIndex = 0
    if (tv) {
      tv.remove()
    }
  }, tv ? 1500 : 0)
}

const visuals = fetch('./tv.json').then(r => r.json())

const init = async () => {
  const visual = getRandomFrom(await visuals)
  render(visual)
}

const interval = setInterval(
  init,
  displayDuration * 1000
)
init()