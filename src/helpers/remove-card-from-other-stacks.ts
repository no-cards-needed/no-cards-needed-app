export const removeCardFromOtherStacks = (
		setStacks: (stacks) => void,
		stacks: {0: Stack},
		cardId: number
	) => {
	// Removing Card from all other stacks
	
	// Find out on what stacks the card is
	const stacksWithCard = Object.keys(stacks).filter(stackId => {
		const stack = stacks[stackId];
		// console.log(stack, stack.cards ? stack.cards.includes(cardId.toString()) : null)
		return stack.cards ? stack.cards.includes(cardId.toString()) : false;
	});

	console.log({stacks});
	
	stacksWithCard.forEach(stackId => {
		console.log("setting stacks " + stackId);
		setStacks(
			{
				"hi": "hi",
				// ...stacks,
				// stackId: {
				// 	// Filtering the cards
				// 	// https://stackoverflow.com/a/37616104
				// 	// cards: Object.fromEntries(Object.entries(stacks[stackId].cards).filter(([cardKey, cardVal]) => cardKey !== cardId.toString())),
				// 	...stacks[stackId],
				// 	cards: ["lol"],
				// 	// cards: stacks[stackId].cards.filter(card => card !== cardId.toString()),
				// },
			},
		);
	});
	console.log({stacks});

}