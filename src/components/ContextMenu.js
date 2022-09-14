import pickUp from '../assets/iconsBlack/pickUp.svg';
import removePile from '../assets/iconsBlack/removePile.svg';
import takeATrick from '../assets/iconsBlack/takeATrick.svg';
import shufflePile from '../assets/iconsBlack/shufflePile.svg';
import dealAgain from '../assets/iconsBlack/dealAgain.svg';


function ContextMenu() {


    return (
      <div className="conpMenu noselect" id="transpBlur">
          <div class="conpMenuItem">
                <img src={pickUp} class="iconContainerBig" alt=""></img>
                <p>Pick Up</p>
          </div>
          <div class="conpMenuItem">
                <img src={removePile} class="iconContainerBig" alt=""></img>
                <p>Remove Pile <br/> from Game</p>
          </div>
          <div class="conpMenuItem">
                <img src={takeATrick} class="iconContainerBig" alt=""></img>
                <p>Take a Trick</p>
          </div>
          <div class="conpMenuItem">
                <img src={shufflePile} class="iconContainerBig" alt=""></img>
                <p>Shuffle Pile</p>
          </div>
          <div class="conpMenuItem">
                <img src={dealAgain} class="iconContainerBig" alt=""></img>
                <p>Deal all Cards <br/> Again</p>
          </div>
      </div>
    );
  }

export default ContextMenu