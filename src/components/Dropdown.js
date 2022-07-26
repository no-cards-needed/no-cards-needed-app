
import { useState } from 'react';
import chevronDown from '../assets/iconsWhite/chevron/down.svg';
import chevronUp from '../assets/iconsWhite/chevron/up.svg';


function Dropdown( props ) {

    const options = props.options
    const [ selection, setSelection ] = useState(options[0])

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
            <div class="dropdown" style={{borderBottomRightRadius: active ? "0px" : "12px", borderBottomLeftRadius: active ? "0px" : "12px",}}>
                <div class="dropdownHead" id="dropSmall" onClick={toggleDisplay}>
                    <text>{selection}</text>
                    <img src={active ? chevronUp : chevronDown} alt=""></img>
                </div>

                <div class="dropdownUnfolded" style={{display:display}}>
                    {options.map(option => (
                        <div class="dropdownItem" onClick={ () => setSelection(option)}>
                            <text>{option}</text>
                        </div>
                    ))}

                </div>
            </div>
            
        </div>
    )

}

export default Dropdown