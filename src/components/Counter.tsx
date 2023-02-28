import Button from "./Button"

import plus from '../assets/iconsWhite/plus.svg';
import minus from '../assets/iconsWhite/minus.svg';

function Counter( {value, setValue, minValue, maxValue, disabled} : {value: number, setValue: (newValue: number) => void, minValue: number, maxValue: number, disabled: boolean} ) {

  
    function countDown() {
      if (value > minValue && disabled === false) setValue(value - 1) 
    } 
  
    function countUp() {
      if (disabled === false && value < maxValue) setValue(value + 1)
    } 
    
    return (
        <div className="counter">
          <Button btn={"quadBtnSmall"} iconLeading={minus} size={"small"} type={"Primary"} style={{pointerEvents: disabled ? "none" : "inherit"}} click={countDown} />
          <p style={{width: "19px", textAlign: "center", color: "#fff"}}>{value}</p>
          <Button btn={"quadBtnSmall"} iconLeading={plus} size={"small"} type={"Primary"} style={{pointerEvents: disabled ? "none" : "inherit"}} click={countUp} />
        </div>
    );
  }   

  export default Counter