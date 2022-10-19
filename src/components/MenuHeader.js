import close from '../assets/iconsBlack/close.svg';
import { Link } from "react-router-dom";

function MenuHeader() {

    return (
      <div className="menuHeader maxWidth" id="basicDrop">
            <Link to="/" className="btn Secondary medium noselect" id="basicDrop" style={{position: "absolute", left: "28px", width: "48px"}}>
                <img className="iconContainer" src={close} alt=""></img>
            </Link>
            <div className="headline">Create Game</div>
      </div>
    );
  }

export default MenuHeader

// style={{position: "absolute", alignItems: "center"}}
// justifyContent: "start"