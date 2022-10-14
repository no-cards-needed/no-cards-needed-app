export const removeCardFromOtherStacks = (
		setStack: (stack, stackId) => void,
		stacks: {0: Stack},
		cardId: number
	) => {
	// Removing Card from all other stacks
	
	// Find out on what stacks the card is
	const stacksWithCard = Object.keys(stacks).filter(stackId => {
		const stack = stacks[stackId];
		return stack.cards ? Object.keys(stack.cards).includes(cardId.toString()) : false;
	});

	stacksWithCard.forEach(stackId => {
		setStack(
			{
				...stacks[stackId],
				// Filtering the cards
				// https://stackoverflow.com/a/37616104
				cards: Object.fromEntries(Object.entries(stacks[stackId].cards).filter(([cardKey, cardVal]) => cardKey !== cardId.toString())),
			},
			stackId
		);
	});
}