import React from 'react';
import './Shapes.scss';

import { fabric } from 'fabric';

import __ from './../utils/translation';

import { ReactComponent as Shape01 } from './../shapes/01-rectangle.svg';
import { ReactComponent as Shape02 } from './../shapes/02-diamond.svg';
import { ReactComponent as Shape03 } from './../shapes/03-rectangle-dist.svg';
import { ReactComponent as Shape04 } from './../shapes/04-trapeze.svg';
import { ReactComponent as Shape05 } from './../shapes/05-frame.svg';

import { ReactComponent as Shape06 } from './../shapes/06-5-angle.svg';
import { ReactComponent as Shape07 } from './../shapes/07-6-angle.svg';
import { ReactComponent as Shape08 } from './../shapes/08-8-angle.svg';
import { ReactComponent as Shape09 } from './../shapes/09-5-angle-half.svg';
import { ReactComponent as Shape10 } from './../shapes/10-6-angle-half.svg';

import { ReactComponent as Shape11 } from './../shapes/11-triangle-even.svg';
import { ReactComponent as Shape12 } from './../shapes/12-triangle-odd.svg';
import { ReactComponent as Shape13 } from './../shapes/13-triangle-frame-even.svg';
import { ReactComponent as Shape14 } from './../shapes/14-triangle-frame-odd.svg';
import { ReactComponent as Shape15 } from './../shapes/15-circle.svg';

import { ReactComponent as Shape16 } from './../shapes/16-half-circle.svg';
import { ReactComponent as Shape17 } from './../shapes/17-half-pushed-circle.svg';
import { ReactComponent as Shape18 } from './../shapes/18-pushed-circle.svg';
import { ReactComponent as Shape19 } from './../shapes/19-circle-frame.svg';
import { ReactComponent as Shape20 } from './../shapes/20-half-circle-frame.svg';

import { ReactComponent as Shape21 } from './../shapes/21-star-4.svg';
import { ReactComponent as Shape22 } from './../shapes/22-star-5.svg';
import { ReactComponent as Shape23 } from './../shapes/23-star-12.svg';
import { ReactComponent as Shape24 } from './../shapes/24-star-24a.svg';
import { ReactComponent as Shape25 } from './../shapes/25-star-24b.svg';

import { ReactComponent as Shape26 } from './../shapes/26-arrow.svg';
import { ReactComponent as Shape27 } from './../shapes/27-arrow-2-way.svg';
import { ReactComponent as Shape28 } from './../shapes/28-arrow-2-way-turn.svg';
import { ReactComponent as Shape29 } from './../shapes/29-arrow-3-way.svg';
import { ReactComponent as Shape30 } from './../shapes/30-arrow-4-way.svg';

import { ReactComponent as Shape31 } from './../shapes/31-arrow-turn.svg';
import { ReactComponent as Shape32 } from './../shapes/32-arrow-turn-full.svg';
import { ReactComponent as Shape33 } from './../shapes/33-chat-rect.svg';
import { ReactComponent as Shape34 } from './../shapes/34-chat-circle.svg';
import { ReactComponent as Shape35 } from './../shapes/35-chat-thought.svg';



const Shapes = ({ canvas }) => {

  const handleShapeAdd = (e) => {
    fabric.loadSVGFromString(
      e.currentTarget.children[0].outerHTML,
      (objects, options) => {
        var obj = fabric.util.groupSVGElements(objects, options)
        obj.strokeUniform = true
        obj.strokeLineJoin = 'miter'
        obj.scaleToWidth(100)
        obj.scaleToHeight(100)
        obj.set({ left: canvas.getWidth() - 100, top: 0 })
        canvas.add(obj).renderAll()
        canvas.trigger('object:modified')
      }
    )
  }


  return (
    <>
      <p className="title">{__('SHAPES')}</p>

      <div className="shapes">
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape01 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape02 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape03 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape04 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape05 /></div>

        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape06 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape07 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape08 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape09 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape10 /></div>

        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape11 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape12 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape13 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape14 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape15 /></div>

        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape16 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape17 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape18 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape19 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape20 /></div>

        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape21 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape22 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape23 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape24 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape25 /></div>

        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape26 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape27 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape28 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape29 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape30 /></div>

        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape31 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape32 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape33 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape34 /></div>
        <div className="button" onClick={(e) => handleShapeAdd(e)}><Shape35 /></div>
      </div>
    </>
  )

}

export default Shapes

