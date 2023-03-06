export const getCardPositionInStack = (cardId: number, stack: Stack) => {
	const cardIndex = [...stack.cards.values()].findIndex((card) => card === cardId)
	return cardIndex
}
