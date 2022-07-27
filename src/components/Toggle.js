import React, { useState } from 'react';

function Toggle() {
    
    const [active, setActive] = useState(false)
  
    function activate() {
        if (active) { 
            setActive(false) 
        } else { 
            setActive(true)
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