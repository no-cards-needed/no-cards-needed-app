import plus from './iconsWhite/plus.svg';
import minus from './iconsWhite/minus.svg';
import React, { useState } from 'react';

function Counter( props ) {


    const [count, setCount] = useState(props.value)
  
    function countDown() {
      if (count > 0) setCount(count - 1) 
    } 
  
    function countUp() {
      setCount(count + 1)
    } 
    
    return (
        <div className="counter">
                <div class="quadBtnSmall Primary small noselect" id="dropSmall" onClick={countDown}>
                  <img src={minus} class="iconContainer"></img>
                </div>
                <text style={{width: "19px", textAlign: "center", color: "#fff"}}>{count.toString()}</text>
                <div class="quadBtnSmall Primary small noselect" id="dropSmall" onClick={countUp}>
                <img src={plus} class="iconContainer"></img>
                </div>
        </div>
    );
  }   

  export default Counter