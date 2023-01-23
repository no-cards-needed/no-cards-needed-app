type GameStatus = {
	host: string,
	created: object,
	currentGameState: "lobby" | "game",
	timestamp: number | object,
} 

type Card = {
	symbol: string,
	onStack: number,
	hasPlayer: string | "none",
}

type NearestStack = {
	nearestStack: HTMLDivElement,
	distanceToCard: number,
	stackIndex: number
}

type Stack = {
	id: number,
	/**
	 * Type of stack
	 * 
	 * can be "hidden", "back", "front"
	 */
	stackType: "hand" | "hidden" | "back" | "front" | "open",
	/**
	 * Position of stack in Stack-Grid
	 */
	position: {x: number, y: number},
	cards?: number[],
}

interface UsedCard extends Card {
	onStackType: Stack["stackType"]

	controlledPosition: {x: number, y: number},
	zIndex: number,
	animation: string,
	movedAside: "left" | "right" | "none",
	hasShadow: boolean
}

type ControlledStacks = {
	[stackId: number]: number[]
}