const penContainer = document.getElementById('penContainer')

const displayDuration = 60 // seconds

let nowDisplaying = {
  user: null,
  slugHash: null
}

const getRandomFrom = (list) => {
  nowDisplaying = list.filter(l => l.slugHash != nowDisplaying.slugHash)[Math.floor(Math.random() * list.length)]
  return nowDisplaying
}

const getPenDataFromLink = (url) => {
  const [ , user, slugHash ] = url.match(/(\w+)\/pen\/(\w+)/)
  return { user, slugHash }
}

const getElementFromMarkup = (markup) => {
  const el = document.createElement('div')
  el.innerHTML = markup
  return el.firstElementChild
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
           class="cp_embed_iframe tv"
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

const renderPen = (pen) => {
  const tv = document.querySelector('.tv')
  const iframe = createIframe(pen)
  penContainer.appendChild(iframe)
  setTimeout(() => {
    iframe.style.zIndex = 0;
    if (tv) {
      tv.remove()
    }
  }, tv ? 1500 : 0)
}

const penData = fetch('./tv.txt')
  .then(r => r.text())
  .then(text => text.split('\n'))
  .then(lines => lines.filter(l => !!l.trim()))
  .then(links => links.map(getPenDataFromLink))

const init = async () => {
  const pen = getRandomFrom(await penData)
  renderPen(pen)
}

const interval = setInterval(
  init,
  displayDuration * 1000
)
init()