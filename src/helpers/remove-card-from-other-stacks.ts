export const removeCardFromOtherStacks = (setStacks, stacks, cardId) => {
    // Removing Card from all other stacks
    console.log("SETSTACKS: Removing Card from other stacks from move card from other stacks")
	setStacks(stacks.map((stack, i) => {
        if (stack.cards) {
            stack.cards = stack.cards.filter(card => card !== cardId);
        }

		return stack;
	}))
}