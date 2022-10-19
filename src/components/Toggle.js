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
        <div className={toggleOn ? "toggleOn" : "toggleOff"} onClick={activate}>
            <div className={toggleOn ? "toggleCircleOn basicDrop" : "toggleCircleOff basicDrop"}></div>
        </div>
      </div>
    );
  }   

  export default Toggle