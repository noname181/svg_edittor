import React from 'react';
import './InputAmount.scss';


const InputAmount = (props) => {
  const unit = props.unit || ''
  const value = props.value || 0

  return (
      <div className={`button-amount ${props.disabled ? 'disabled' : ''}`}>
        <div className="decrease" onClick={ () => !props.disabled && props.handleDecrease() }>-</div>
        <input onChange={(e) => props.handleChange(e)}
          disabled={props.disabled}
          value={value + unit}
          type="text" />
        <div className="increase" onClick={ () => !props.disabled && props.handleIncrease() }>+</div>
      </div>
  )

}


export default InputAmount;
