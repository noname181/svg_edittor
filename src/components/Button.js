import React from 'react';
import './Button.scss';


const Button = (props) => (
  <button
    style={props.style}
    onClick={props.handleClick}
    title={props.title}
    className={props.className}
    >{props.children}
  </button>
)


export default Button;
