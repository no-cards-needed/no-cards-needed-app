import { cards } from "../Cards"

export class Stacks {
	private stacks: Map<string, Stack> = new Map<string, Stack>();
	private stackNames: string[] = [];

	public addStack(stack: Stack): void {

	}

	public getStack(stackName: string): Stack {
		return this.stacks.get(stackName);
	}

	public getStackNames(): string[] {
		return this.stackNames;
	}
}

export const setDefaultStacks = () => {
	return [
		{
			id: 2,
			stackType: "back",
			cards: [
				0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
			],
			position: {x: 0, y: 0}
		},
		{
			id: 3,
			stackType: "front",
			cards: {},
			position: {x: 0, y: 0}
		},
	]
}

export const distributeCards = (cardsPerDeck: {from: number, to: number}, jokersPerDeck: number, numberOfDecks: number, onStack: number) => {
	const cardArray: Card[] = []
	// Adding the deck cards
	for (let index = 0; index < cards.length; index++) {
		const card = cards[index];
		if (card.value >= cardsPerDeck.from && card.value <= cardsPerDeck.to) {
			for (let i = 0; i < numberOfDecks; i++) {
				cardArray.push({
					symbol: card.name,
					onStack: onStack,
					hasPlayer: null
				})
			}
		}
	}

	// Adding the jokers
	for (let index = 0; index < jokersPerDeck; index++) {
		cardArray.push({
			symbol: "Joker",
			onStack: onStack,
			hasPlayer: null
		})
	}

	return cardArray
}

export const shuffleCards: (cards: Card[]) => Card[] = (cards: Card[]) => {
	const tempArray: Card[] = []
	
	for (let i = cards.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = cards[i];
		tempArray[i] = cards[j];
		tempArray[j] = temp;
	}
	
	return tempArray
}