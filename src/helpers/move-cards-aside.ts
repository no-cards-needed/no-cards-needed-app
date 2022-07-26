export const moveCardsAside = (
	stacks: {cards: number[]}[], 
	nearestStack: {nearestStack, distance: number, index: number}, 
	currentCard, 
	usedCards: {id: number, symbol: string, controlledPosition: {x: number, y: number}, zIndex: number, movedAside: string, onStackType: string, ref}[], 
	setUsedCards: (usedCards) => void,
	id: number) => {


	const stack = stacks[nearestStack.index]
	// Moving the Cards in the open Stack aside

	stack.cards.map((loopedCard, i) => {
		if (loopedCard !== id) {
			// Get Position of currently dragged card
			const { left: cardLeft, right: cardRight } = currentCard.getBoundingClientRect();

			// Get Card by ID
			const card = usedCards.find(card => card.id === loopedCard);

			const cardWidth = card.ref.current.getBoundingClientRect().width
			const currentCardCenter = card.ref.current.getBoundingClientRect().left + cardWidth / 2

			const isLeft = cardLeft + cardWidth / 2 < currentCardCenter
			const isRight = cardRight - cardWidth / 2 > currentCardCenter
			// console.log(isLeft, isRight)
			
			// Set Card to Moved Aside
			setUsedCards(usedCards.map((card, i) => {
				if (card.id === loopedCard) {
					if (isLeft) {
						card.movedAside = "left"
					} else if (isRight) {
						card.movedAside = "right"
					} 
					// card.movedAside =  isLeft ? "left" : "right";
				}
				return card;
			}))

			// TODO: When in "Selection" mode, the collidion shouldnt toggle the stack width
		}
	})
}