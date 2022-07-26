import close from './iconsBlack/close.svg';
import { Link } from "react-router-dom";

function MenuHeader() {

    return (
      <div className="menuHeader" id="basicDrop">
            <Link to="/" class="btn Secondary medium noselect" id="basicDrop" style={{position: "absolute", left: "28px"}}>
              {/* <div > */}
                <img class="iconContainer" src={close}></img>
              {/* </div> */}
            </Link>
            <headline>Create Game</headline>
      </div>
    );
  }

export default MenuHeader

// style={{position: "absolute", alignItems: "center"}}
// justifyContent: "start"