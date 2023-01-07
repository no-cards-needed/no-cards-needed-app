export const handleCardDrop = (
	cardId: number, 
	usedCards: UsedCard[],
	setUsedCards: (usedCards: UsedCard[]) => void, 
	isColliding: boolean,
	nearestStack: NearestStack, 
	setCards: (cardId: number, stackId: number) => void) => {

		// Set movedAside in all cards to false
		usedCards.forEach((card: Card, cardId: number) => {
			const tempUsedCards = usedCards;
			tempUsedCards[cardId].movedAside = "none";
			setUsedCards(tempUsedCards)
		});

		// updateCardPosition(1, { x: 90, y: 110 })
		// Check if Card and Nearest Stack are colliding
		if (isColliding) {
			// update cards
			setCards(
				cardId,
				nearestStack.stackIndex,
			)
		}
}