import { calculateCardPosition } from "./calculate-card-position";
import { getPositionAtCenter } from "./get-position-at-center";
import {addCardIntoStack, moveCardToPosition} from "./move-card-to-position";
import { removeCardFromOtherStacks } from "./remove-card-from-other-stacks";

export const handleCardDrop = (
	cardId: number, 
	usedCards: {0?: Card},
	setUsedCards: (usedCards) => void, 
	isColliding: boolean,
	stacks: {0?: Stack}, 
	setStacks: (stacks) => void,
	nearestStack: {nearestStack, index: number, distance: number}, 
	setCards: (cardId: number, stackId: number) => void) => {

			// Set movedAside in all cards to false
			Object.keys(usedCards).forEach((cardId) => {
				setUsedCards({
					...usedCards,
					[cardId]: {
						...usedCards[cardId],
						movedAside: false,
					},
				})
			});

			// updateCardPosition(1, { x: 90, y: 110 })
			// Check if Card and Nearest Stack are colliding
			if (isColliding) {
				
				// Getting Previous Stack`
				
				const previousStackIndex = usedCards[cardId].onStack


				// Stack Position
				const {x: stackX, y: stackY} = getPositionAtCenter(nearestStack.nearestStack, "stackPosition - handle-card-drop.ts 96");

				// update cards
				setCards(
					cardId,
					nearestStack.index,
				)
			}
}