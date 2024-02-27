import React, { useState } from 'react';
import './ToolPanel.scss';


const ToolPanel = (props) => {

  const [minimized, setMinimized] = useState(false)

  let classname = 'toolpanel'
  classname += props.visible ? ' visible' : ''
  classname += minimized ? ' minimized' : ''

  return (
    <div className={classname}>
      <div className="minimizer" onClick={ () => setMinimized(!minimized) }></div>
      <div className="holder sbar">{props.children}</div>
    </div>
  )

}



export default ToolPanel;
