import pickUp from './iconsBlack/pickUp.svg';
import removePile from './iconsBlack/removePile.svg';
import takeATrick from './iconsBlack/takeATrick.svg';
import shufflePile from './iconsBlack/shufflePile.svg';
import dealAgain from './iconsBlack/dealAgain.svg';
import { useState } from 'react';




function ContextMenu() {


    return (
      <div className="contextMenu noselect" id="transpBlur">
          <div class="contextMenuItem">
                <img src={pickUp} class="iconContainerBig"></img>
                <text>Pick Up</text>
          </div>
          <div class="contextMenuItem">
                <img src={removePile} class="iconContainerBig"></img>
                <text>Remove Pile <br/> from Game</text>
          </div>
          <div class="contextMenuItem">
                <img src={takeATrick} class="iconContainerBig"></img>
                <text>Take a Trick</text>
          </div>
          <div class="contextMenuItem">
                <img src={shufflePile} class="iconContainerBig"></img>
                <text>Shuffle Pile</text>
          </div>
          <div class="contextMenuItem">
                <img src={dealAgain} class="iconContainerBig"></img>
                <text>Deal all Cards <br/> Again</text>
          </div>
      </div>
    );
  }

export default ContextMenu