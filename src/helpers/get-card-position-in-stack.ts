export const getCardPositionInStack = (cardId: number, stack: Stack) => {
	const cardIndex = [...stack.cards.values()].findIndex((card) => card === cardId)
	console.log(cardId, stack, cardIndex)
	return cardIndex
}
