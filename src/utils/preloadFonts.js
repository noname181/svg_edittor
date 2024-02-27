/*
 * Preloads external @font-face fonts, otherwise they will be downloaded on request
 * which leads to a visible flash on replacement or they won't even appear properly.
 */


const fontsToPreload = [
  `'Open Sans', sans-serif`,
  `'Oswald', sans-serif`,
  `'Playfair Display', serif`,
  `'Cormorant Garamond', serif`,
  `Impact, Charcoal, sans-serif`,
  `'Lucida Console', Monaco, monospace`,
  `'Comic Sans MS', 'Comic Sans', cursive, sans-serif`,
  `'Dancing Script', cursive`,
  `'Indie Flower', cursive`,
  `'Amatic SC', cursive`,
  `'Permanent Marker', cursive`
]



let hiddenLoader = document.createElement('div')
hiddenLoader.style.opacity = 0

fontsToPreload.forEach(font => {
  hiddenLoader.innerHTML += `<span style="font-family: ${font}"></span>`
})

document.body.appendChild(hiddenLoader)
