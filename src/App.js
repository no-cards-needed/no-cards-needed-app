import React, { useRef, useState } from "react";
import { useSpring } from "react-spring";
import './App.css';

import Card from "./assets/components/Card";
import { Stack } from "./assets/components/Stack.tsx";

// https://www.npmjs.com/package/use-dynamic-refs
// import useDynamicRefs from "./assets/helpers/use-dynamic-refs";

function App() {

  const stackRef = useRef([]);
  const [isColliding, setIsColliding] = useState(false);

  const [stacks, setStacks] = useState([
    {
      stackType: "stack",
      orientation: "front",
      cards: [],
      currentlyNearest: false,
      colliding: false,
      distance: 0,
      height: 500,
      width: 500,
      position: {
        x: 0,
        y: 0
      }
    },
    {
      stackType: "openStack",
      orientation: "front",
      cards: [],
      currentlyNearest: false,
      colliding: false,
      distance: 0,
      height: 500,
      width: 500,
      position: {
        x: 0,
        y: 0
      }
    },
  ])


  const [nearestStack, setNearestStack] = useState(null);
  

  const [usedCards, setUsedCards] = useState([
    {
      id: 0,
      symbol: "TEN_C",
      controlledPosition: {
        x: 0,
        y: 0
      },
      zIndex: 0,
    },
    {
      id: 1,
      symbol: "TEN_D",
      controlledPosition: {
        x: 0,
        y: 0
      },
      zIndex: 0,
    },
    {
      id: 2,
      symbol: "TEN_H",
      controlledPosition: {
        x: 0,
        y: 0
      },
      zIndex: 0,
    },
  ]);


  const getStackBoundingClientRect = (stack) => {
    if (stack.current) {
      return stack.current.getBoundingClientRect();
    }
    return null;
  }

  const getPositionAtCenter = (element) => {
    const { top, left, width, height } = element.getBoundingClientRect();
    return {
      x: left + width / 2,
      y: top + height / 2
    };
  }

  const getDistanceBetweenTwoElements = (element1, element2) => {

    const { x: x1, y: y1 } = getPositionAtCenter(element1);
    const { x: x2, y: y2 } = getPositionAtCenter(element2);
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  const getNearestStack = (card) => {
    const distances = stacks.map((stack, index) => {
      const distance = getDistanceBetweenTwoElements(stackRef[index], card)

      // Update Stack Distance
      setStacks(stacks.map((stack, i) => {
        if (i === index) {
          stack.distance = distance;
        }
        return stack;
      }))

      return distance
    });
    const nearestStack = stackRef[distances.indexOf(Math.min(...distances))];

    return {nearestStack, distance: Math.min(...distances), index: distances.indexOf(Math.min(...distances))};
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

  const handleCardDrag = (data, id) => {
    // const collisionWithHand = checkCollision(handRef.current, data.current)
    
    // Setting Z-Index of currently dragged Card to the highest
    setUsedCards(usedCards.map((card, i) => {
      if (i === id) {
        card.zIndex = usedCards.length;
      }
      return card;
    }
    ))

    const card = data.current
    setNearestStack(getNearestStack(card))

    if (checkCollision(nearestStack.nearestStack, card)) {
      // Set Nearest Stack to Colliding
      stacks[nearestStack.index].colliding = true;

      setIsColliding(true)


      // setStackCardAmount(stackCardAmount + 1)

    } else {
      // Set Nearest Stack to Colliding
      stacks[nearestStack.index].colliding = false;
      setIsColliding(false)
    }
    
  }

  const handleCardDrop = (data, id) => {
    console.log(data, id)

    // Check if Card and Nearest Stack are colliding
    if (isColliding) {
      console.log(stacks[nearestStack.index].cards.length)

      // Setting Controlled Position of dropped card to the position of the nearest stack
      setUsedCards(usedCards.map((card, i) => {
        // Stack Position
        const {x: stackX, y: stackY} = getPositionAtCenter(nearestStack.nearestStack);
  
        if (i === id) {
          switch (stacks[nearestStack.index].stackType) {
            case "stack":
              updateCardPosition(card.id, {
                x: stackX - data.current.getBoundingClientRect().width / 2, 
                y: stackY - data.current.getBoundingClientRect().height / 2
              })
              break;
            case "openStack":
              const xCenter = stackX - data.current.getBoundingClientRect().width / 2

              // Mitte - Kartenbreite * Anzahl an Karten + Anzahl der Karten * (Kartenbreite / 2)
              
              const newPosition = (xCenter - 
                data.current.getBoundingClientRect().width * (stacks[nearestStack.index].cards.length)) + 
                stacks[nearestStack.index].cards.length * data.current.getBoundingClientRect().width / 1.5

              console.log(`newPosition: ${newPosition}`)
              console.log(`xCenter: ${xCenter}`)
              console.log(`cardWidth: ${data.current.getBoundingClientRect().width}`)	

              updateCardPosition(card.id, {
                x: newPosition, 
                y: stackY - data.current.getBoundingClientRect().height / 2
              })

              break;
            default:
              break;
          }

        }
        return card;
      }))

      // Removing Card-ID from all other stacks
      setStacks(stacks.map((stack, i) => {
        if (i !== nearestStack.index) {
          stack.cards = stack.cards.filter(card => card !== id);
        }
        return stack;
      }))


      // Adding Card-ID into the Stack Object
      setStacks(stacks.map((stack, i) => {
        if (i === nearestStack.index) {
          stack.cards.push(id);
        }
        return stack;
      }))
    }
  }



  const updateCardPosition = (cardId, {x, y}) => {
    console.log(`cardId: ${cardId}`)
    console.log(`x: ${x}`)
    console.log(`y: ${y}`)

    // const [springyX] = useSpring(() => ({ springyX: 0, y: 0 }));
    // Update Card Position
    setUsedCards(usedCards.map((card, i) => {
      if (i === cardId) {
        card.controlledPosition = {
          x,
          y
        }
      }
      return card;
    }))
  }

  return (
    <div className="App">
      {/* <div className='cardStack' style={{border: isColliding ? '1px solid green' : '1px solid red',}} ref={stackRef}></div> */}

      {
        stacks.map((stack, index) => {
          return (
            <Stack key={index} stack={stack} stackRef={el => stackRef[index] = el} onCardDrag={handleCardDrag} onCardDrop={handleCardDrop} updateCardPosition={updateCardPosition}/>
          )
        })
      }
      {/* <Stack height={500} width={500} position={{x: 0, y: 0}} updateCardPosition={updateCardPosition} isColliding={isColliding} stackRef={stackRef}/> */}

      {/* <div className='hand' style={{border: isColliding ? '1px solid green' : '1px solid red',}}></div> */}
      <div className="hand">
        {
          usedCards.map(card => {
            return <Card key={card.id} id={card.id} symbol={card.symbol} zIndex={card.zIndex} handleCardDrag={handleCardDrag} handleCardDrop={handleCardDrop} controlledPosition={card.controlledPosition}/>
          })
        }
      </div>
    </div>
  );
}

export default App;
