type ListOfPlayers = Map<string, Player>

type Player = {
	name: string;
	id: string;
	avatar: 1 | 2 | 3 | 4 | 5;
}

type GameStatus = {
	host: string,
	created: object,
	currentGameState: "lobby" | "game",
	timestamp: number | object,
}

type GameLog = {
	message: string,
	lastPlayerId: string,
	lastPlayerCardsOnHand: number,
}[]

type Card = {
	cardId: number,
	symbol: string,
	onStack: number | string,
}

type UsedCardsMap = Map<number, UsedCard>

interface UsedCard extends Card {
	onStackType: Stack["stackType"]

	controlledPosition: { x: number, y: number },
	zIndex: number,
	animation: string,
	movedAside: "left" | "right" | "none",
	hasShadow: boolean
}

type DropdownContent = {
	count: number,
	text: string,
	src: JSX.Element,
	boundries: {
		from: number,
		to: number
	}
}

type NearestStack = {
	nearestStack: HTMLDivElement,
	distanceToCard: number,
	stackIndex: number
}

type StackMap = Map<number | string, Stack>

type Stack = {
	id: number | string,
	/**
	 * Type of stack
	 * 
	 * can be "hidden", "back", "front"
	 */
	stackType: "hand" | "hidden" | "back" | "front" | "open",
	/**
	 * Position of stack in Stack-Grid
	 */
	position: { x: number, y: number },
	cards?: Set<number>,
}