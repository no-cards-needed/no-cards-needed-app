import { Distributor } from "./distributor"

describe('distribute cards to server', () => {
	test("create cards array based on parameters WITHOUT hand cards", () => {
		const cardsPerDeck  = {
			from: 11,
			to: 12
		}
		const jokersPerDeck = 0
		const numberOfDecks = 1
		const onStack = 0
		const distributor = new Distributor(cardsPerDeck, jokersPerDeck, numberOfDecks, onStack)

		expect(distributor.cards).toEqual([
			{
				cardId: 0,
				symbol: "JC",
				onStack: 0,

			},
			{
				cardId: 1,
				symbol: "JD",
				onStack: 0,

			},
			{
				cardId: 2,
				symbol: "JH",
				onStack: 0,

			},
			{
				cardId: 3,
				symbol: "JS",
				onStack: 0,

			},
			{
				cardId: 4,
				symbol: "QC",
				onStack: 0,

			},
			{
				cardId: 5,
				symbol: "QD",
				onStack: 0,

			},
			{
				cardId: 6,
				symbol: "QH",
				onStack: 0,

			},
			{
				cardId: 7,
				symbol: "QS",
				onStack: 0,

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
		const onStack = 0
		const distributor = new Distributor(cardsPerDeck, jokersPerDeck, numberOfDecks, onStack)

		expect(distributor.cards).toEqual([
			{
				cardId: 0,
				symbol: "QC",
				onStack: 0,
			},
			{
				cardId: 1,
				symbol: "QD",
				onStack: 0,
			},
			{
				cardId: 2,
				symbol: "QH",
				onStack: 0,

			},
			{
				cardId: 3,
				symbol: "QS",
				onStack: 0,
			},
			{
				cardId: 4,
				symbol: "Joker",
				onStack: 0,
			},
			{
				cardId: 5,
				symbol: "Joker",
				onStack: 0,
			},
			{
				cardId: 6,
				symbol: "Joker",
				onStack: 0,
			},
			{
				cardId: 7,
				symbol: "Joker",
				onStack: 0,
			},
		])
	})
})

describe("Shuffle Card Array", () => {
	let tableStacks: StackMap = new Map()
	let shuffledStacks: StackMap = new Map()

	beforeAll(() => {
		const distributor = new Distributor({from: 11, to: 12}, 0, 1, 0)
		tableStacks = distributor.stacks
		distributor.shuffleCards()
		shuffledStacks = distributor.stacks
	})
	test("Array should be different than starting arary", () => {
		console.log(shuffledStacks.get(0).cards)
		expect(shuffledStacks.get(0).cards).not.toEqual(new Set([0, 1, 2, 3, 4, 5, 6, 7]))
	})
	test("Array should have the same length", () => {
		expect(shuffledStacks.size).toEqual(tableStacks.size)
	})
	
	test("Array should have the same content", () => {
		expect(shuffledStacks).toContainEqual(tableStacks.get(0))
		expect(shuffledStacks).toContainEqual(tableStacks.get(1))
		expect(shuffledStacks).toContainEqual(tableStacks.get(2))
		expect(shuffledStacks).toContainEqual(tableStacks.get(3))
		expect(shuffledStacks).toContainEqual(tableStacks.get(4))
		expect(shuffledStacks).toContainEqual(tableStacks.get(5))
		expect(shuffledStacks).toContainEqual(tableStacks.get(6))
		expect(shuffledStacks).toContainEqual(tableStacks.get(7))
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
		const onStack = 0
		const handCards = 0
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
		const onStack = 0
		const distributor = new Distributor(cardsPerDeck, jokersPerDeck, numberOfDecks, onStack)

		expect(distributor.stacks.size).toEqual(2)
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
		const onStack = 0
		const handCards = 0
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

		expect(distributor.stacks.size).toEqual(2)
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