import { Distributor } from "./distributor"

describe('distribute cards to server', () => {
	test("create cards array based on parameters WITHOUT hand cards", () => {
		const cardsPerDeck  = {
			from: 11,
			to: 12
		}
		const jokersPerDeck = 0
		const numberOfDecks = 1
		const onStack = 2
		const distributor = new Distributor(cardsPerDeck, jokersPerDeck, numberOfDecks, onStack)

		expect(distributor.cards).toEqual([
			{
				cardId: 0,
				symbol: "JC",
				onStack: 2,
				hasPlayer: null
			},
			{
				cardId: 1,
				symbol: "JD",
				onStack: 2,
				hasPlayer: null
			},
			{
				cardId: 2,
				symbol: "JH",
				onStack: 2,
				hasPlayer: null
			},
			{
				cardId: 3,
				symbol: "JS",
				onStack: 2,
				hasPlayer: null
			},
			{
				cardId: 4,
				symbol: "QC",
				onStack: 2,
				hasPlayer: null
			},
			{
				cardId: 5,
				symbol: "QD",
				onStack: 2,
				hasPlayer: null
			},
			{
				cardId: 6,
				symbol: "QH",
				onStack: 2,
				hasPlayer: null
			},
			{
				cardId: 7,
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
		const distributor = new Distributor(cardsPerDeck, jokersPerDeck, numberOfDecks, onStack)

		expect(distributor.cards).toEqual([
			{
				cardId: 0,
				symbol: "QC",
				onStack: 2,
				hasPlayer: null
			},
			{
				cardId: 1,
				symbol: "QD",
				onStack: 2,
				hasPlayer: null
			},
			{
				cardId: 2,
				symbol: "QH",
				onStack: 2,
				hasPlayer: null
			},
			{
				cardId: 3,
				symbol: "QS",
				onStack: 2,
				hasPlayer: null
			},
			{
				cardId: 4,
				symbol: "Joker",
				onStack: 2,
				hasPlayer: null
			},
			{
				cardId: 5,
				symbol: "Joker",
				onStack: 2,
				hasPlayer: null
			},
			{
				cardId: 6,
				symbol: "Joker",
				onStack: 2,
				hasPlayer: null
			},
			{
				cardId: 7,
				symbol: "Joker",
				onStack: 2,
				hasPlayer: null
			},
		])
	})
})

describe("Shuffle Card Array", () => {
	const startArray: Card[] = [
		{
			cardId: 0,
			symbol: "JC",
			onStack: 2,
			hasPlayer: null
		},
		{
			cardId: 1,
			symbol: "JD",
			onStack: 2,
			hasPlayer: null
		},
		{
			cardId: 2,
			symbol: "JH",
			onStack: 2,
			hasPlayer: null
		},
		{
			cardId: 3,
			symbol: "JS",
			onStack: 2,
			hasPlayer: null
		},
		{
			cardId: 4,
			symbol: "QC",
			onStack: 2,
			hasPlayer: null
		},
		{
			cardId: 5,
			symbol: "QD",
			onStack: 2,
			hasPlayer: null
		},
		{
			cardId: 6,
			symbol: "QH",
			onStack: 2,
			hasPlayer: null
		},
		{
			cardId: 7,
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
		const distributor = new Distributor({from: 11, to: 12}, 0, 1, 2)
		distributor.shuffleCards()
		shuffledArray = distributor.cards
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

describe("Distribute to Players", () => {
	test("create cards array based on parameters WITH hand cards", () => {
		const cardsPerDeck  = {
			from: 12,
			to: 12
		}
		const jokersPerDeck = 0
		const numberOfDecks = 1
		const onStack = 2
		const handCards = 2
		const players: {[name: string]: Player} = {
			"1": {
				id: "1",
				name: "Player 1",
				avatar: 1
			},
			"2": {
				id: "2",
				name: "Player 2",
				avatar: 2
			},
		}
		const distributor = new Distributor(cardsPerDeck, jokersPerDeck, numberOfDecks, onStack)
		distributor.distributeCards(handCards, players)

		expect(distributor.cards.length).toEqual(4)
		expect(distributor.cards).toEqual(expect.any(Array))
		expect(distributor.cards).toEqual([
			{
				cardId: 0,
				symbol: "QC",
				onStack: 1,
				hasPlayer: "1"
			},
			{
				cardId: 1,
				symbol: "QD",
				onStack: 1,
				hasPlayer: "1"
			},
			{
				cardId: 2,
				symbol: "QH",
				onStack: 1,
				hasPlayer: "2"
			},
			{
				cardId: 3,
				symbol: "QS",
				onStack: 1,
				hasPlayer: "2"
			},
		])

	})
})

describe("Stacks", () => {
	test("Stacks without playercards", () => {
		const cardsPerDeck  = {
			from: 12,
			to: 12
		}
		const jokersPerDeck = 0
		const numberOfDecks = 1
		const onStack = 2
		const distributor = new Distributor(cardsPerDeck, jokersPerDeck, numberOfDecks, onStack)

		expect(distributor.stacks.length).toEqual(2)
		expect(distributor.stacks).toEqual(expect.any(Array))
		expect(distributor.stacks).toEqual([
			{
				id: 2,
				stackType: "back",
				cards: [0, 1, 2, 3],
				position: { x: 0, y: 0 }
			},
			{
				id: 3,
				stackType: "front",
				cards: [],
				position: { x: 0, y: 0 }
			},
		])
	})
	test("Stacks with playercards", () => {
		const cardsPerDeck  = {
			from: 12,
			to: 12
		}
		const jokersPerDeck = 0
		const numberOfDecks = 1
		const onStack = 2
		const handCards = 2
		const players: {[name: string]: Player} = {
			"1": {
				id: "1",
				name: "Player 1",
				avatar: 1
			},
			"2": {
				id: "2",
				name: "Player 2",
				avatar: 2
			},
		}
		const distributor = new Distributor(cardsPerDeck, jokersPerDeck, numberOfDecks, onStack)
		distributor.distributeCards(handCards, players)

		expect(distributor.stacks.length).toEqual(2)
		expect(distributor.stacks).toEqual(expect.any(Array))
		expect(distributor.stacks).toEqual([
			{
				id: 2,
				stackType: "back",
				cards: [],
				position: { x: 0, y: 0 }
			},
			{
				id: 3,
				stackType: "front",
				cards: [],
				position: { x: 0, y: 0 }
			},
		])
	})
})