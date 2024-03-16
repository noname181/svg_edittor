import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import delayedAction from './../utils/delayedAction';
import usePrevious from './../utils/usePrevious';
import Button from './Button';
import InputAmount from './InputAmount';

import __ from './../utils/translation';

import { ReactComponent as IconTextBold } from './../icons/text-bold.svg';
import { ReactComponent as IconTextItalic } from './../icons/text-italic.svg';
import { ReactComponent as IconTextUnderline } from './../icons/text-underline.svg';
import { ReactComponent as IconTextLineThrough } from './../icons/text-linethrough.svg';
import { ReactComponent as IconTextSub } from './../icons/text-sub.svg';
import { ReactComponent as IconTextSup } from './../icons/text-sup.svg';


const SelectionTextSettings = ({ canvas, activeSelection, isTextEditing }) => {

  const [fontFamily, setFontFamily] = useState()
  const [fontSize, setFontSize] = useState(25)
  const [lineHeight, setLineHeight] = useState(20)
  const [charSpacing, setCharSpacing] = useState(0)
  const [textAlign, setTextAlign] = useState('left')
  const [textColor, setTextColor] = useState(false)
  const [colorPicker, setColorPicker] = useState('rgba(0, 0, 0, 1)')

  const prevSelectionId = usePrevious({ uId: activeSelection.uId })



  const getActiveStyle = (styleName) => {
    if (activeSelection.getSelectionStyles && isTextEditing) {
      let styles = activeSelection.getSelectionStyles()
      if (styles.find(o => o[styleName] === '')) {
        return ''
      }

      return styles[0][styleName]
    }

    return activeSelection[styleName] || ''
  }


  const setActiveStyle = (styleName, value) => {
    let style = {}
    style[styleName] = value

    if (isTextEditing) {
        activeSelection.setSelectionStyles(style)
        activeSelection.setCoords()
    } else {
      activeSelection.removeStyle(styleName)
      activeSelection.set(styleName, value)
    }

    canvas.renderAll()
  }


  const toggleBold = () => {
    setActiveStyle(
      'fontWeight',
      getActiveStyle('fontWeight') === 'bold' ? '' : 'bold'
    )
    canvas.trigger('object:modified')
  }


  const toggleItalic = () => {
    setActiveStyle(
      'fontStyle',
      getActiveStyle('fontStyle') === 'italic' ? '' : 'italic'
    )
    canvas.trigger('object:modified')
  }


  const toggleUnderline = () => {
    setActiveStyle('underline', !getActiveStyle('underline'))
    canvas.trigger('object:modified')
  }


  const toggleLinethrough = () => {
    setActiveStyle('linethrough', !getActiveStyle('linethrough'))
    canvas.trigger('object:modified')
  }


  const toggleSubscript = () => {
    if (getActiveStyle('deltaY') > 0) {
      setActiveStyle('fontSize', undefined)
      setActiveStyle('deltaY', undefined)
    } else {
      activeSelection.setSubscript()
      canvas.renderAll()
    }

    canvas.trigger('object:modified')
  }


  const toggleSuperscript = () => {
    if (getActiveStyle('deltaY') < 0) {
      setActiveStyle('fontSize', undefined)
      setActiveStyle('deltaY', undefined)
    } else {
      activeSelection.setSuperscript()
      canvas.renderAll()
    }

    canvas.trigger('object:modified')
  }


  const handleFamilyChange = (e) => {
    setFontFamily(e.target.value)
    setActiveStyle('fontFamily', e.target.value)
    canvas.trigger('object:modified')
  }


  const handleSizeChange = (action, amount) => {
    let size = 0

    if (action === 'decrease') {
      size = fontSize === 0 ? 0 : fontSize - 1
    }

    if (action === 'increase') {
      size = fontSize + 1
    }

    if (action === 'change') {
      size = parseInt(amount, 10)
      if (!Number.isInteger(size)) return
    }

    setFontSize(size)
    setActiveStyle('fontSize', size)
    canvas.trigger('object:modified')
  }


  const handleLineHeightChange = (action, amount) => {
    let heightInPx = 0
    let heightInUnit = 0

    if (action === 'decrease') {
      heightInPx = lineHeight === 0 ? 0 : lineHeight - 1
    }

    if (action === 'increase') {
      heightInPx = lineHeight + 1
    }

    if (action === 'change') {
      heightInPx = parseInt(amount)
      if (!Number.isInteger(heightInPx)) return
    }

    heightInUnit = heightInPx / fontSize

    setLineHeight(heightInPx)
    setActiveStyle('lineHeight', heightInUnit)
    canvas.trigger('object:modified')
  }


  const handleCharSpaceChange = (action, amount) => {
    let spaceInPx = 0
    let spaceInUnitPiece = 0

    if (action === 'decrease') {
      spaceInPx = charSpacing - 1
    }

    if (action === 'increase') {
      spaceInPx = charSpacing + 1
    }

    if (action === 'change') {
      spaceInPx = parseInt(amount)
      if (!Number.isInteger(spaceInPx)) return
    }

    spaceInUnitPiece = spaceInPx / fontSize * 1000

    setCharSpacing(spaceInPx)
    setActiveStyle('charSpacing', spaceInUnitPiece)
    canvas.trigger('object:modified')
  }

  const handleTextAlignChange = (e) => {
    setTextAlign(e.target.value)
    setActiveStyle('textAlign', e.target.value)
    canvas.trigger('object:modified')
  }


  const handleColorChange = (color) => {
    setTextColor(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
    setActiveStyle('fill', `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)

    delayedAction(1200, () => {
      canvas.trigger('object:modified')
    })
  }


  // on load get active selection's font settings
  useEffect(() => {
    let activeSelectionChanged = Boolean(prevSelectionId) && prevSelectionId.uId !== activeSelection.uId

    if (
      !activeSelectionChanged
      && (
        !activeSelection // nothing is selected
        || isTextEditing // text editing mode, don't set anything
        || fontFamily // we already read font settings
      )
    ) {
      return
    }

    setFontFamily(activeSelection.fontFamily)
    setFontSize(activeSelection.fontSize)

    let lineHeightInPx = Math.floor(activeSelection.fontSize * activeSelection.lineHeight)
    setLineHeight(lineHeightInPx)

    let spaceInPx = Math.round(activeSelection.charSpacing / 1000 * fontSize)
    setCharSpacing(spaceInPx)

    setTextAlign(activeSelection.textAlign)

    setTextColor(activeSelection.fill)

  }, [activeSelection, fontFamily, fontSize, isTextEditing, prevSelectionId])



  return (
    <>
      <div className="setting flex flex small-buttons">
        <Button handleClick={ () => toggleBold() } name="bold" title={__('Bold')}><IconTextBold /></Button>
        <Button handleClick={ () => toggleItalic() } name="italic" title={__('Italic')}><IconTextItalic /></Button>
        <Button handleClick={ () => toggleUnderline() } name="underline" title={__('Underline')}><IconTextUnderline /></Button>
        <Button handleClick={ () => toggleLinethrough() } name="linethrough" title={__('Linethrough')}><IconTextLineThrough /></Button>
        <Button handleClick={ () => toggleSubscript() } name="subscript" title={__('Subscript')}><IconTextSub /></Button>
        <Button handleClick={ () => toggleSuperscript() } name="superscript" title={__('Superscript')}><IconTextSup /></Button>
      </div>
      <div>&nbsp;</div>


      <div className="setting">
        <div className="label">{__('Font family')}</div><div className="function">
          <select value={fontFamily} onChange={(e) => handleFamilyChange(e)}>
            <option value=""></option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Oswald', sans-serif">Oswald</option>
            <option value="'Playfair Display', serif">Playfair Display</option>
            <option value="'Cormorant Garamond', serif">Cormorant Garamond</option>
            <option value="Impact, Charcoal, sans-serif">Impact</option>
            <option value="'Lucida Console', Monaco, monospace">Lucida Console</option>
            <option value="'Comic Sans MS', 'Comic Sans', cursive, sans-serif">Comic Sans</option>
            <option value="'Dancing Script', cursive">Dancing Script</option>
            <option value="'Indie Flower', cursive">Indie Flower</option>
            <option value="'Amatic SC', cursive">Amatic SC</option>
            <option value="'Permanent Marker', cursive">Permanent Marker</option>
          </select>
        </div>
      </div>

      <div className="setting">
        <div className="label">{__('Font size')}</div><div className="function">
          <InputAmount unit="" value={fontSize}
            handleDecrease={() => handleSizeChange('decrease')}
            handleChange={(e) => handleSizeChange('change', e.target.value)}
            handleIncrease={() => handleSizeChange('increase')}
            />
        </div>
      </div>

      <div className={`setting ${isTextEditing ? 'disabled' : ''}`}>
        <div className="label">{__('Line height')}</div><div className="function">
          <InputAmount unit="" value={lineHeight}
            disabled={ isTextEditing ?? 'true' }
            handleDecrease={() => handleLineHeightChange('decrease')}
            handleChange={(e) => handleLineHeightChange('change', e.target.value)}
            handleIncrease={() => handleLineHeightChange('increase')}
            />
        </div>
      </div>

      <div className={`setting ${isTextEditing ? 'disabled' : ''}`}>
        <div className="label">{__('Letter spacing')}</div><div className="function">
          <InputAmount unit="" value={charSpacing}
            disabled={ isTextEditing ?? 'true' }
            handleDecrease={() => handleCharSpaceChange('decrease')}
            handleChange={(e) => handleCharSpaceChange('change', e.target.value)}
            handleIncrease={() => handleCharSpaceChange('increase')}
            />
        </div>
      </div>

      <div className={`setting ${isTextEditing ? 'disabled' : ''}`}>
        <div className="label">{__('Text alignment')}</div><div className="function">
          <select value={textAlign} onChange={(e) => handleTextAlignChange(e)} disabled={ isTextEditing ?? 'true' }>
            <option value="left">{__('Left')}</option>
            <option value="center">{__('Center')}</option>
            <option value="right">{__('Right')}</option>
            <option value="justify">{__('Justify')}</option>
          </select>
        </div>
      </div>


      <div className="setting">
        <div className="label">{__('Color')}</div>
        <div className="function">
          <div className="input-color">
            <div className="color" onClick={() => setColorPicker(!colorPicker)}>
              <div className="fill" style={{ backgroundColor: textColor }}></div>
            </div>
          </div>
        </div>
        <div className={colorPicker ? 'picker-holder visible' : 'picker-holder'}>
          <ChromePicker width="100%" color={textColor}
            onChange={handleColorChange} />
        </div>
      </div>
    </>
  )

}

export default SelectionTextSettings
