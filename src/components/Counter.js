import plus from '../assets/iconsWhite/plus.svg';
import minus from '../assets/iconsWhite/minus.svg';
import React, { useState } from 'react';

function Counter( props ) {


    const {value, setValue, minValue, disabled} = props
  
    function countDown() {
      if (value > minValue && disabled === false) setValue(value - 1) 
    } 
  
    function countUp() {
      if (disabled === false) setValue(value + 1)
    } 
    
    return (
        <div className="counter">
          <div className="quadBtnSmall Primary small noselect" id="dropSmall" onClick={countDown} style={{pointerEvents: disabled ? "none" : "inherit"}}>
            <img src={minus} className="iconContainer" alt=""></img>
          </div>
          <p style={{width: "19px", textAlign: "center", color: "#fff"}}>{value}</p>
          <div className="quadBtnSmall Primary small noselect" id="dropSmall" onClick={countUp} style={{pointerEvents: disabled ? "none" : "inherit"}}>
            <img src={plus} className="iconContainer" alt=""></img>
          </div>
        </div>
    );
  }   

  export default Counter