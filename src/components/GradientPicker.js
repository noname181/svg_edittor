/*

  const [gradient, setGradient] = useState({
      type: 'linear',
      angle: 0,
      colorStops: [
        { offset: 0, color: 'rgba(0, 0, 0, 1)', id: 1 },
        { offset: 1, color: 'rgba(255, 0, 0, 1)', id: 2 }
      ],
      reset: false // forces to reset active color stop and picker color, e.g.: on selection change
  })

  <GradientPicker gradient={gradient} onChange={handleGradientChangeAndSetGradient}>
    <ChromePicker />
  </GradientPicker>

 */

import React, { useState, useEffect, useRef } from 'react';
import __ from './../utils/translation';
import './GradientPicker.scss';
import './InputRange.scss';


// retrieve DOM node dimension infos
const getDimensions = (ref) => {
  if (!ref.current) return null

  const info = ref.current.getBoundingClientRect()
  return {
    x: info.x,
    y: info.y,
    width: info.width,
    height: info.height,
    xRight: info.x + info.width,
    yBottom: info.y + info.height,
    xCenter: info.x + (info.width / 2),
    yCenter: info.y + (info.height / 2)
  }
}


const GradientPicker = (props) => {

  const [dragging, setDragging] = useState(false)
  const [activeColorStop, setActiveColorStop] = useState(0)
  const [activeGradientColor, setActiveGradientColor] = useState(null)

  // ref to color stop holder DOM elem
  const stopHolderRef = useRef()

  // store references to color stops so we can manipulate them
  const colorStopsRef = useRef({})



  // new object with gradient, reset active color stop
  useEffect(() => {
    if (props.gradient.reset) {
      setActiveColorStop(0)
      setActiveGradientColor(null)
    }
  }, [props.gradient])



  // dragging a color stop
  useEffect(() => {

    // dragging
    const onDrag = (e) => {
      e.preventDefault()

      // no negative drag
      if (!e.clientX && !e.changedTouches) return

      // limit drag to palette area
      let holderInfo = getDimensions(stopHolderRef)
      let cursorX = e.clientX || e.changedTouches[0].clientX
      let cursorY = e.clientY || e.changedTouches[0].clientY
      let pos = (cursorX < holderInfo.x) ? 0 : (cursorX - holderInfo.x)
      pos = (cursorX > holderInfo.xRight) ? (holderInfo.xRight - holderInfo.x) : pos
      pos = (pos / (holderInfo.width / 100)).toFixed(3)
      colorStopsRef.current[activeColorStop].style.left = pos + '%'


      // remove color stop if dragged away from palette
      if (Math.abs(holderInfo.yCenter - cursorY) > 50 && props.gradient.colorStops.length > 2) {
        setDragging(false)

        let updatedGradientStops = props.gradient.colorStops.filter(stop => stop.id !== activeColorStop);
        props.onChange({...props.gradient, colorStops: updatedGradientStops})

        setActiveColorStop(false)

        return
      }


      // update and sort gradient state
      let updatedGradientStops = props.gradient.colorStops.map(stop => {
        if (stop.id === activeColorStop) {
          return { ...stop, offset: Number(pos / 100) }
        }
        return stop
      })

      updatedGradientStops.sort(function (a, b) {
        return a.offset - b.offset;
      })

      props.onChange({...props.gradient, colorStops: updatedGradientStops})

    }


    // drag ended
    const onDragEnd = (e) => {
      setDragging(false)
    }


    // add event listeners to detect when drag ends
    if (dragging) {
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('touchmove', onDrag)
      document.addEventListener('mouseup', onDragEnd)
      document.addEventListener('touchend', onDragEnd)
    }

    return () => {
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('touchmove', onDrag)
      document.removeEventListener('mouseup', onDragEnd)
      document.removeEventListener('touchend', onDragEnd)
    }

  }, [props, dragging, activeColorStop])


  // add color stops
  const addColorStop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.nativeEvent.which !== 1) return

    // limit stops
    if (props.gradient.colorStops.length > 4) return

    // calc new color stop position
    let holderInfo = getDimensions(stopHolderRef)
    let cursorX = e.clientX || e.changedTouches[0].clientX
    let newColorStopPos = cursorX - holderInfo.x

    // add new color stop in gradient state with random id
    let updatedGradientStops = [...props.gradient.colorStops]
    let newColorStopId = Math.random().toString(36).substr(2, 9)
    updatedGradientStops.push({
      offset: Number(((newColorStopPos / (holderInfo.width / 100)) / 100).toFixed(3)),
      color: `rgba(0, 0, 0, 1)`,
      id: newColorStopId
    })

    // sort and update state
    updatedGradientStops.sort(function (a, b) {
      return a.offset - b.offset;
    })

    props.onChange({...props.gradient, colorStops: updatedGradientStops})
    setActiveColorStop(newColorStopId)
  }


  // handle color picker change
  const handleColorChange = (color) => {
    // update color picker
    setActiveGradientColor(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)

    // change active color stop color in gradient state
    let updatedGradientStops = props.gradient.colorStops.map(stop => {
      if (stop.id === activeColorStop) {
        return {...stop, color: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`}
      }
      return stop
    })
    props.onChange({...props.gradient, colorStops: updatedGradientStops})
  }


  // handle color stop click
  const handleColorStopClick = (e, stopId) => {
    e.stopPropagation();
    setActiveColorStop(stopId);
    setActiveGradientColor(props.gradient.colorStops.find(stop => stop.id === stopId).color)
    setDragging(true);
  }


  // handle angle change
  const handleAngleChange = (e) => {
    let angle = parseInt(e.target.value)
    if (!Number.isInteger(angle)) return

    angle = angle > 360 ? 360 : angle
    angle = e.target.value < 0 ? 0 : angle

    // update gradient state
    props.onChange({...props.gradient, angle: Math.round(angle)})
  }

  const handleAngleDecrease = () => {
    let newAngle = props.gradient.angle === 0 ? 360 : props.gradient.angle - 1
    props.onChange({...props.gradient, angle: newAngle})
  }

  const handleAngleIncrease = () => {
    let newAngle = props.gradient.angle === 360 ? 0 : props.gradient.angle + 1
    props.onChange({...props.gradient, angle: newAngle})
  }


  return (
    <div className="gradientpicker">
      <div className="palette">
        <svg width="100%" height="100%">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              { props.gradient.colorStops.map(stop => (
                  <stop key={stop.id} offset={Number(stop.offset)} style={{ stopColor: stop.color }} />
              )) }
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#grad)"/>
        </svg>

        <div className="stopholder" title={__('Drag up or down to remove')} ref={stopHolderRef} onMouseDown={ (e) => addColorStop(e) }>
          { props.gradient.colorStops.map((stop, index) => (
              <div key={stop.id} id={stop.id}
                ref={el => colorStopsRef.current[stop.id] = el}
                className={ activeColorStop === stop.id ? 'stop active' : 'stop'}
                onMouseDown={(e) => handleColorStopClick(e, stop.id)}
                onTouchStart={(e) => handleColorStopClick(e, stop.id)}
                style={{ left: (stop.offset * 100).toFixed(3) + '%' }}
              ></div>
            )) }
        </div>
      </div>

      {React.cloneElement(props.children, {
        width: '100%',
        color: activeGradientColor || props.gradient.colorStops[0].color,
        onChange: handleColorChange
      })}

      <div className="setting orientation">
        <div className="label">{__('Orientation')}</div>
        <div className="function">
          <div className="button-2-options">
            <div className={props.gradient.type === 'linear' ? 'option active' : 'option'}
              onClick={ () => props.onChange({...props.gradient, type: 'linear'}) }>{__('Linear')}</div>
            <div className={props.gradient.type === 'radial' ? 'option active' : 'option'}
              onClick={ () => props.onChange({...props.gradient, type: 'radial'}) }>{__('Radial')}</div>
          </div>
        </div>
      </div>
      { props.gradient.type === 'linear' &&
        <>
        <div className="setting">
          <div className="label">{__('Angle')}</div>
          <div className="function">
            <div className="button-amount">
              <div className="decrease" onClick={ () => handleAngleDecrease() }>-</div>
              <input onChange={(e) => handleAngleChange(e)}
                value={props.gradient.angle + '°'}
                type="text" maxLength="4" />
              <div className="increase" onClick={ () => handleAngleIncrease() }>+</div>
            </div>
          </div>
        </div>
        <div className="setting">
          <input type="range" min="0" max="360" steps="1" value={props.gradient.angle} onChange={(e) => handleAngleChange(e)} />
        </div>
        </>
      }
    </div>
  )
}


export default GradientPicker;
