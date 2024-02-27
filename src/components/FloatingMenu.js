import React, { useEffect, useRef } from 'react'
import './FloatingMenu.scss'


const FloatingMenu = (props) => {

  // on mount: add event listener to detect outside clicks
  const innerRef = useRef(null)

  useEffect(() => {

    if (!props.setVisible) {
      return
    }

    const handleClick = (e) => {
      // hide menu if click target is outside of this elem
      if (props.visible && innerRef.current && !innerRef.current.contains(e.target) && e.target.className !== 'download') {
        props.setVisible(false)
      }
    }
    document.addEventListener('click', handleClick, false)

    return () => {
      document.removeEventListener('click', handleClick, false)
    }
  },[props])


  const css = { display: props.visible ? 'block' : 'none' }


  return (
    <div className="floating-menu" ref={innerRef} style={css}>
    {props.children}
    </div>
  )

}

export default FloatingMenu
