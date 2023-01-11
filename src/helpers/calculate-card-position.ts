import { MutableRefObject } from "react";
import { getCardPositionInStack } from "./get-card-position-in-stack";
import { getPositionAtCenter } from "./get-position-at-center";

export const calculateCardPosition = (
	card: HTMLDivElement, 
	stackRef: HTMLDivElement, 
	stackId: number,
	controlledStack: MutableRefObject<ControlledStacks>, 
	cardId: number) => {

	// Get Card Position in stack from id
	const cardPositionInStack = getCardPositionInStack(cardId, stackId, controlledStack)

	const cardCount = controlledStack.current[stackId] ? controlledStack.current[stackId].length : 0;

	const stackCenter = getPositionAtCenter(stackRef, "stackCenter - calculate-card-position.ts 14");
	const { width: cardWidth, height: cardHeight } = card.getBoundingClientRect();

	const overlap = cardWidth / 2
	
	//X - position of first card (most left, bottom of stack)
	let firstCardX = 0 - cardWidth / 2
	
	//odd cards -> one is centered, even number -> no card centered
	if(cardCount%2 === 1){
		firstCardX += -1 * (cardCount - 1) / 2 * overlap;
	}
	else{
		firstCardX += -1 * cardCount / 2 * overlap + overlap / 2;
	}

	console.log({firstCardX, cardPositionInStack, overlap, stackCenter})
	console.log(firstCardX + cardPositionInStack * overlap + stackCenter.x)
	return firstCardX + cardPositionInStack * overlap + stackCenter.x
}