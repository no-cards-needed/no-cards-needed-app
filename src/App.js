import React, { useRef, useState } from "react";
import logo from './logo.svg';
import './App.css';

import Draggable from 'react-draggable'; // The default
import TEN_C from './assets/cards/10C';

function App() {

  const stackRef = useRef(null);
  const [isColliding, setIsColliding] = useState(false)

  const handleCardDrag = (data) => {
    const collision = checkCollision(stackRef.current, data.current)
    console.log(collision)
    setIsColliding(collision)
    
  }

  const checkCollision = (collider, colliding) => {
    const colliderRect = collider.getBoundingClientRect();
    const collidingRect = colliding.getBoundingClientRect();
 
    return (
      colliderRect.top < collidingRect.top + collidingRect.height / 2 &&
      collidingRect.bottom - collidingRect.height / 2 < colliderRect.bottom &&
      colliderRect.left < collidingRect.left + collidingRect.width / 2 &&
      colliderRect.right > collidingRect.right - collidingRect.width / 2
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className='dragArea' style={{width: '500px', height: '500px', border: isColliding ? '1px solid green' : '1px solid red',}} ref={stackRef}></div>
        <TEN_C positionCallback={handleCardDrag} colliding={isColliding} stack={stackRef}/>
      </header>
    </div>
  );
}

export default App;
