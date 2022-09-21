import { useState } from "react";
import { checkCollision } from "./check-collision";
import { moveCardsAside } from "./move-cards-aside";

// state of the position when the drag started

export const handleCardDrag = (
                                cardRef: React.MutableRefObject<HTMLElement>,
                                cardId: number, 
                                usedCards: {0?: UsedCards}, 
                                setUsedCards: (usedCards) => void,
                                

                                getNearestStack: (cardRef) => {nearestStack, distance: number, index: number}, 
                                nearestStack: {nearestStack, index: number, distance: number}, 
                                setNearestStack: (nearestStack) => void, 
                                stacks: {0?: Stack}, 
                                setIsColliding: (isColliding: boolean) => void,
                                ) => {

    // Setting Z-Index of currently dragged Card to the highest
    // Check if Card is already on top
    if(usedCards[cardId].zIndex !== Object.keys(usedCards).length) {
        setUsedCards(
            {
                ...usedCards,
                [cardId]: {
                    ...usedCards[cardId],
                    zIndex: Object.keys(usedCards).length
                }
            }
        )
    }

    setNearestStack(getNearestStack(cardRef))

    // Collision
    if (nearestStack && nearestStack.nearestStack && checkCollision(nearestStack.nearestStack, cardRef.current)) {
        setIsColliding(true)

        // Checking if the Stack Type is an open one, so the cards can be moved aside
        const nearestStackType = stacks[nearestStack.index].stackType;
        if (nearestStackType === "openStack" || nearestStackType === "hand") {
            moveCardsAside(stacks, nearestStack, cardRef, usedCards, setUsedCards, cardId)
        }

    } else {
        if(nearestStack && nearestStack.nearestStack) {
            setIsColliding(false)
        }
    }
    
}