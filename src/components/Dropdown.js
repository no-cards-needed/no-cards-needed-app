
import { useState } from 'react';
import chevronDown from '../assets/iconsWhite/chevron/down.svg';
import chevronUp from '../assets/iconsWhite/chevron/up.svg';


function Dropdown( props ) {

    const {options, setSelection, deckCards} = props

    const [ display, setDisplay ] = useState( 'none' )
    const [ active, setActive ] = useState( false )

    function toggleDisplay() {
        if (active) {   
            setActive(false) 
            setDisplay( 'none' )
        } else { 
          setActive(true) 
          setDisplay( 'flex' )
    
        }
      } 

    return (    
        <div className="Dropdown">
            <div className="dropdown" id="dropSmall" style={{borderBottomRightRadius: active ? "0px" : "12px", borderBottomLeftRadius: active ? "0px" : "12px",}}>
                <div className="dropdownHead" onClick={toggleDisplay}>
                    <p>{deckCards}</p>
                    <img src={active ? chevronUp : chevronDown} alt=""></img>
                </div>

                <div className="dropdownUnfolded" style={{display:display}}>
                    {options.map((option, index) => (
                        <div className="dropdownItem" key={index} onClick={ () => { setSelection(option); toggleDisplay() }}>
                            <p>{option}</p>
                        </div>
                    ))}

                </div>
            </div>
            
        </div>
    )

}

export default Dropdown