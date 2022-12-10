export const getCardPositionInStack = (cardId: number, stack: {cards: number[]}) => {
	let cardPositionInStack: number = 0;
	console.log("getCardPositionInStack", {cardId, stack, findIndex: stack.cards ? stack.cards.findIndex((card) => card === cardId) : null});
	// Find out where the card is in the stack
	return stack.cards ? stack.cards.findIndex((card) => card === cardId) < 0 ? 0 : stack.cards.findIndex((card) => card === cardId) : 0;
 
	for (let i = 0; i < (stack.cards ? stack.cards.length : 0); i++) {
		const cardInStack = stack.cards[i];
		if (cardInStack === cardId) {
			cardPositionInStack = i
		}
	}

	return cardPositionInStack
}