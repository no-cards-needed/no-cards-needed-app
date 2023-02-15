import { MutableRefObject } from "react";
import { checkCollision } from "./check-collision";
import { getNearestStack } from "./getNearestStack";
import { moveCardsAside } from "./move-cards-aside";

// state of the position when the drag started

export const handleCardDrag = (
		cardRef: MutableRefObject<HTMLDivElement>,
		cardId: number, 

		usedCards: UsedCardsMap, 
		setUsedCards: (usedCards: UsedCardsMap) => void,
		
		nearestStack: NearestStack, 
		setNearestStack: (nearestStack: NearestStack) => void, 
		
		usedStacksRef: MutableRefObject<StackMap>, 
		stacksDomRef: React.MutableRefObject<HTMLDivElement[]>,
		
		setIsColliding: (isColliding: boolean) => void,
		) => {

	// Setting Z-Index of currently dragged Card to the highest
	// Check if Card is already on top
	if(usedCards.get(cardId).zIndex !== usedCards.size) {
		console.log("🫱 updating zIndex", usedCards.get(cardId).zIndex, usedCards.size)
		const tempUsedCards = usedCards;
		tempUsedCards.get(cardId).zIndex = usedCards.size;
		setUsedCards(tempUsedCards)
	} 

	setNearestStack(getNearestStack(cardRef, usedStacksRef, stacksDomRef))

	// Collision
	if (nearestStack && nearestStack.nearestStack && checkCollision(nearestStack.nearestStack, cardRef.current)) {
		setIsColliding(true)

		// Checking if the Stack Type is an open one, so the cards can be moved aside
		const nearestStackType = usedStacksRef.current.get(nearestStack.stackIndex).stackType;
		if (nearestStackType === "open" || nearestStackType === "hand") {
			moveCardsAside(usedStacksRef, nearestStack, cardRef, usedCards, setUsedCards, cardId)
		}

	} else {
		if(nearestStack && nearestStack.nearestStack) {
			setIsColliding(false)
		}
	}
	
}