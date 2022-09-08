import { removeCardFromOtherStacks } from "./remove-card-from-other-stacks";

// Adding Card-ID into the Stack Object
export const addCardIntoStack = (stacks, setStacks, stackIndex, index, cardId) => {

	// Removing Card from all other stacks
	removeCardFromOtherStacks(setStacks, stacks, cardId)

	console.log("SETSTACKS: Adding Card into Stack from move card to position")
	//Adding Card ID into the Stack Object at a specific index
	setStacks(stacks.map((stack, i) => {
		if (i === stackIndex && stack.cards) {
			stack.cards.splice(index, 0, cardId);
		} else if(i === stackIndex && !stack.cards) { 
			stack.cards = [cardId]
		}
		return stack;
	}))
}

export const moveCardToPosition = (
stacks: {stackType: string, orientation: string, cards: number[], currentlyNearest: boolean, colliding: boolean, distance: number, height: number, width: number, position: {x: number, y: number}}[],
setStacks: (value: React.SetStateAction<{
	stackType: string;
	orientation: string;
	cards: any[];
	currentlyNearest: boolean;
	colliding: boolean;
	distance: number;
	height: number;
	width: number;
	position: {
		x: number;
		y: number;
	};
}[]>) => void,
usedCards: {id: number, symbol: string, controlledPosition: {x: number, y: number}, zIndex: number, movedAside: string, onStackType: string, ref, animation: string, orientation: string}[],
setUsedCards: (usedCards) => void,
stackIndex: number,
updateCardPosition: (cardId: any, { x, y }: {
	x: any;
	y: any;
}) => void,
cardId,
stackPosition: {x: number, y: number}
) => {


	const cardDimensions = {width: 80, height: 112}

	addCardIntoStack(stacks, setStacks, stackIndex, stacks[stackIndex].cards ? stacks[stackIndex].cards.length : 0, cardId)

	console.log("Dropping at", stackPosition)
	updateCardPosition(cardId, {
		x: stackPosition.x - cardDimensions.width / 2,
		y: stackPosition.y - cardDimensions.height / 2
	})

	// Set On Stack Type of Card
	setUsedCards(usedCards.map((card, i) => {
		if (card.id === cardId) {
			card.onStackType = "stack";
			card.orientation = stacks[stackIndex].orientation;
			card.zIndex = stacks[stackIndex].cards ? stacks[stackIndex].cards.length : 0;
		}
		return card;
	}))
}
