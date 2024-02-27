import React, { useState } from 'react';
import './InputSelect.scss';


const InputSelect = (props) => {

  const [open, setOpen] = useState(false)

  let cssClass = open ? 'input-select open' : 'input-select'

  const handleClick = (value) => {
    props.handleChange(value)
  }


  return (
    <div className={cssClass} onClick={(e) => setOpen(!open)}>
      <div className="select">
        <div className="active-option">{
          React.Children.map(props.children, (child) => {
            if (JSON.stringify(child.props.value) === JSON.stringify(props.activeOption)) {
              let clonedChild = React.cloneElement(child)
              return clonedChild.props.children
            }
          })
        }</div>
        <div className="list">
          {props.children.map((child, index) => {
            let updatedProps = {...child.props, handleClick: handleClick}
            let updatedChild = {...child, props: updatedProps}
            return updatedChild
          })}
        </div>
      </div>
    </div>
  )
}

const Option = (props) => (
  <div className="option" onClick={() => props.handleClick(props.value)}>{props.children}</div>
)


export { InputSelect, Option }