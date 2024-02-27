import React from 'react';
import './Menu.scss';


const Menu = (props) => (
  <div className={props.className} onClick={props.handleClick}>{props.children}</div>
)


export default Menu;
