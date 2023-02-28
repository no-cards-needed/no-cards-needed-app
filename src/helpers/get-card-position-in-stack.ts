export const getCardPositionInStack = (cardId: number, stackId: number, stack: Stack) => {
	const cardIndex = [...stack.cards].findIndex((card) => card === cardId)
	return calculateCardPositionInStack(cardIndex, stack)
}

function calculateCardPositionInStack (cardIndex: number, stack: Stack) {
	if (cardIndex < 0 || !stack.cards) {
		return 0;
	}
	
	return cardIndex;
}