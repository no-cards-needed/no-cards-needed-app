import React, { useState } from 'react';

function Toggle( props ) {
    
    const {toggleOn, setToggleOn} = props
  
    function activate() {
        if (toggleOn) { 
            setToggleOn(false) 
        } else { 
          setToggleOn(true)
        }
    } 

    return (
     
  
      <div className="Toggle"> 
        <div class={toggleOn ? "toggleOn" : "toggleOff"} onClick={activate}>
            <div class={toggleOn ? "toggleCircleOn basicDrop" : "toggleCircleOff basicDrop"}></div>
        </div>
      </div>
    );
  }   

  export default Toggle