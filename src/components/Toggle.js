import React, { useState } from 'react';

function Toggle() {
    
    const [active, setActive] = useState(false)
  
    function activate() {
        if (active) { 
            setActive(false) 
            console.log('off');
        } else { 
            setActive(true)
            console.log('on');
        }
    } 

    return (
     
  
      <div className="Toggle"> 
        <div class={active ? "toggleOn" : "toggleOff"} onClick={activate}>
            <div class={active ? "toggleCircleOn basicDrop" : "toggleCircleOff basicDrop"}></div>
        </div>
      </div>
    );
  }   

  export default Toggle