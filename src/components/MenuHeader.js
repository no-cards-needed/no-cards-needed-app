import close from './iconsBlack/close.svg';

function MenuHeader() {

    return (
      <div className="menuHeader" id="basicDrop">
            <div class="btn Secondary medium noselect" id="basicDrop" style={{position: "absolute", left: "28px"}}>
              <img class="iconContainer" src={close}></img>
            </div>
            <headline>Create Game</headline>
      </div>
    );
  }

export default MenuHeader

// style={{position: "absolute", alignItems: "center"}}
// justifyContent: "start"