import React, { useRef, useState } from "react";
import './App.css';

import Card from "./assets/components/Card";

// https://www.npmjs.com/package/use-dynamic-refs
// import useDynamicRefs from "./assets/helpers/use-dynamic-refs";

function App() {

  const stackRef = useRef(null);
  const handRef = useRef(null);
  const [stackCardAmount, setStackCardAmount] = useState(0);
  const [handCardAmount, setHandCardAmount] = useState(2);
  const [isColliding, setIsColliding] = useState(true)
  const [nearestStack, setNearestStack] = useState(handRef)

  // const [cardsInStack, setCardsInStack] = useDynamicRefs()


  const getStackBoundingClientRect = (stack) => {
    if (stack.current) {
      return stack.current.getBoundingClientRect();
    }
    return null;
  }

  const handleCardDrag = (data) => {
    const collisionWithStack = checkCollision(stackRef.current, data.current)
    const collisionWithHand = checkCollision(handRef.current, data.current)

    if (collisionWithStack) {
      console.log("colliding with stack")



      setIsColliding(true)

      setNearestStack({
        stack: getStackBoundingClientRect(stackRef),
        stackType: "stack",
        stackCardAmount
      })
      // setStackCardAmount(stackCardAmount + 1)

    } else if (collisionWithHand) {
      console.log("colliding with hand", handCardAmount);

      setIsColliding(true)

      setNearestStack({
        stack: handRef.current.getBoundingClientRect(),
        stackType: "hand",
        stackCardAmount: handCardAmount
      })

      // setHandCardAmount(handCardAmount + 1)
    } else {
      setIsColliding(false)
    }
    
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
      <div className='cardStack' style={{border: isColliding ? '1px solid green' : '1px solid red',}} ref={stackRef}></div>
      <div className='hand' style={{border: isColliding ? '1px solid green' : '1px solid red',}} ref={handRef}></div>
      <div className="hand">
        <Card positionCallback={handleCardDrag} colliding={isColliding} stack={nearestStack} card={"TEN_C"} hand={{handRef, i: 0, handCardAmount: 2}}/>
        <Card positionCallback={handleCardDrag} colliding={isColliding} stack={nearestStack} card={"TEN_D"} hand={{handRef, i: 1, handCardAmount: 2}}/>
        <Card positionCallback={handleCardDrag} colliding={isColliding} stack={nearestStack} card={"TEN_H"} hand={{handRef, i: 2, handCardAmount: 2}}/>
      </div>
    </div>
  );
}

export default App;
