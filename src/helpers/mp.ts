import { cards } from "./Cards"

export const setDefaultStacks = () => {
	return [
		{
			id: 2,
			stackType: "back",
			
			position: {x: 0, y: 0}
		},
		{
			id: 3,
			stackType: "front",
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