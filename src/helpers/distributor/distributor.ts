import { cards as cardsHelper } from "../Cards"

export class Distributor {
	public stacks: StackMap = new Map([
		[0, {
			id: 0,
			stackType: "back",
			cards: new Set([]),
			position: { x: 0, y: 0 }
		}],
		[1, {
			id: 1,
			stackType: "front",
			cards: new Set([]),
			position: { x: 0, y: 0 }
		}]
	]);
	public cards: Card[] = [];
	public handStacks: StackMap = new Map()

	// default stack to place the cards
	private defaultStack = 0

	constructor(
		cardsPerDeck: { from: number, to: number },
		jokersPerDeck: number,
		numberOfDecks: number,
		onStack: number
		) {

		// Adding the deck cards
		let cardId = 0
		for (let index = 0; index < cardsHelper.length; index++) {
			const card = cardsHelper[index];
			if (card.value >= cardsPerDeck.from && card.value <= cardsPerDeck.to) {
				for (let i = 0; i < numberOfDecks; i++) {
					this.cards.push({
						cardId: cardId,
						symbol: card.name,
						onStack: onStack,
					})
					this.addCardToStack(cardId, onStack)

					cardId++
				}
			}
		}

		// Adding the jokers
		for (let index = 0; index < jokersPerDeck; index++) {
			this.cards.push({
				cardId: cardId,
				symbol: "Joker",
				onStack: onStack,
			})
			this.addCardToStack(cardId, onStack)

			cardId++
		}
	}

	public shuffleCards: () => void = () => {
		let temp = this.cards
		let shuffled = temp
			.map(value => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value)

		this.cards = shuffled
	}

	public distributeCards: (handCards: number, players:{[name: string]: Player}) => void = (handCards, players) => {
		const playerIds = Object.keys(players)
		const totalCardAmount = this.cards.length
		const handcardsForPlayers = handCards * playerIds.length
		
		// If there are not enough cards to distribute
		if(totalCardAmount < handcardsForPlayers) {
			throw new Error(`Not enough cards to distribute to players`)
		}
		
		// Distribute the cards
		let playerIndex = 0
		let cardIndex = 1

		for (let index = 0; index < handcardsForPlayers; index++) {
			const card = this.cards[index]
			const player = players[playerIds[playerIndex]]
			
			if(cardIndex >= handCards) {
				cardIndex = 0
				playerIndex++
			}
			card.onStack = player.id
			cardIndex++

			// Filter out the current card from the stacks
			const _stack = this.stacks.get(this.defaultStack)
			_stack.cards.delete(card.cardId)

			// Add card to the players hand stack
			if (!this.handStacks.has(player.id)) {
				this.handStacks.set(player.id, {
					id: player.id,
					stackType: "hand",
					position: {
						x: 0,
						y: 0
					},
					cards: new Set([card.cardId])
				})
			} else {
				const _handStack = this.handStacks.get(player.id)
				_handStack.cards.add(card.cardId)
			}
		}
	}

	private addCardToStack: (cardId: number, stackId: number) => void = (cardId, stackId) => {
		const stack = this.stacks.get(stackId)
		stack.cards.add(cardId)
	}
}