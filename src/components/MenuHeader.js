import close from '../assets/iconsBlack/close.svg';
import { Link } from "react-router-dom";

function MenuHeader() {

    return (
      <div className="menuHeader maxWidth" id="basicDrop">
            <Link to="/" class="btn Secondary medium noselect" id="basicDrop" style={{position: "absolute", left: "28px"}}>
                <img class="iconContainer" src={close} alt=""></img>
            </Link>
            <headline>Create Game</headline>
      </div>
    );
  }

export default MenuHeader

// style={{position: "absolute", alignItems: "center"}}
// justifyContent: "start"