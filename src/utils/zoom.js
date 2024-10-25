/*
 * Zoom for FabricJS.
 */


const minZoom = 0.05
const maxZoom = 3
export const zoomOptions = [0.05, 0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3]


// apply zoom on canvas
export const applyZoom = (canvas, zoom) => {
  canvas.setZoom(zoom)
  if(canvas.width < canvas.height) {
    canvas.setWidth(canvas.originalW * canvas.getZoom())
    canvas.setHeight(canvas.originalH * canvas.getZoom())
  }else {
    canvas.setWidth(canvas.originalH * canvas.getZoom())
    canvas.setHeight(canvas.originalW * canvas.getZoom())
  }

  canvas.renderAll()

  // center the scrollbars
  let holder = document.querySelector('.canvas-holder')
  let holderW = holder.offsetWidth
  let holderH = holder.offsetHeight
  let container = document.querySelector('.canvas-container')
  let containerW = container.offsetWidth + 100
  let containerH = container.offsetHeight + 100
  holder.scrollLeft = (containerW - holderW) / 2
  holder.scrollTop = (containerH - holderH) / 2
}


// keyboard shortcuts and zoom calculations
export const zoomWithKeys = (e, canvas, setZoom, applyZoom) => {
  const key = e.which || e.keyCode

  // ctr -: zoom out
  if (key === 109 && e.ctrlKey) {
    e.preventDefault()
    if (canvas.getZoom() === minZoom) return

    let updatedZoom = parseInt(canvas.getZoom() * 100)

    // 25% jumps
    if ((updatedZoom % 25) !== 0) {
      while ((updatedZoom % 25) !== 0) {
        updatedZoom = updatedZoom - 1
      }
    } else {
      updatedZoom = updatedZoom - 25
    }

    updatedZoom = updatedZoom / 100
    updatedZoom = (updatedZoom <= 0) ? minZoom : updatedZoom

    setZoom(updatedZoom)
    applyZoom(canvas, updatedZoom)
  }


  // ctr +: zoom in
  if (key === 107 && e.ctrlKey) {
    e.preventDefault()
    if (canvas.getZoom() === maxZoom) return

    let updatedZoom = parseInt(canvas.getZoom() * 100)

    // 25% jumps
    if ((updatedZoom % 25) !== 0) {
      while ((updatedZoom % 25) !== 0) {
        updatedZoom = updatedZoom + 1
      }
    } else {
      updatedZoom = updatedZoom + 25
    }

    updatedZoom = updatedZoom / 100
    updatedZoom = (updatedZoom > maxZoom) ? maxZoom : updatedZoom

    setZoom(updatedZoom)
    applyZoom(canvas, updatedZoom)
  }


  // ctr 0: reset
  if ((key === 96 || key === 48 || key === 192) && e.ctrlKey) {
    e.preventDefault()
    setZoom(1)
    applyZoom(canvas, 1)
  }
}


// zoom with mouse
export const zoomWithMouse = (e, canvas, setZoom, applyZoom) => {
  if (!e.ctrlKey) return
  e.preventDefault()

  let updatedZoom = Number(canvas.getZoom()).toFixed(2)
  let zoomAmount = (e.deltaY > 0) ? -5 : 5
  updatedZoom = ((updatedZoom * 100) + zoomAmount) / 100
  if (updatedZoom < minZoom || updatedZoom > maxZoom) return

  setZoom(updatedZoom)
  applyZoom(canvas, updatedZoom)
}
