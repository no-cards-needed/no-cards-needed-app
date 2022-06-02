import { useState } from "react";
import { checkCollision } from "./check-collision";
import { moveCardsAside } from "./move-cards-aside";

// state of the position when the drag started

export const handleCardDrag = (
                                data: React.MutableRefObject<any>, 
                                id: number, 
                                usedCards: {id: number, symbol: string, controlledPosition: {x: number, y: number}, zIndex: number, movedAside: string, onStackType: string, ref}[], 
                                setUsedCards: (usedCards) => void, 
                                getNearestStack: (card) => {nearestStack, distance: number, index: number}, 
                                nearestStack: {nearestStack, index: number, distance: number}, 
                                setNearestStack: (nearestStack) => void, 
                                stacks: {stackType: string, orientation: string, cards: number[], currentlyNearest: boolean, colliding: boolean, distance: number, height: number, width: number, position: {x: number, y: number}}[], 
                                setIsColliding: (isColliding: boolean) => void) => {

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

    // Collision
    if (nearestStack && nearestStack.nearestStack && checkCollision(nearestStack.nearestStack, card)) {
        // Set Nearest Stack to Colliding
        stacks[nearestStack.index].colliding = true;

        setIsColliding(true)

        //Getting Stack Type of the Nearest Stack
        const nearestStackType = stacks[nearestStack.index].stackType;
        if (nearestStackType === "openStack" || nearestStackType === "hand") {
            moveCardsAside(stacks, nearestStack, data.current, usedCards, setUsedCards, id)
        }

    } else {
        if(nearestStack && nearestStack.nearestStack) {
            // Set Nearest Stack to Colliding
            stacks[nearestStack.index].colliding = false;
            setIsColliding(false)

        }
        console.log("code block executing")

        setUsedCards(usedCards.map((card, i) => {
            card.movedAside = "false";
            return card;
        }))
    }
    
}