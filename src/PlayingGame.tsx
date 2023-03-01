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

type PlayingGameProps = {
	gameStatus: GameStatus,
	setGameStatus: (gameStatus: GameStatus) => void,
	userId: string,

	syncedCards: Map<number, Card>,
	setCard: (card: Card, cardId: number, timestamp: number) => void,
	
	syncedTableStacks: Map<number | string, Stack>,
	setTableStack: (stack: Stack, stackId: number | string, timestamp: number) => void

	syncedHandStacks: Map<number | string, Stack>,
	setHandStack: (stack: Stack, stackId: number | string, timestamp: number) => void

	players: ListOfPlayers,
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

		const [usedCards, setUsedCards, usedCardsRef] = useStateRef<Map<number, UsedCard>>(new Map([]))
		const cardsDomRef = useRef<Map<number, HTMLDivElement>>(new Map([]))
		const [handStackState, setHandStackState, handStackRef] = useStateRef<Stack>({id: userId, stackType: "hand", cards: new Set(), position: {x: 0, y: 0}})
		const [hiddenStackState, setHiddenStackState, hiddenStackRef] = useStateRef<Stack>({id: "hidden", stackType: "hidden", cards: new Set(), position: {x: 0, y: 0}})
		const [tableStacks, setTableStacks, tableStacksRef] = useStateRef<Map<number | string, Stack>>(new Map())
		const stacksDomRef = useRef<Map<number | string, HTMLDivElement>>(new Map([]))

		const [nearestStack, setNearestStack] = useState<NearestStack>(null);
		const [isColliding, setIsColliding] = useState<boolean>(false);

		// Function to handle card placement
		const placeCard = (cardId: number, stackId: number | string, userInitiated: boolean = false) => {
			const _usedCards = usedCardsRef.current
			// If card is "owned" by user, place it in the hand stack, otherwise place it in the hidden stack
			const userSpecificStackId = stackId < 2 ? ( _usedCards.get(cardId).hasPlayer === userId || userInitiated ) ? 0 : 1 : stackId
			const _stack = tableStacksRef.current.get(userSpecificStackId)

			// Add card to stack
			if(_stack.cards) {
				_stack.cards.add(cardId)
			} else {
				_stack.cards = new Set([cardId])
			}
			setTableStacks(tableStacksRef.current)

			// Calculate Card position based on stack
			const cardPosition = {
				x: _stack.stackType === "hand" || _stack.stackType === "open"
					? calculateCardPosition(cardsDomRef, stacksDomRef, userSpecificStackId, _stack, cardId)
					: stacksDomRef.current.get(userSpecificStackId).getBoundingClientRect().x, 
				y: stacksDomRef.current.get(userSpecificStackId).getBoundingClientRect().y
			}

			// Calculate shadow of the card
			const hasShadow: boolean = _stack.cards && _stack.cards.size > 0 
											? _stack.cards.size - [..._stack.cards].indexOf(cardId) < 10
											: false

			_usedCards.set(cardId, {
				..._usedCards.get(cardId),
				onStack: userSpecificStackId,
				onStackType: _stack.stackType,
				zIndex: calculateZIndex(userSpecificStackId, _stack, cardId),
				controlledPosition: cardPosition,
				hasShadow
			})
			setUsedCards(_usedCards)
			
			if (userInitiated) {
				sendCard(usedCardsRef.current.get(cardId), cardId)
				sendTableStack(_stack, userSpecificStackId)

				// Remove card from previous stack
				const _stacks = tableStacksRef.current
				_stacks.forEach(stack => {
					if(stack.cards && stack.cards.has(cardId) && stack.id !== userSpecificStackId) {
						stack.cards.delete(cardId)
						sendTableStack(stack, stack.id)
					}	
				})
			}
		}

		const recieveCards = (syncedCards: Map<number, Card>) => {
			firstCardSynced.current = true

			const _usedCards = new Map(usedCardsRef.current)
			syncedCards.forEach(card => {
				if(_usedCards.has(card.cardId)) {
					_usedCards.set(card.cardId, {
						..._usedCards.get(card.cardId),
						...card
					})
				} else {
					_usedCards.set(card.cardId, {
						...card,
						onStack: 0,
						onStackType: "back",
						zIndex: 0,
						animation: "none",
						movedAside: "none",
						controlledPosition: {x: 0, y: 0},
						hasShadow: false
					})
				}
			})
			setUsedCards(_usedCards)

			// Place cards in stacks
			syncedCards.forEach(card => {
				placeCard(card.cardId, card.onStack)
			})
		}
		useEffect(() => {
			if (firstCardSynced.current) {
				recieveCards(syncedCards)
			} else {
				// call recieveCards after 1 second to make sure all cards are rendered
				setTimeout(() => {
					console.log("Timeout triggered")
					recieveCards(syncedCards)
				}, 1000)
			}
		}, [syncedCards])
		const sendCard = (card: Card, cardId: number) => {
			console.log("sendCard", card, cardId, Date.now())
			setCard(card, cardId, Date.now())
		}

		const recieveStacks = (syncedStacks: Map<number | string, Stack>, stackType: "table" | "hand") => {
			if (stackType === "hand") {
				syncedStacks.forEach(stack => {
					if(stack.id === userId) {
						setHandStackState(stack)
					} else {
						const _hiddenStack = hiddenStackRef.current
						_hiddenStack.cards = new Set([..._hiddenStack.cards, ...stack.cards])
						setHiddenStackState(_hiddenStack)
					}
				})
			} else {
				// set _tableStacks as a new Map to trigger useEffect
				const _tableStacks = new Map(tableStacksRef.current)
				syncedStacks.forEach(stack => {
					if(_tableStacks.has(stack.id)) {
						_tableStacks.set(stack.id, {
							..._tableStacks.get(stack.id),
							...stack
						})
					} else {
						_tableStacks.set(stack.id, {
							...stack,
							cards: new Set()
						})
					}
				})
				setTableStacks(_tableStacks)
				console.log("recieveStacks", _tableStacks)
			}
		}
		useEffect(() => {
			recieveStacks(syncedTableStacks, "table")
			recieveStacks(syncedHandStacks, "hand")
		}, [syncedHandStacks, syncedTableStacks])

		const sendHandStack = () => {
			setHandStack(handStackRef.current, userId, Date.now())
		}
		const sendTableStack = (stack: Stack, stackId: number | string) => {
			setTableStack(stack, stackId, Date.now())
		}

	return (
		<div>
			<div style={{background: "#DEDBE5", position: "fixed"}}>
				<div className='backgroundElement'></div>
				<div className="playingArea criticalMaxWidth">
				{
					Array.from(tableStacks).map(([stackId, stack]) => {
						if(stack.stackType !== "hand" && stack.stackType !== "hidden") {
							return (
								<Stack key={stack.id} stackType={stack.stackType} stackRef={(el: HTMLDivElement) => stacksDomRef.current.set(stackId, el)}/>
							)
						} else return null
					})
				}
				</div>

				<div className="cards">
					{
						typeof usedCards[Symbol.iterator] === 'function' ? Array.from(usedCards).map(([cardId, card]) => {
							return <Card 
									setRef={(cardRef: HTMLDivElement) => cardsDomRef.current.set(cardId, cardRef)} 
									card={card} 
									cardId={cardId}
									key={cardId}
									shuffle={() => {}}
									handleLongPress={() => {}}
									handleCardDrag={(cardRef, cardId) => handleCardDrag(cardRef, cardId, usedCardsRef.current, setUsedCards, nearestStack, setNearestStack, tableStacksRef, handStackRef, stacksDomRef, setIsColliding)} 
									handleCardDrop={(data, id) => handleCardDrop(id, usedCards, setUsedCards, isColliding, nearestStack, placeCard)} />
						}) : <DebugComponent error={usedCards} />
					}
				</div>

				<GameHeader players={players} gameStatus={gameStatus} avatars={avatars} />

				<div className="hand criticalMaxWidth" id="basicDrop">
					<Stack key={"handStack"} stackType={handStackState.stackType} stackRef={(el: HTMLDivElement) => stacksDomRef.current.set(userId, el)}/>
				</div>

				<Stack key={"hiddenStack"} stackType={hiddenStackState.stackType} stackRef={(el: HTMLDivElement) => stacksDomRef.current.set("hidden", el)}/>
			</div>
		</div>
	);
}

export default PlayingGame;