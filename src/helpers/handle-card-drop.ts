export const handleCardDrop = (
	cardId: number,
	usedCards: UsedCardsMap,
	setUsedCards: (usedCards: UsedCardsMap) => void,
	isColliding: boolean,
	nearestStack: NearestStack | null,
	setNearestStack: (nearestStack: NearestStack) => void,
	setCards: (cardId: number, stackId: number, userInitiated: boolean) => void) => {

	// Set movedAside in all cards to false
	resetMovedAside(usedCards, setUsedCards)

	// updateCardPosition(1, { x: 90, y: 110 })
	// Check if Card and Nearest Stack are colliding
	if (isColliding && nearestStack) {
		// update cards
		console.log("🫱 is colliding, updating cards", cardId, nearestStack)
		setCards(
			cardId,
			nearestStack.stackIndex,
			true
		)
	}
	setNearestStack(null)
}

function resetMovedAside(usedCards: UsedCardsMap, setUsedCards: (usedCards: UsedCardsMap) => void) {
	usedCards.forEach((card: Card, cardId: number) => {
		const tempUsedCards = usedCards;
		tempUsedCards.get(cardId).movedAside = "none";
		setUsedCards(tempUsedCards)
	});
}