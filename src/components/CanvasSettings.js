import React, { useState, useEffect } from 'react';

import { fabric } from 'fabric';

import __ from './../utils/translation';
import getRealBBox from './../utils/getRealBBox';
import delayedAction from './../utils/delayedAction';
import { gradToStateObj, stateObjToGrad } from './../utils/gradientTools';

import { Tabs, Tab } from './Tabs';
import { ChromePicker } from 'react-color';
import GradientPicker from './GradientPicker';


const CanvasSettings = ({ canvas }) => {

  const [canvasSettings, setCanvasSettings] = useState({
    width: 640,
    height: 480,
    keepAspectRatio: false,
    color: 'rgba(255, 255, 255, 0)',
    gradient: {
      type: 'linear',
      angle: 90,
      colorStops: [
        { offset: 0, color: 'rgba(0, 0, 0, 1)', id: 0 },
        { offset: 1, color: 'rgba(255, 0, 0, 1)', id: 1 }
      ]
    }
  })


  // load canvas settings on panel load
  useEffect(() => {
    let updatedCanvasSettings = {
      width: canvas.getWidth(),
      height: canvas.getHeight(),
      keepAspectRatio: false,
      color: (canvas.backgroundColor && !canvas.backgroundColor.type) ?
        canvas.backgroundColor : 'rgba(255, 255, 255, 0)',
      gradient: canvas.backgroundColor.type ?
        gradToStateObj(canvas.backgroundColor, canvas.width, canvas.height, fabric) :
        {
          type: 'linear',
          angle: 90,
          colorStops: [
            { offset: 0, color: 'rgba(0, 0, 0, 1)', id: 0 },
            { offset: 1, color: 'rgba(255, 0, 0, 1)', id: 1 }
          ]
        }
    }

    setCanvasSettings(updatedCanvasSettings)
  }, [canvas])



  const handleColorChange = (color) => {
    setCanvasSettings({...canvasSettings, color: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`})

    canvas.setBackgroundColor(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
    canvas.renderAll()

    delayedAction(1200, () => {
      canvas.trigger('object:modified')
    })
  }


  const handleGradientChange = (gradient) => {
    setCanvasSettings({...canvasSettings, gradient: gradient })

    let bgGradient = stateObjToGrad(gradient, canvas.width, canvas.height, fabric)
    canvas.setBackgroundColor(bgGradient)
    canvas.renderAll()

    delayedAction(1200, () => {
      canvas.trigger('object:modified')
    })
  }


  const handleCanvasSizeChange = (dimension, e) => {
    let value = parseInt(e.target.value)
    if (!Number.isInteger(value)) return

    if (dimension === 'width') {
      setCanvasSettings({...canvasSettings, width: Math.round(value)})
    }

    if (dimension === 'height') {
      setCanvasSettings({...canvasSettings, height: Math.round(value)})
    }
  }


  const applyCanvasSizeChange = (dimension) => {
    let width = canvasSettings.width
    let height = canvasSettings.height

    if (canvasSettings.keepAspectRatio) {
      let ratio = canvas.height / canvas.width

      if (dimension === 'width') {
        width = canvasSettings.width
        height = Math.round(canvasSettings.width * ratio)
      }

      if (dimension === 'height') {
        width = Math.round(canvasSettings.height / ratio)
        height = canvasSettings.height
      }
    }

    setCanvasSettings({...canvasSettings, width: width, height: height })

    canvas.setWidth(width)
    canvas.originalW = width
    canvas.setHeight(height)
    canvas.originalH = height
    canvas.renderAll()
    canvas.trigger('object:modified')
  }


  const fitToContent = () => {
    // select all object
    let activeSelection = new fabric.ActiveSelection(canvas.getObjects(), {
        canvas: canvas,
    })
    canvas.setActiveObject(activeSelection)

    // measure, align, resize
    let bound = activeSelection.getBoundingRect()
    let resize = async () => {
      let realBound = await getRealBBox(activeSelection)
      activeSelection.set('left', (activeSelection.left - bound.left - realBound.x1))
      activeSelection.set('top', (activeSelection.top - bound.top - realBound.y1))

      let width = realBound.width
      let height = realBound.height

      canvas.setWidth(width)
      canvas.setHeight(height)
      canvas.originalW = width
      canvas.originalH = height
      setCanvasSettings({...canvasSettings, width, height })
      canvas.discardActiveObject()
      canvas.renderAll()
      canvas.calcOffset()
      canvas.trigger('object:modified')

    }
    resize()
  }


  return (
    <>
      <p className="title">{__('CANVAS SETTINGS')}</p>
      <p className="subtitle">{__('Canvas size')}</p>
      <div className="setting">
        <div className="label">{__('Width')}</div><div className="function input-with-unit">
          <input type="text" value={canvasSettings.width}
            onBlur={(e) => applyCanvasSizeChange('width')}
            onKeyPress={(e) => e.key === 'Enter' && applyCanvasSizeChange('width')}
            onChange={(e) => handleCanvasSizeChange('width', e)} /> <span className="unit">px</span>
        </div>
      </div>
      <div className="setting">
        <div className="label">{__('Height')}</div><div className="function input-with-unit">
          <input type="text" value={canvasSettings.height}
            onBlur={(e) => applyCanvasSizeChange('height')}
            onKeyPress={(e) => e.key === 'Enter' && applyCanvasSizeChange('height')}
            onChange={(e) => handleCanvasSizeChange('height', e)} /><span className="unit">px</span>
        </div>
      </div>
      <div className="setting">
        <div className="label">{__('Keep aspect ratio')}</div><div className="function">
          <input type="checkbox" value="true" defaultChecked={canvasSettings.keepAspectRatio}
            onChange={(e) => setCanvasSettings({...canvasSettings, keepAspectRatio: e.target.checked }) } />
        </div>
      </div>
      <div className="setting">
        <button onClick={() => fitToContent()}>{__('Fit to content')}</button>
      </div>

      <Tabs defaultTab={canvas.backgroundColor.type ? 'gradient' : 'color'}>
        <Tab title={__('Color fill')} name="color">
          <ChromePicker width="100%" color={canvasSettings.color} onChange={handleColorChange} />
        </Tab>
        <Tab title={__('Gradient fill')} name="gradient">
          <GradientPicker gradient={canvasSettings.gradient} onChange={handleGradientChange}>
            <ChromePicker />
          </GradientPicker>
        </Tab>
      </Tabs>
    </>
  )

}


export default CanvasSettings
