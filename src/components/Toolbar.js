import React from 'react';
import './Toolbar.scss';


const Toolbar = (props) => {

  const toolButtons = React.Children.map(props.children, child => {

    // check which tool is active
    if (props.activeTool === child.props.name){
      return React.cloneElement(child, { className: child.props.className + ' active' })
    }

    return React.cloneElement(child)

  })

  return (
    <div className="toolbar">
      {toolButtons}
    </div>
  )
}


export default Toolbar;
