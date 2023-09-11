/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react"
import Card from "./components/Card"
import { DebugComponent } from "./components/Debug"
import GameHeader from "./components/GameHeader"
import { Stack } from "./components/Stack"
import { calculateZIndex, calculateCardPosition } from "./helpers/calculators"
import { handleCardDrag } from "./helpers/handle-card-drag"
import { handleCardDrop } from "./helpers/handle-card-drop"
import useStateRef from "./helpers/hooks/useStateRef"
import { useWindowDimension } from "./helpers/hooks/useWindowDimensions"

type PlayingGameProps = {
	gameStatus: GameStatus
	setGameStatus: (gameStatus: GameStatus) => void
	userId: string

	syncedCards: Map<number, Card>
	setCard: (card: Card, cardId: number, timestamp: number) => void

	syncedTableStacks: Map<number | string, Stack>
	setTableStack: (
		stack: Stack,
		stackId: number | string,
		timestamp: number
	) => void

	syncedHandStacks: Map<number | string, Stack>
	setHandStack: (
		stack: Stack,
		stackId: number | string,
		timestamp: number
	) => void

	players: ListOfPlayers
	avatars: {
		src: string
	}[]
}

function PlayingGame({
	gameStatus,
	setGameStatus,
	userId,

	syncedCards,
	setCard,

	syncedTableStacks,
	setTableStack,

	syncedHandStacks,
	setHandStack,

	players,
	avatars,
}: PlayingGameProps) {
	const firstCardSynced = useRef<boolean>(false)
	const stackSyncDone = useRef<boolean>(false)

	const [usedCards, setUsedCards, usedCardsRef] = useStateRef<
		Map<number, UsedCard>
	>(new Map([]))
	const cardsDomRef = useRef<Map<number, HTMLDivElement>>(new Map([]))
	const [handStackState, setHandStackState, handStackRef] =
		useStateRef<Stack>({
			id: userId,
			stackType: "hand",
			cards: new Set(),
			position: { x: 0, y: 0 },
		})
	const [hiddenStackState, setHiddenStackState, hiddenStackRef] =
		useStateRef<Stack>({
			id: "hidden",
			stackType: "hidden",
			cards: new Set(),
			position: { x: 0, y: 0 },
		})
	const [tableStacks, setTableStacks, tableStacksRef] = useStateRef<
		Map<number | string, Stack>
	>(new Map())
	const stacksDomRef = useRef<Map<number | string, HTMLDivElement>>(
		new Map([])
	)

	const [nearestStack, setNearestStack] = useState<NearestStack>(null)
	const [isColliding, setIsColliding] = useState<boolean>(false)

	// Function to handle card placement
	const placeCard = (
		cardId: number,
		stackId: number | string,
		userInitiated: boolean = false
	) => {
		console.log(
			"Placing card",
			usedCardsRef.current.get(cardId).symbol,
			" with id ",
			cardId,
			"on stack",
			stackId
		)
		const _usedCards = usedCardsRef.current
		// If card is "owned" by user, place it in the hand stack, otherwise place it in the hidden stack

		let _stack: Stack
		if (tableStacksRef.current.has(stackId)) {
			_stack = tableStacksRef.current.get(stackId)
		} else if (stackId === "hidden") {
			_stack = hiddenStackRef.current
		} else {
			_stack = handStackRef.current
		}

		// Calculate Card position based on stack
		let cardPosition: { x: number; y: number } = { x: 0, y: 0 }
		try {
			cardPosition = {
				x:
					_stack.stackType === "hand" || _stack.stackType === "open"
						? calculateCardPosition(
								cardsDomRef,
								stacksDomRef,
								stackId,
								_stack,
								cardId
						  )
						: stacksDomRef.current
								.get(stackId)
								.getBoundingClientRect().x,
				y: stacksDomRef.current.get(stackId).getBoundingClientRect().y,
			}
		} catch (error) {
			console.log(
				"Error calculating card position for stack",
				stackId,
				"and card",
				cardId
			)
			// console.error(error)
		}

		// Calculate shadow of the card
		const hasShadow: boolean =
			_stack.cards && _stack.cards.size > 0
				? _stack.cards.size - [..._stack.cards].indexOf(cardId) < 10
				: false

		_usedCards.set(cardId, {
			..._usedCards.get(cardId),
			onStack: stackId,
			onStackType: _stack.stackType,
			zIndex: calculateZIndex(_stack, cardId),
			controlledPosition: cardPosition,
			hasShadow,
		})
		setUsedCards(_usedCards)

		if (userInitiated) {
			sendCard(usedCardsRef.current.get(cardId), cardId)
			tableStacksRef.current.forEach((stack, stackId) => {
				if (stack.cards.has(cardId)) {
					const _stack = stack
					_stack.cards.delete(cardId)
					sendTableStack(_stack, stackId)
				}
			})
			if (stackId !== userId) {
				// Delete card from all other stacks
				if (handStackRef.current.cards.has(cardId)) {
					const _handStack = handStackRef.current
					_handStack.cards.delete(cardId)
					sendHandStack(_handStack)
				}
				_stack.cards.add(cardId)
				sendTableStack(_stack, stackId)
			} else {
				_stack.cards.add(cardId)
				sendHandStack(_stack)
			}
		}
	}

	const recieveCards = (recievedCards: Map<number, Card>) => {
		if (stackSyncDone.current) {
			const _usedCards = new Map(usedCardsRef.current)
			recievedCards.forEach((card) => {
				// Check if card is on hand or on table
				let onStack
				console.log(
					"ONSTACK: ",
					card.onStack,
					typeof card.onStack,
					"CardId",
					card.cardId
				)
				if (typeof card.onStack === "string") {
					onStack = card.onStack === userId ? userId : "hidden"
					recievedCards.set(card.cardId, {
						...card,
						onStack,
					})
				} else {
					onStack = card.onStack
				}

				if (_usedCards.has(card.cardId)) {
					_usedCards.set(card.cardId, {
						..._usedCards.get(card.cardId),
						onStack,
						...card,
					})
				} else {
					console.log(`Card ${card.cardId} not found in usedCards`)
					_usedCards.set(card.cardId, {
						...card,
						onStackType: "back",
						zIndex: 0,
						animation: "none",
						movedAside: "none",
						controlledPosition: { x: 0, y: 0 },
						hasShadow: false,
					})
				}
			})
			setUsedCards(_usedCards)

			// Place cards in stacks
			recievedCards.forEach((card) => {
				placeCard(card.cardId, card.onStack, false)
			})

			console.log("🪢 Setting StackSyncDone to false")
			stackSyncDone.current = false
		} else {
			// Setting a 10ms timeout to make sure all stacks are synced before placing cards
			setTimeout(() => {
				console.log("Timeout triggered, waiting for stacks to sync")
				recieveStacks(syncedTableStacks, "table")
				recieveCards(syncedCards)
			}, 10)
		}
	}
	useEffect(() => {
		if (firstCardSynced.current) {
			setTimeout(() => {
				recieveCards(syncedCards)
			}, 10)
		} else {
			setTimeout(() => {
				recieveCards(syncedCards)
				firstCardSynced.current = true
			}, 100)
		}
	}, [syncedCards])
	const sendCard = (card: Card, cardId: number) => {
		console.log("sendCard", card, cardId, Date.now())
		setCard(card, cardId, Date.now())
	}

	const recieveStacks = (
		syncedStacks: Map<number | string, Stack>,
		stackType: "table" | "hand"
	) => {
		if (stackType === "hand") {
			syncedStacks.forEach((stack) => {
				if (stack.id === userId) {
					setHandStackState(stack)
				} else {
					const _hiddenStack = hiddenStackRef.current
					_hiddenStack.cards = new Set([
						..._hiddenStack.cards,
						...stack.cards,
					])
					setHiddenStackState(_hiddenStack)
				}
			})
		} else {
			// set _tableStacks as a new Map to trigger useEffect
			const _tableStacks = new Map(tableStacksRef.current)
			syncedStacks.forEach((stack) => {
				if (_tableStacks.has(stack.id)) {
					_tableStacks.set(stack.id, {
						..._tableStacks.get(stack.id),
						...stack,
					})
				} else {
					_tableStacks.set(stack.id, {
						...stack,
						cards: new Set(),
					})
				}
			})
			setTableStacks(_tableStacks)
			console.log("recieveStacks", _tableStacks)
		}
		console.log("🪢 Setting StackSyncDone to true")
		stackSyncDone.current = true
	}
	useEffect(() => {
		recieveStacks(syncedTableStacks, "table")
		recieveStacks(syncedHandStacks, "hand")
	}, [syncedHandStacks, syncedTableStacks])

	const sendHandStack = (handStack: Stack) => {
		setHandStack(handStack, userId, Date.now())
	}
	const sendTableStack = (stack: Stack, stackId: number | string) => {
		setTableStack(stack, stackId, Date.now())
	}

	const [windowHeight, windowWidth] = useWindowDimension()
	useEffect(() => {
		usedCardsRef.current.forEach((card, cardId) => {
			placeCard(cardId, card.onStack, false)
		})
	}, [windowHeight, windowWidth])

	return (
		<div>
			<div style={{ background: "#DEDBE5", position: "fixed" }}>
				<div className="backgroundElement"></div>
				<div className="playingArea criticalMaxWidth">
					<div className="stackArea">
						{Array.from(tableStacks).map(([stackId, stack]) => {
							if (
								stack.stackType !== "hand" &&
								stack.stackType !== "hidden"
							) {
								return (
									<Stack
										key={stackId}
										stackType={stack.stackType}
										stackRef={(el: HTMLDivElement) =>
											stacksDomRef.current.set(
												stackId,
												el
											)
										}
									/>
								)
							} else return null
						})}
						{/* <Stack key={9} stackType={"front"} stackRef={(el: HTMLDivElement) => stacksDomRef.current.set(9, el)}/> */}
					</div>
				</div>

				<div className="cards">
					{typeof usedCards[Symbol.iterator] === "function" ? (
						Array.from(usedCards).map(([cardId, card]) => {
							return (
								<Card
									setRef={(cardRef: HTMLDivElement) =>
										cardsDomRef.current.set(cardId, cardRef)
									}
									card={card}
									cardId={cardId}
									key={cardId}
									shuffle={() => {}}
									handleLongPress={() => {}}
									handleCardDrag={(cardRef, cardId) =>
										handleCardDrag(
											cardRef,
											cardId,
											usedCardsRef.current,
											setUsedCards,
											nearestStack,
											setNearestStack,
											tableStacksRef,
											handStackRef,
											stacksDomRef,
											setIsColliding
										)
									}
									handleCardDrop={(data, id) =>
										handleCardDrop(
											id,
											usedCards,
											setUsedCards,
											isColliding,
											nearestStack,
											placeCard
										)
									}
								/>
							)
						})
					) : (
						<DebugComponent error={usedCards} />
					)}
				</div>

				<GameHeader
					players={players}
					gameStatus={gameStatus}
					avatars={avatars}
				/>

				<div className="hand criticalMaxWidth" id="basicDrop">
					<Stack
						key={"handStack"}
						stackType={handStackState.stackType}
						stackRef={(el: HTMLDivElement) =>
							stacksDomRef.current.set(userId, el)
						}
					/>
				</div>

				<Stack
					key={"hiddenStack"}
					stackType={hiddenStackState.stackType}
					stackRef={(el: HTMLDivElement) =>
						stacksDomRef.current.set("hidden", el)
					}
				/>
			</div>
		</div>
	)
}

export default PlayingGame
