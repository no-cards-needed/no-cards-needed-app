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
		
		tableStackRef: MutableRefObject<StackMap>, 
		handStackRef: MutableRefObject<Stack>,
		stacksDomRef: MutableRefObject<Map<number | string, HTMLDivElement>>,
		
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

	setNearestStack(getNearestStack(cardRef, stacksDomRef))

	// Collision
	if (nearestStack && nearestStack.nearestStack && checkCollision(nearestStack.nearestStack, cardRef.current)) {
		setIsColliding(true)

		// Checking if the Stack Type is an open one, so the cards can be moved aside
		const nearestStackType = handStackRef.current.id === nearestStack.stackIndex ? "hand" 
									: tableStackRef.current.get(nearestStack.stackIndex).stackType;
		if (nearestStackType === "open") {
			moveCardsAside(tableStackRef.current.get(nearestStack.stackIndex).cards.size, cardRef, usedCards, setUsedCards, cardId)
		} else if (nearestStackType === "hand") {
			moveCardsAside(handStackRef.current.cards.size, cardRef, usedCards, setUsedCards, cardId)
		}

	} else {
		if(nearestStack && nearestStack.nearestStack) {
			setIsColliding(false)
		}
	}
	
}