import React, {useState, useRef} from "react"

export const Stack = ({stack, updateCardPosition, stackRef}) => {
    // export const Stack = ({height, width, position, updateCardPosition, isColliding, stackRef}) => {

    const {stackType, orientation, cards, currentlyNearest, colliding, distance, height, width, position} = stack
    const {x, y} = position

    // const stackRef = useRef(null)
    const [cardsInStack, setCardsInStack] = useState([])

    // const [isColliding, setIsColliding] = useState(false)

    const cardStackLayoutDistance = 10

    // const addCardToStack = (card) => {
    //     setCardsInStack([...cardsInStack, card])
    //     setCardsInStackCount(cardsInStackCount + 1)
    // }

    // const removeCardFromStack = (card, cardIndex) => {
    //     setCardsInStack(cardsInStack.filter(c => c !== card))
    //     setCardsInStackCount(cardsInStackCount - 1)

    //     // Updates all other cards in the stack
    //     for (let i = 0; i < cardsInStack.length; i++) {
    //         const currentCard = cardsInStack[i];
            
    //         // Current Card Positions
    //         const {x: currentCardX, y: currentCardY} = currentCard.position
    //         const {x: currentCardWidth, y: currentCardHeight} = currentCard.size

    //         // New Card Positions
    //         let newCardX: number;
    //         let newCardY: number;

    //         // Calculating New Card Positions
    //         if (i !== cardIndex) {
    //             if (cardIndex < i) {
    //                 newCardX = currentCardX - cardStackLayoutDistance
    //                 newCardY = currentCardY
    //             } else {
    //                 newCardX = currentCardX + cardStackLayoutDistance
    //                 newCardY = currentCardY
    //             }
    //         }

    //         console.log(currentCard)

    //         // Updating Card Positions
    //         updateCardPositionInStack(currentCard, {x: newCardX, y: newCardY})
    //     }
    // }

    // const checkCollision = (card) => {
    //     const cardRect = card.getBoundingClientRect()
    //     const stackRect = stackRef.current.getBoundingClientRect()
    //     const isColliding = cardRect.top < stackRect.bottom && cardRect.bottom > stackRect.top && cardRect.left < stackRect.right && cardRect.right > stackRect.left
    //     setIsColliding(isColliding)
    // }

    // Updating the position of cards in the stack when a card is removed from the stack
    const updateCardPositionInStack = (card, {x, y}) => {
        updateCardPosition(card, {x, y})
    }

    const opacity = 100000/ distance / 500

    return (
        <div className='cardStack' style={{border: colliding ? '4px solid green' : '4px dashed grey', width, height, opacity}} ref={stackRef}>
            {JSON.stringify(cards)}
        </div>
    )
}