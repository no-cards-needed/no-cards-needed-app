import { cardDimensions } from "./card-dimensions"

export const moveCardsAside = (
	stacks: Stack[], 
	nearestStack: NearestStack, 
	currentCardRef: React.MutableRefObject<HTMLElement>, 
	usedCards: UsedCard[],
	setUsedCards: (usedCards: UsedCard[]) => void,
	cardId: number) => {

	const stack = stacks[nearestStack.stackIndex]

	// Moving the Cards in the open Stack aside
	if(stack.cards) {
		Object.keys(stack.cards).map((loopedCardId) => {
			const loopedCardId_INT = parseInt(loopedCardId)
			if (loopedCardId_INT !== cardId) {
				// Get Position of currently dragged card
				const { left: cardLeft, right: cardRight } = currentCardRef.current.getBoundingClientRect();
	
				const cardWidth = cardDimensions.width;
				const currentCardCenter = cardLeft + cardWidth / 2
	
				const isLeft = cardLeft + cardWidth / 2 < currentCardCenter
				const isRight = cardRight - cardWidth / 2 > currentCardCenter
				// console.log(isLeft, isRight)
				
				// Set Card to Moved Aside
				setUsedCards(
					{
						...usedCards,
						[loopedCardId_INT]: {
							...usedCards[loopedCardId_INT],
							movedAside: isLeft ? "left" : isRight ? "right" : "none"
						}
					}
				)
	
				// TODO: When in "Selection" mode, the collidion shouldnt toggle the stack width
			}
		})
	}
}