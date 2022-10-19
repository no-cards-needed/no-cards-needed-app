export const getCardPositionInStack = (card, stack: {cards: number[]}) => {
	let cardPositionInStack: number = 0;

	for (let i = 0; i < (stack.cards ? stack.cards.length : 0); i++) {
		const cardInStack = stack.cards[i];
		if (cardInStack === card) {
			cardPositionInStack = i
		}
	}

	return cardPositionInStack
}