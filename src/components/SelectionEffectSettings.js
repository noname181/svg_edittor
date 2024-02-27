import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import delayedAction from './../utils/delayedAction';
import __ from './../utils/translation';



const SelectionEffectSettings = ({ canvas, activeSelection }) => {

  const [effects, setEffects] = useState({
    opacity: 100,
    blur: 0,
    brightness: 50,
    saturation: 50,
    gamma: {
      r: 45, g: 45, b: 45
    }
  })


  // load selected image's effect settings on panel load
  useEffect(() => {
    let updatedEffects = {
      opacity: 100,
      blur: 0,
      brightness: 50,
      saturation: 50,
      gamma: {
        r: 45, g: 45, b: 45
      }
    }

    updatedEffects.opacity = activeSelection.opacity * 100

    let hasBlur = activeSelection.filters.find(x => x.blur)
    if (hasBlur) {
      updatedEffects.blur = hasBlur.blur * 100
    }

    let hasBrightness = activeSelection.filters.find(x => x.brightness)
    if (hasBrightness) {
      updatedEffects.brightness = ((hasBrightness.brightness + 1) / 2) * 100
    }

    let hasSaturation = activeSelection.filters.find(x => x.saturation)
    if (hasSaturation) {
      updatedEffects.saturation = ((hasSaturation.saturation + 1) / 2) * 100
    }

    let hasGamma = activeSelection.filters.find(x => x.gamma)
    if (hasGamma) {
      updatedEffects.gamma.r = Math.round(hasGamma.gamma[0] / 0.022)
      updatedEffects.gamma.g = Math.round(hasGamma.gamma[1] / 0.022)
      updatedEffects.gamma.b = Math.round(hasGamma.gamma[2] / 0.022)
    }

    setEffects(updatedEffects)
  }, [activeSelection])



  const handleOpacityChange = (value) => {
    setEffects({...effects,
      opacity: value
    })

    activeSelection.set('opacity', value / 100)
    canvas.renderAll()

    delayedAction(1200, () => {
      canvas.trigger('object:modified')
    })
  }


  const handleEffectChange = (effect, value) => {

    value = parseInt(value)

    let updatedEffects = {...effects}
    switch (effect) {
      case 'gamma.r':
        updatedEffects.gamma.r = value
        break
      case 'gamma.g':
        updatedEffects.gamma.g = value
        break
      case 'gamma.b':
        updatedEffects.gamma.b = value
        break

      default:
        updatedEffects[effect] = value
        break
    }
    setEffects(updatedEffects)


    // rebuild filter array, calc values for fabric
    // blur 0-1 (def val 0), brightness, saturation -1-1 (def val: 0), gamma 0-2.2 (def val: 1)
    let updatedFilters = []

    if (effects.blur > 0) {
      updatedFilters.push( new fabric.Image.filters.Blur({ blur: effects.blur / 100 }) );
    }

    if (effects.brightness !== 50) {
      updatedFilters.push( new fabric.Image.filters.Brightness({ brightness: ((effects.brightness / 100) * 2) - 1 }) );
    }

    if (effects.saturation !== 50) {
      updatedFilters.push( new fabric.Image.filters.Saturation({ saturation: ((effects.saturation / 100) * 2) - 1 }) );
    }

    if (
      effects.gamma.r !== 45 ||
      effects.gamma.g !== 45 ||
      effects.gamma.b !== 45
    ) {
      updatedFilters.push( new fabric.Image.filters.Gamma({
        gamma: [
            Math.round((effects.gamma.r * 0.022) * 10) / 10,
            Math.round((effects.gamma.g * 0.022) * 10) / 10,
            Math.round((effects.gamma.b * 0.022) * 10) / 10
          ]
        })
      );
    }

    activeSelection.filters = updatedFilters
    activeSelection.applyFilters()
    canvas.renderAll()

    delayedAction(1200, () => {
      canvas.trigger('object:modified')
    })

  }



  return (
    <>
      <div className="setting">
        <div className="label">{__('Opacity')}</div><div className="function">
          <input type="range" min="0" max="100" steps="1"
            onChange={ (e) => handleOpacityChange(e.target.value) }
            value={ effects.opacity } />
        </div>
      </div>
      <div className="setting">
        <div className="label">{__('Blur')}</div><div className="function">
          <input type="range" min="0" max="100" steps="1"
            onChange={ (e) => handleEffectChange('blur', e.target.value) }
            value={ effects.blur } />
        </div>
      </div>
      <div className="setting">
        <div className="label">{__('Brightness')}</div><div className="function">
          <input type="range" min="0" max="100" steps="1"
            onChange={ (e) => handleEffectChange('brightness', e.target.value) }
            value={ effects.brightness } />
        </div>
      </div>
      <div className="setting">
        <div className="label">{__('Saturation')}</div><div className="function">
          <input type="range" min="0" max="100" steps="1"
            onChange={ (e) => handleEffectChange('saturation', e.target.value) }
            value={ effects.saturation } />
        </div>
      </div>
      <div className="setting">
        <div className="label">{__('Gamma')}</div><div className="function"></div>
        <div className="label">&nbsp;&nbsp;&nbsp;{__('Red')}</div><div className="function">
          <input type="range" min="0" max="100" steps="1"
            onChange={ (e) => handleEffectChange('gamma.r', e.target.value) }
            value={ effects.gamma.r } />
        </div>
        <div className="label">&nbsp;&nbsp;&nbsp;{__('Green')}</div><div className="function">
          <input type="range" min="0" max="100" steps="1"
            onChange={ (e) => handleEffectChange('gamma.g', e.target.value) }
            value={ effects.gamma.g } />
        </div>
        <div className="label">&nbsp;&nbsp;&nbsp;{__('Blue')}</div><div className="function">
          <input type="range" min="0" max="100" steps="1"
            onChange={ (e) => handleEffectChange('gamma.b', e.target.value) }
            value={ effects.gamma.b } />
        </div>
      </div>
    </>
  )

}

export default SelectionEffectSettings
