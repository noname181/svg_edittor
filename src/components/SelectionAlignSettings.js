import React from 'react';
import Button from './Button';

import getRealBBox from './../utils/getRealBBox';
import __ from './../utils/translation';

import { ReactComponent as IconAlignLeft } from './../icons/align-left.svg';
import { ReactComponent as IconAlignCenterH } from './../icons/align-center-h.svg';
import { ReactComponent as IconAlignRight } from './../icons/align-right.svg';
import { ReactComponent as IconAlignTop } from './../icons/align-top.svg';
import { ReactComponent as IconAlignCenterV } from './../icons/align-center-v.svg';
import { ReactComponent as IconAlignBottom } from './../icons/align-bottom.svg';



const SelectionAlignSettings = ({ canvas, activeSelection }) => {

  const alignObject = (pos) => {
    switch (pos){
      case 'left':

        (async () => {
          let bound = activeSelection.getBoundingRect(true)
          let realBound = await getRealBBox(activeSelection)
          activeSelection.set('left', (activeSelection.left - bound.left - realBound.x1))
          activeSelection.setCoords()
          canvas.renderAll()
          canvas.trigger('object:modified')
        })()

        break

      case 'center-h':

        (async () => {
          let bound = activeSelection.getBoundingRect(true)
          let realBound = await getRealBBox(activeSelection)
          activeSelection.set(
            'left',
            (activeSelection.left - bound.left - realBound.x1) + (canvas.originalW / 2) - (realBound.width / 2)
          )
          activeSelection.setCoords()
          canvas.renderAll()
          canvas.trigger('object:modified')
        })()

        break

      case 'right':

        (async () => {
          let bound = activeSelection.getBoundingRect(true)
          let realBound = await getRealBBox(activeSelection)
          activeSelection.set('left', (activeSelection.left - bound.left - realBound.x1) + canvas.originalW - realBound.width)
          activeSelection.setCoords()
          canvas.renderAll()
          canvas.trigger('object:modified')
        })()

        break

      case 'top':

        (async () => {
          let bound = activeSelection.getBoundingRect(true)
          let realBound = await getRealBBox(activeSelection)
          activeSelection.set('top', (activeSelection.top - bound.top - realBound.y1))
          activeSelection.setCoords()
          canvas.renderAll()
          canvas.trigger('object:modified')
        })()

        break

      case 'center-v':

        (async () => {
          let bound = activeSelection.getBoundingRect(true)
          let realBound = await getRealBBox(activeSelection)
          activeSelection.set(
            'top',
            (activeSelection.top - bound.top - realBound.y1) + (canvas.originalH / 2) - (realBound.height / 2)
          )
          activeSelection.setCoords()
          canvas.renderAll()
          canvas.trigger('object:modified')
        })()

        break

      case 'bottom':

        (async () => {
          let bound = activeSelection.getBoundingRect(true)
          let realBound = await getRealBBox(activeSelection)
          activeSelection.set(
            'top',
            (activeSelection.top - bound.top - realBound.y1) + (canvas.originalH - realBound.height)
          )
          activeSelection.setCoords()
          canvas.renderAll()
          canvas.trigger('object:modified')
        })()

        break

      default:
        break
    }
  }


  return (
    <>
      <div className="setting flex flex small-buttons">
        <Button handleClick={ () => alignObject('left') } name="align-left" title={__('Align left')}><IconAlignLeft /></Button>
        <Button handleClick={ () => alignObject('center-h') } name="align-center-h" title={__('Align center horizontally')}><IconAlignCenterH /></Button>
        <Button handleClick={ () => alignObject('right') } name="align-right" title={__('Align right')}><IconAlignRight /></Button>
        <Button handleClick={ () => alignObject('top') } name="align-top" title={__('Align top')}><IconAlignTop /></Button>
        <Button handleClick={ () => alignObject('center-v') } name="align-center-v" title={__('Align center vertically')}><IconAlignCenterV /></Button>
        <Button handleClick={ () => alignObject('bottom') } name="align-bottom" title={__('Align bottom')}><IconAlignBottom /></Button>
      </div>
    </>
  )
}

export default SelectionAlignSettings
