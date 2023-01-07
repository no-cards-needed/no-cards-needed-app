import { checkCollision } from "./check-collision";
import { moveCardsAside } from "./move-cards-aside";

// state of the position when the drag started

export const handleCardDrag = (
		cardRef: React.MutableRefObject<HTMLDivElement>,
		cardId: number, 

		usedCards: UsedCard[], 
		setUsedCards: (usedCards: UsedCard[]) => void,
		
		getNearestStack: (cardRef: React.MutableRefObject<HTMLDivElement>) => NearestStack, 
		nearestStack: NearestStack, 
		setNearestStack: (nearestStack: NearestStack) => void, 
		
		stacks: Stack[], 
		
		setIsColliding: (isColliding: boolean) => void,
		) => {

	// Setting Z-Index of currently dragged Card to the highest
	// Check if Card is already on top
	if(usedCards[cardId].zIndex !== usedCards.length) {
		const tempUsedCards = usedCards;
		tempUsedCards[cardId].zIndex = usedCards.length;
		setUsedCards(tempUsedCards)
	} 

	setNearestStack(getNearestStack(cardRef))

	// Collision
	if (nearestStack && nearestStack.nearestStack && checkCollision(nearestStack.nearestStack, cardRef.current)) {
		setIsColliding(true)

		// Checking if the Stack Type is an open one, so the cards can be moved aside
		const nearestStackType = stacks[nearestStack.stackIndex].stackType;
		if (nearestStackType === "front" || nearestStackType === "hand") {
			moveCardsAside(stacks, nearestStack, cardRef, usedCards, setUsedCards, cardId)
		}

	} else {
		if(nearestStack && nearestStack.nearestStack) {
			setIsColliding(false)
		}
	}
	
}