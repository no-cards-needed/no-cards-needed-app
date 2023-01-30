export const getCardPositionInStack = (
		cardId: number, 
		stackId: number,
		controlledStack: React.MutableRefObject<ControlledStacks>, 
		) => {
	let cardPositionInStack: number = 0;
	console.log("getCardPositionInStack", cardId, stackId, controlledStack.current[stackId]);
	// Find out where the card is in the stack
	return controlledStack.current[stackId] 
			? controlledStack.current[stackId].findIndex((card) => card === cardId) < 0 
				? 0 
				: controlledStack.current[stackId].findIndex((card) => card === cardId) 
			: 0;
}