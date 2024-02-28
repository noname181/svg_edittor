import React, { useState } from 'react';

import { fabric } from 'fabric';

import __ from './../utils/translation';

import InputAmount from './InputAmount';
import { InputSelect, Option } from './InputSelect';
import { ChromePicker } from 'react-color';



const DrawSettings = ({ canvas }) => {

  const [drawSettings, setDrawSettings] = useState({
    width: 3,
    style: 'pencil',
    color: '#FF0000'
  })


  const handleBrushWidthChange = (action, amount) => {
    let width = 3

    if (action === 'decrease') {
      width = drawSettings.width
      width = width === 1 ? 1 : width - 1
    }

    if (action === 'increase') {
      width = drawSettings.width + 1
    }

    if (action === 'change') {
      width = parseInt(amount)
      if (!Number.isInteger(width)) return
    }

    setDrawSettings({...drawSettings,
      width: width
    })

    canvas.freeDrawingBrush.width = width
  }


  const handleBrushStyleChange = (style) => {

    switch (style) {
      case 'circle':
        canvas.freeDrawingBrush = new fabric.CircleBrush(canvas)
        break

      case 'spray':
        canvas.freeDrawingBrush = new fabric.SprayBrush(canvas)
        break

      default:
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
        break
    }

    canvas.freeDrawingBrush.width = drawSettings.width
    canvas.freeDrawingBrush.color = drawSettings.color


    setDrawSettings({
      ...drawSettings,
      style: style
    })
  }


  const handleBrushColorChange = (color) => {
    setDrawSettings({...drawSettings,
      color: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
    })

    canvas.freeDrawingBrush.color = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
  }


  return (
    <>
      <p className="title">{__('FREE DRAW')}</p>
      <p></p>
      <div className="setting">
        <div className="label">{__('Brush width')}</div><div className="function">
          <InputAmount unit="" value={drawSettings.width}
            handleDecrease={() => handleBrushWidthChange('decrease')}
            handleChange={(e) => handleBrushWidthChange('change', e.target.value)}
            handleIncrease={() => handleBrushWidthChange('increase')}
            />
        </div>
      </div>
      <div className="setting">
        <div className="label">{__('Brush style')}</div><div className="function">
          <InputSelect activeOption={drawSettings.style} handleChange={(style) => handleBrushStyleChange(style)}>
            <Option value="pencil">{__('Pencil')}</Option><Option value="circle">{__('Circle')}</Option>
            <Option value="spray">{__('Spray')}</Option>
          </InputSelect>
        </div>
      </div>
      <div className="setting">
        <div className="label">{__('Brush color')}</div><div className="function"></div>
      </div>
      <ChromePicker width="100%" color={drawSettings.color} onChange={handleBrushColorChange} />
      <p></p>
      <p><i><b>{__('Tip:')}</b> {__(`you can select and style each line you drew. Use <b>Shift + Click</b> to select multiple lines and
      group them into one object.`)}</i></p>
    </>
  )
}


export default DrawSettings
