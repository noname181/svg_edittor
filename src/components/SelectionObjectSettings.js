import React from 'react';
import { fabric } from 'fabric';

import Button from './Button';

import __ from './../utils/translation';

import { ReactComponent as IconFlipH } from './../icons/flip-h.svg';
import { ReactComponent as IconFlipV } from './../icons/flip-v.svg';
import { ReactComponent as IconBringFwd } from './../icons/bring-forward.svg';
import { ReactComponent as IconBringBack } from './../icons/bring-back.svg';
import { ReactComponent as IconDuplicate } from './../icons/duplicate.svg';
import { ReactComponent as IconRemove } from './../icons/bin.svg';
import { ReactComponent as IconGroup } from './../icons/group.svg';
import { ReactComponent as IconUngroup } from './../icons/ungroup.svg';



const SelectionObjectSettings = ({ canvas, activeSelection }) => {

  const handleFlipH = () => {
    activeSelection.set('flipX', !activeSelection.flipX)
    canvas.renderAll()
    canvas.trigger('object:modified')
  }


  const handleFlipV = () => {
    activeSelection.set('flipY', !activeSelection.flipY)
    canvas.renderAll()
    canvas.trigger('object:modified')
  }


  const handleBringFwd = () => {
    canvas.bringForward(activeSelection)
    canvas.renderAll()
    canvas.trigger('object:modified')
  }


  const handleBringBack = () => {
    canvas.sendBackwards(activeSelection)
    canvas.renderAll()
    canvas.trigger('object:modified')
  }


  const handleDuplicate = () => {
    let clonedObjects = []
    let activeObjects = canvas.getActiveObjects()
    activeObjects.forEach(obj => {
      obj.clone(clone => {
        // add unique id to cloned textbox
        if(clone.type === 'textbox') {
          clone.set({ uId: Date.now() + Math.random() })
        }

        canvas.add(clone.set({
          strokeUniform: true,
          left: obj.aCoords.tl.x + 20,
          top: obj.aCoords.tl.y + 20
        }));

        if (activeObjects.length === 1){
          canvas.setActiveObject(clone)
        }
        clonedObjects.push(clone)
      })
    })

    if (clonedObjects.length > 1) {
      let sel = new fabric.ActiveSelection(clonedObjects, {
        canvas: canvas,
      });
      canvas.setActiveObject(sel)
    }

    canvas.requestRenderAll()
    canvas.trigger('object:modified')
  }


  const handleDel = () => {
    canvas.getActiveObjects().forEach(obj => {
      canvas.remove(obj)
    })
    canvas.discardActiveObject().requestRenderAll()
    canvas.trigger('object:modified')
  }


  const handleGroup = () => {
    if (activeSelection.type !== 'activeSelection') return

    canvas.getActiveObject().toGroup()
    canvas.requestRenderAll()
    canvas.trigger('object:modified')
  }

  const handleUngroup = () => {
    if (canvas.getActiveObject().type !== 'group') return

    canvas.getActiveObject().toActiveSelection()

    const ungroupedObjs = canvas.getActiveObjects()
    canvas.discardActiveObject()
    const sel = new fabric.ActiveSelection(ungroupedObjs, {
      canvas: canvas,
    });
    canvas.setActiveObject(sel);

    canvas.requestRenderAll()
    canvas.trigger('object:modified')
    canvas.trigger('test')
  }


  return (
    <div className="setting flex small-buttons">
      <Button name="flip-h" title={__('Flip horizontally')} handleClick={ () => handleFlipH() }><IconFlipH /></Button>
      <Button name="flip-v" title={__('Flip vertically')} handleClick={ () => handleFlipV() }><IconFlipV /></Button>
      <Button name="bring-fwd" title={__('Bring object forwards')} handleClick={ () => handleBringFwd() }><IconBringFwd /></Button>
      <Button name="bring-back" title={__('Bring object backwards')} handleClick={ () => handleBringBack() }><IconBringBack /></Button>
      <Button name="duplicate" title={__('Duplicate')} handleClick={ () => handleDuplicate() }><IconDuplicate /></Button>
      <Button name="remove" title={__('Remove')} handleClick={ () => handleDel() }><IconRemove /></Button>
      <Button name="group" title={__('Group selected objects')} handleClick={ () => handleGroup() }><IconGroup /></Button>
      <Button name="ungroup" title={__('Ungroup selected objects')} handleClick={ () => handleUngroup() }><IconUngroup /></Button>
    </div>
  )

}

export default SelectionObjectSettings
