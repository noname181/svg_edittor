/*
 * Gradient tools for FabricJS.
 */


const gradCoordsToAngle = (gradCoords, objW, objH, gradientUnits) => {
  let coords = gradCoords

  if (gradientUnits !== 'percentage'){
    // calc percent from pixels first
    let onePercentX = objW / 100
    let onePercentY = objH / 100
    coords = {
      x1: (gradCoords.x1 / onePercentX) / 100,
      y1: (gradCoords.y1 / onePercentY) / 100,
      x2: (gradCoords.x2 / onePercentX) / 100,
      y2: (gradCoords.y2 / onePercentY) / 100
    }
  }

  let deltaX = coords.x2 - coords.x1;
  let deltaY = coords.y2 - coords.y1;
  let rad = Math.atan2(deltaY, deltaX);
  let deg = Math.round(rad * (180 / Math.PI)) + 90

  return (deg + 360) % 360
}



const gradAngleToCoords = (angle) => {
  let anglePI = (-parseInt(angle, 10)) * (Math.PI / 180)
  let angleCoords = {
    'x1': (Math.round(50 + Math.sin(anglePI) * 50)) / 100,
    'y1': (Math.round(50 + Math.cos(anglePI) * 50)) / 100,
    'x2': (Math.round(50 + Math.sin(anglePI + Math.PI) * 50)) / 100,
    'y2': (Math.round(50 + Math.cos(anglePI + Math.PI) * 50)) / 100,
  }

  return angleCoords
}



// converts fabric gradient object to a more human readable object
const gradToStateObj = (gradient, width, height, fabric) => {
  // necessary to add IDs to stops
  let convertedColorStops = gradient.colorStops.map((stop, index) => {
    let rgb = new fabric.Color(stop.color)
    let opacity = stop.opacity || rgb._source[3] || 1
    return {
      offset: stop.offset,
      color: `rgba(${rgb._source[0]}, ${rgb._source[1]}, ${rgb._source[2]}, ${opacity})`,
      id: index
    }
  })
  convertedColorStops.sort(function (a, b) {
    return a.offset - b.offset;
  })


  let stateObj = {
    type: gradient.type,
    angle: gradCoordsToAngle(gradient.coords, width, height, gradient.gradientUnits),
    colorStops: convertedColorStops
  }

  return stateObj
}



// converts our custom gradient object to a fabric gradient object
const stateObjToGrad = (gradient, width, height, fabric) => {
  let bgGradient

  if (gradient.type === 'linear') {
    // calculate gradient coords from angle
    let angleCoords = gradAngleToCoords(gradient.angle)

    bgGradient = new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: angleCoords.x1 * width,
        y1: angleCoords.y1 * height,
        x2: angleCoords.x2 * width,
        y2: angleCoords.y2 * height
      },
      colorStops: gradient.colorStops
    })
  }

  if (gradient.type === 'radial') {
     bgGradient = new fabric.Gradient({
      type: 'radial',
      coords: {
        x1: width / 2,
        y1: height / 2,
        r1: 0,
        x2: width / 2,
        y2: height / 2,
        r2: width / 2
      },
      colorStops: gradient.colorStops
    });
  }

  return bgGradient
}



export {
  gradCoordsToAngle,
  gradAngleToCoords,
  gradToStateObj,
  stateObjToGrad
}
