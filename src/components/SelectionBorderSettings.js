import React, { useState, useEffect } from 'react';
import delayedAction from './../utils/delayedAction';
import __ from './../utils/translation';
import { ChromePicker } from 'react-color';
import InputAmount from './InputAmount';
import { InputSelect, Option } from './InputSelect';


const SelectionBorderSettings = ({ canvas, activeSelection }) => {

  const [border, setBorder] = useState({
    width: 0,
    style: { strokeDashArray: [], strokeLineCap: 'square' },
    corner: '',
    color: 'rgba(0,0,0,1)'
  })
  const [borderColorPicker, setBorderColorPicker] = useState(false)



  // load selected object's border settings on panel load
  useEffect(() => {
    let loadedBorder = {
      width: activeSelection.strokeWidth,
      style: {
        strokeDashArray: activeSelection.strokeDashArray,
        strokeLineCap: activeSelection.strokeLineCap
      },
      corner: activeSelection.strokeLineJoin,
      color: activeSelection.stroke
    }

    setBorder(loadedBorder)
  }, [activeSelection])



  const handleBorderWidthChange = (action, amount) => {
    let width = 0

    if (action === 'decrease') {
      width = border.width
      width = width === 0 ? 0 : width - 1
    }

    if (action === 'increase') {
      width = border.width + 1
    }

    if (action === 'change') {
      width = parseInt(amount)
      if (!Number.isInteger(width)) return
    }

    setBorder({...border,
      width: width
    })

    canvas.getActiveObjects().forEach(obj => {
      obj.set({
        strokeUniform: true,
        strokeWidth: width
      })
    })
    canvas.renderAll()
    canvas.trigger('object:modified')
  }


  const handleBorderStyleChange = (style) => {
    setBorder({...border,
      style: style
    })

    canvas.getActiveObjects().forEach(obj => {
      obj.set({
        strokeUniform: true,
        strokeDashArray: style.strokeDashArray,
        strokeLineCap: style.strokeLineCap
      })
    })
    canvas.renderAll()
    canvas.trigger('object:modified')
  }


  const handleBorderCornerChange = (corner) => {
    setBorder({...border,
      corner: corner
    })

    activeSelection.set('strokeLineJoin', corner)
    canvas.renderAll()
    canvas.trigger('object:modified')
  }


  const handleBorderColorChange = (color) => {
    setBorder({...border,
      color: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
    })

    canvas.getActiveObjects().forEach(obj => {
      obj.set('stroke', `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
    })
    canvas.renderAll()

    delayedAction(1200, () => {
      canvas.trigger('object:modified')
    })
  }



  return (
    <>
      <div className="setting">
        <div className="label">Width</div><div className="function">
          <InputAmount unit="" value={border.width}
            handleDecrease={() => handleBorderWidthChange('decrease')}
            handleChange={(e) => handleBorderWidthChange('change', e.target.value)}
            handleIncrease={() => handleBorderWidthChange('increase')}
            />
        </div>
      </div>
      <div className="setting">
          <div className="label">Style</div><div className="function">
            <InputSelect activeOption={
                {
                  strokeDashArray: border.style.strokeDashArray ?? [],
                  strokeLineCap: border.style.strokeLineCap
                }
              } handleChange={ (style) => handleBorderStyleChange(style) }>
              <Option value={ { strokeDashArray: [], strokeLineCap: 'butt' } }>
                <svg><line x1="0" y1="2" x2="100" y2="2" stroke="#000" strokeWidth="4" strokeLinecap="square" /></svg>
              </Option>
              <Option value={ { strokeDashArray: [1, 10], strokeLineCap: 'butt' } }>
                <svg><line x1="0" y1="2" x2="100" y2="2" stroke="#000" strokeWidth="4" strokeDasharray="1, 10" strokeLinecap="square" /></svg>
              </Option>
              <Option value={ { strokeDashArray: [1, 10], strokeLineCap: 'round' } }>
                <svg><line x1="0" y1="2" x2="100" y2="2" stroke="#000" strokeWidth="4" strokeDasharray="1, 10" strokeLinecap="round" /></svg>
              </Option>
              <Option value={ { strokeDashArray: [15, 15], strokeLineCap: 'square' } }>
                <svg><line x1="0" y1="2" x2="100" y2="2" stroke="#000" strokeWidth="4" strokeDasharray="15" strokeLinecap="square" /></svg>
              </Option>
              <Option value={ { strokeDashArray: [15, 15], strokeLineCap: 'round' } }>
                <svg><line x1="0" y1="2" x2="100" y2="2" stroke="#000" strokeWidth="4" strokeDasharray="15" strokeLinecap="round" /></svg>
              </Option>
              <Option value={ { strokeDashArray: [25, 25], strokeLineCap: 'square' } }>
                <svg><line x1="0" y1="2" x2="100" y2="2" stroke="#000" strokeWidth="4" strokeDasharray="25" strokeLinecap="square" /></svg>
              </Option>
              <Option value={ { strokeDashArray: [25, 25], strokeLineCap: 'round' } }>
                <svg><line x1="0" y1="2" x2="100" y2="2" stroke="#000" strokeWidth="4" strokeDasharray="25" strokeLinecap="round" /></svg>
              </Option>
              <Option value={ { strokeDashArray: [1, 8, 16, 8, 1, 20], strokeLineCap: 'square' } }>
                <svg><line x1="2" y1="2" x2="100" y2="2" stroke="#000" strokeWidth="4" strokeDasharray="1 8 16 8 1 20" strokeLinecap="square" /></svg>
              </Option>
              <Option value={ { strokeDashArray: [1, 8, 16, 8, 1, 20], strokeLineCap: 'round' } }>
                <svg><line x1="2" y1="2" x2="100" y2="2" stroke="#000" strokeWidth="4" strokeDasharray="1 8 16 8 1 20" strokeLinecap="round" /></svg>
              </Option>
            </InputSelect>
          </div>
      </div>
      <div className="setting">
        <div className="label">{__('Corner type')}</div><div className="function">
          <InputSelect activeOption={border.corner} handleChange={(corner) => handleBorderCornerChange(corner)}>
            <Option value="miter">{__('Square')}</Option>
            <Option value="round">{__('Round')}</Option>
          </InputSelect>
        </div>
      </div>
      <div className="setting">
        <div className="label">{__('Color')}</div>
        <div className="function">
          <div className="input-color">
            <div className="color" onClick={() => setBorderColorPicker(!borderColorPicker)}>
              <div className="fill" style={{ backgroundColor: border.color }}></div>
            </div>
          </div>
        </div>
        <div className={ borderColorPicker ? 'picker-holder visible' : 'picker-holder' }>
          <ChromePicker width="100%" color={border.color || 'rgba(0,0,0,0)'}
            onChange={handleBorderColorChange} />
        </div>
      </div>
    </>
  )
}

export default SelectionBorderSettings
