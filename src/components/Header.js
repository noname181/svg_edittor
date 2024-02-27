import React from 'react';
import './Header.scss';


const Header = (props) => {
  return (
    <header>
      <div />
      <div className="menu">{props.children}</div>
    </header>
    )
}

export default Header;
