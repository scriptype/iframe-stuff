const tvContainer = document.getElementById('tvContainer')

const CODEPEN_PATTERN = /codepen\.io/i
const IMAGE_PATTERN = /(\.png|\.jpg|\.jpeg|\.svg|\.gif|\.webp)$/i
const VIDEO_PATTERN = /(\.mp4|\.webm|\.mpeg|\.ogg)$/i
const displayDuration = 60 // seconds

const getRandomFrom = (list) => {
  return list[Math.floor(Math.random() * list.length)]
}

const getUniqueRandomFrom = (list, excludeFn) => {
  const uniqueList = list.filter(excludeFn)
  return getRandomFrom(uniqueList)
}

const getElementFromMarkup = (markup) => {
  const el = document.createElement('div')
  el.innerHTML = markup
  return el.firstElementChild
}

const Components = {
  createContainer() {
    return getElementFromMarkup(`<div class="tv-container"></div>`)
  },

  createCreditsBox(visual) {
    return getElementFromMarkup(`
      <aside class="overlay-box credits-box">
        <p class="credits-box__description">${visual.description}</p>
        <p class="credits-box__title-and-author">
          <a target="_blank" href="${visual.url}">${visual.title}</a> by ${visual.author}
        </p>
      </aside>
    `)
  }
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

    const render = (visual) => {
      return createImage(visual)
    }

    return {
      render
    }
  })(),

  video: (() => {
    const createVideo = ({ url, title, author }) => {
      const html = `<video autoplay muted loop src="${url}" alt="${title} by ${author}" class="tv tv-video" />`
      return getElementFromMarkup(html)
    }

    const render = (visual) => {
      return createVideo(visual)
    }

    return {
      render
    }
  })(),

  error: (() => {
    const createErrorMessage = (visual) => {
      const html = `<p class="tv tv-error">Can't display visual: ${visual.url}. Click here to refresh.</p>`
      const error = getElementFromMarkup(html)
      error.addEventListener('click', init)
      return error
    }

    const render = (visual) => {
      return createErrorMessage(visual)
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
  } else if (VIDEO_PATTERN.test(visual.url)) {
    result = Renderers.video.render(visual)
  } else {
    result = Renderers.error.render(visual)
    console.error('Error rendering item:', visual)
  }
  const visualContainer = Components.createContainer()
  const creditsBox = Components.createCreditsBox(visual)
  visualContainer.appendChild(result)
  visualContainer.appendChild(creditsBox)
  tvContainer.appendChild(visualContainer)
  setTimeout(() => {
    result.style.zIndex = 0
    if (tv) {
      tv.remove()
    }
  }, tv ? 1500 : 0)
}

const isDifferentVisual = (visual) => {
  return visual.url !== currentVisual.url
}

const visuals = fetch('./tv.json').then(r => r.json())

let currentVisual = { url: '' }
const init = async () => {
  const visual = getUniqueRandomFrom(await visuals, isDifferentVisual)
  currentVisual = visual
  render(visual)
}

const interval = setInterval(
  init,
  displayDuration * 1000
)
init()
