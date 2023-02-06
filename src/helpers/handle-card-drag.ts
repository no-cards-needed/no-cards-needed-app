import { MutableRefObject } from "react";
import { checkCollision } from "./check-collision";
import { getNearestStack } from "./getNearestStack";
import { moveCardsAside } from "./move-cards-aside";

// state of the position when the drag started

export const handleCardDrag = (
		cardRef: MutableRefObject<HTMLDivElement>,
		cardId: number, 

		usedCards: UsedCard[], 
		setUsedCards: (usedCards: UsedCard[]) => void,
		
		nearestStack: NearestStack, 
		setNearestStack: (nearestStack: NearestStack) => void, 
		
		usedStacksRef: MutableRefObject<Stack[]>, 
		stacksDomRef: React.MutableRefObject<HTMLDivElement[]>,
		
		setIsColliding: (isColliding: boolean) => void,
		) => {

	// Setting Z-Index of currently dragged Card to the highest
	// Check if Card is already on top
	if(usedCards[cardId].zIndex !== usedCards.length) {
		console.log("🫱 updating zIndex", usedCards[cardId].zIndex, usedCards.length)
		const tempUsedCards = usedCards;
		tempUsedCards[cardId].zIndex = usedCards.length;
		setUsedCards(tempUsedCards)
	} 

	setNearestStack(getNearestStack(cardRef, usedStacksRef, stacksDomRef))

	// Collision
	if (nearestStack && nearestStack.nearestStack && checkCollision(nearestStack.nearestStack, cardRef.current)) {
		setIsColliding(true)

		// Checking if the Stack Type is an open one, so the cards can be moved aside
		const nearestStackType = usedStacksRef.current[nearestStack.stackIndex].stackType;
		if (nearestStackType === "open" || nearestStackType === "hand") {
			moveCardsAside(usedStacksRef, nearestStack, cardRef, usedCards, setUsedCards, cardId)
		}

	} else {
		if(nearestStack && nearestStack.nearestStack) {
			setIsColliding(false)
		}
	}
	
}