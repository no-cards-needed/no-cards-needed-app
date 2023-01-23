import { cards } from "./Cards"

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

export const setDefaultUsedCards = () => {
	const defCards = cards.map((card, index) => {
		return {
			symbol: card.name,
			onStack: 2,
			hasPlayer: null
		}
	})
	return defCards
}