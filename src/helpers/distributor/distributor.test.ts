import { distributeCards, shuffleCards } from "./distributor"

describe('distribute cards to server', () => {
	test("create cards array based on parameters", () => {
		const cardsPerDeck  = {
			from: 11,
			to: 12
		}
		const jokersPerDeck = 0
		const numberOfDecks = 1
		const onStack = 2
		const cardArray = distributeCards(cardsPerDeck, jokersPerDeck, numberOfDecks, onStack)

		expect(cardArray).toEqual([
			{
				symbol: "JC",
				onStack: 2,
				hasPlayer: null
			},
			{
				symbol: "JD",
				onStack: 2,
				hasPlayer: null
			},
			{
				symbol: "JH",
				onStack: 2,
				hasPlayer: null
			},
			{
				symbol: "JS",
				onStack: 2,
				hasPlayer: null
			},
			{
				symbol: "QC",
				onStack: 2,
				hasPlayer: null
			},
			{
				symbol: "QD",
				onStack: 2,
				hasPlayer: null
			},
			{
				symbol: "QH",
				onStack: 2,
				hasPlayer: null
			},
			{
				symbol: "QS",
				onStack: 2,
				hasPlayer: null
			},
		])
	})

	test("4 jokers per deck", () => {
		const cardsPerDeck  = {
			from: 12,
			to: 12
		}
		const jokersPerDeck = 4
		const numberOfDecks = 1
		const onStack = 2
		const cardArray = distributeCards(cardsPerDeck, jokersPerDeck, numberOfDecks, onStack)

		expect(cardArray).toEqual([
			{
				symbol: "QC",
				onStack: 2,
				hasPlayer: null
			},
			{
				symbol: "QD",
				onStack: 2,
				hasPlayer: null
			},
			{
				symbol: "QH",
				onStack: 2,
				hasPlayer: null
			},
			{
				symbol: "QS",
				onStack: 2,
				hasPlayer: null
			},
			{
				symbol: "Joker",
				onStack: 2,
				hasPlayer: null
			},
			{
				symbol: "Joker",
				onStack: 2,
				hasPlayer: null
			},
			{
				symbol: "Joker",
				onStack: 2,
				hasPlayer: null
			},
			{
				symbol: "Joker",
				onStack: 2,
				hasPlayer: null
			},
		])
	})
})

describe("Shuffle Card Array", () => {
	const startArray: {
		symbol: string,
		onStack: number,
		hasPlayer: null | string
		}[] = [
		{
			symbol: "JC",
			onStack: 2,
			hasPlayer: null
		},
		{
			symbol: "JD",
			onStack: 2,
			hasPlayer: null
		},
		{
			symbol: "JH",
			onStack: 2,
			hasPlayer: null
		},
		{
			symbol: "JS",
			onStack: 2,
			hasPlayer: null
		},
		{
			symbol: "QC",
			onStack: 2,
			hasPlayer: null
		},
		{
			symbol: "QD",
			onStack: 2,
			hasPlayer: null
		},
		{
			symbol: "QH",
			onStack: 2,
			hasPlayer: null
		},
		{
			symbol: "QS",
			onStack: 2,
			hasPlayer: null
		},
	]
	let shuffledArray: {
		symbol: string,
		onStack: number,
		hasPlayer: null | string
		}[] = []
	beforeAll(() => {
		shuffledArray = shuffleCards(startArray)
	})
	test("Array should be different than starting arary", () => {
		expect(shuffledArray).not.toEqual(startArray)
	})
	test("Array should have the same length", () => {
		expect(shuffledArray.length).toEqual(startArray.length)
	})
	
	test("Array should have the same content", () => {
		expect(shuffledArray).toContainEqual(startArray[0])
		expect(shuffledArray).toContainEqual(startArray[1])
		expect(shuffledArray).toContainEqual(startArray[2])
		expect(shuffledArray).toContainEqual(startArray[3])
		expect(shuffledArray).toContainEqual(startArray[4])
		expect(shuffledArray).toContainEqual(startArray[5])
		expect(shuffledArray).toContainEqual(startArray[6])
		expect(shuffledArray).toContainEqual(startArray[7])
	})
})