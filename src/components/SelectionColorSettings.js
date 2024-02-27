import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';

import delayedAction from './../utils/delayedAction';
import { gradToStateObj, stateObjToGrad } from './../utils/gradientTools';
import __ from './../utils/translation';

import { Tabs, Tab } from './Tabs';
import { ChromePicker } from 'react-color';
import GradientPicker from './GradientPicker';



const SelectionColorSettings = ({ canvas, activeSelection }) => {

  const [color, setColor] = useState('rgba(255, 255, 0, 1)')
  const [gradient, setGradient] = useState({
      type: 'linear',
      angle: 90,
      colorStops: [
        { offset: 0, color: 'rgba(0, 0, 0, 1)', id: 0 },
        { offset: 1, color: 'rgba(255, 0, 0, 1)', id: 1 }
      ],
      reset: true
    })


  // load selected object's color settings on panel load
  useEffect(() => {

    if (!activeSelection.fill) return

    // obj has color
    if (!activeSelection.fill.colorStops) {
      let color = new fabric.Color(activeSelection.fill);
      let colorRgba = color.getSource()
      setColor(`rgba(${colorRgba[0]}, ${colorRgba[1]}, ${colorRgba[2]}, ${colorRgba[3]})`)
    }


    // obj has gradient
    if (activeSelection.fill.colorStops) {
      let loadedGradient = gradToStateObj(activeSelection.fill, activeSelection.width, activeSelection.height, fabric)
      loadedGradient.reset = true
      setGradient(loadedGradient)
    }

  }, [activeSelection])



  const handleColorChange = (color) => {
    setColor(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)

    activeSelection.set('fill', `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
    canvas.renderAll()

    delayedAction(1200, () => {
      canvas.trigger('object:modified')
    })
  }


  const handleGradientChange = (gradient) => {
    let fabricGrad = stateObjToGrad(gradient, activeSelection.width, activeSelection.height, fabric)
    activeSelection.set('fill', fabricGrad)

    let updatedGradient = {...gradient, reset: false}
    setGradient(updatedGradient)

    canvas.renderAll()

    delayedAction(1200, () => {
      canvas.trigger('object:modified')
    })
  }


  return (
    <Tabs defaultTab={activeSelection.fill && activeSelection.fill.colorStops ? 'gradient' : 'color'}>
      <Tab title={__('Color fill')} name="color">
        <ChromePicker width="100%" color={color} onChange={handleColorChange} />
      </Tab>
      <Tab title={__('Gradient fill')} name="gradient">
        <GradientPicker gradient={gradient} onChange={handleGradientChange}>
          <ChromePicker />
        </GradientPicker>
      </Tab>
    </Tabs>
  )
}

export default SelectionColorSettings
