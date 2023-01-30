import { RefObject, useEffect, useRef, useState } from "react";
import './css/App.css';

import Card from "./components/Card";
import { Stack } from "./components/Stack";
import { calculateCardPosition } from "./helpers/calculate-card-position";
import { getDistanceBetweenTwoElements } from "./helpers/get-distance-between-two-elements";
import { handleCardDrag } from "./helpers/handle-card-drag";
import { handleCardDrop } from "./helpers/handle-card-drop";
import GameHeader from "./components/GameHeader";
import { Toaster } from "react-hot-toast";
import { useWindowDimension } from "./helpers/hooks/useWindowDimensions";

const DebugComponent = ({error}: {error:any}) => {
	console.log(error)
	return <></>
}

type PlayingGameProps = {
	gameStatus: GameStatus,
	setGameStatus: (gameStatus: GameStatus) => void,
	userId: string,

	syncedCards: Card[], 
	setCard: (card: Card, cardId: number, timestamp: number) => void,
	
	syncedStacks: Stack[], 
	setStack: (stack: Stack, stackId: number, timestamp: number) => void
	players: {
		[id: string]: {
			name: string,
			id: string,
			avatar: 1 | 2 | 3 | 4 | 5
		}
	},
	avatars: {
		src: string
	}[]
}

function PlayingGame(
		{
			gameStatus,
			setGameStatus,
			userId,

			syncedCards, 
			setCard,

			syncedStacks, 
			setStack,

			players,
			avatars,
		}: PlayingGameProps) {


	// const [ lashTextTricks, setLashTextTricks ] = useState( 'Show Tricks' )
	// const [ lashTextRemoved, setLashTextRemoved ] = useState( 'Show Removed Cards' )
	// const [ activeTricks, setActiveTricks ] = useState( false )
	// const [ activeRemoved, setActiveRemoved ] = useState( false )

	// function toggleDisplayTricks() {
	// 	if (activeTricks) {   
	// 		setActiveTricks(false) 
	// 		setLashTextTricks('Show Tricks')
	// 	} else { 
	// 	setActiveTricks(true) 
	// 	setLashTextTricks('Hide Tricks')

	// 	setActiveRemoved(false) 
	// 	setLashTextRemoved('Show Removed Cards')
	// 	}
	// } 

	// function toggleDisplayRemoved() {
	// 	if (activeRemoved) {   
	// 		setActiveRemoved(false) 
	// 		setLashTextRemoved('Show Removed Cards')
	// 	} else { 
	// 		setActiveRemoved(true) 
	// 		setLashTextRemoved('Hide Removed Cards')

	// 		setActiveTricks(false) 
	// 		setLashTextTricks('Show Tricks')
	// 	}
	// } 

	// #########################################################
	// CARDS, USED CARDS AND ALL OF THE OTHER CARD RELATED STUFF
	// #########################################################

	const cardRef = useRef<HTMLDivElement[]>([]);
	const [usedCards, setUsedCardsState] = useState<UsedCard[]>([])
	const usedCardsRef = useRef<UsedCard[]>([])
	const setUsedCards = (usedCards: UsedCard[]) => {
		setUsedCardsState(usedCards)
		usedCardsRef.current = usedCards
	}
	useEffect(() => {
		console.log("🐉 [acid tang] Used Cards updated", usedCards)
	}, [usedCards])


	// #########################################################
	// ######################## STACKS #########################
	// #########################################################

	const [ usedStacks, setUsedStacksState ] = useState<Stack[]>(
		[
			{
				id: 0,
				stackType: "hand",
				position: {x: 0, y: 0},
			},
			{
				id: 1,
				stackType: "hidden",
				position: {x: 0, y: 0},
			}
		]
	)
	const usedStacksRef = useRef<Stack[]>(usedStacks)
	const setUsedStacks = (usedStacks: Stack[]) => {
		setUsedStacksState(usedStacks)
		usedStacksRef.current = usedStacks
	}
	useEffect(() => {
		console.log("🐉 [acid tang] Used Stacks updated", usedStacks)
	}, [usedStacks])

	const controlledStacks = useRef<ControlledStacks>({})
	const [cardMoveAuthor, setCardMoveAuthor] = useState<"CLIENT" | "SYNC">("SYNC")
	const latestClientTimestamp = useRef<number>(Date.now())
	const prevHandCards = useRef<number>(0)
	useEffect(() => {
		const syncStacks = (card: UsedCard) => {
			// synchronizing new controlled stacks
			// This is potentially a very expensive operation bandwidth wise
			// as this gets called 3 times on every card drop due to syncing
			if (cardMoveAuthor === "CLIENT" && card.onStack > 1) { // Check of the move is authered by the client and if the card is on a stack which is not client only
				console.log("yup, really setting it")
				setStack({
					id: card.onStack,
					position: usedStacksRef.current[card.onStack].position || {x: 0, y: 0},
					stackType: usedStacksRef.current[card.onStack].stackType,
					cards: tempControlledStacks[card.onStack]
				}, 
				(card.onStack - stackOffset),
				latestClientTimestamp.current)
			}
		}

		const tempControlledStacks: ControlledStacks = controlledStacks.current || {}
		for (let cardId = 0; cardId < usedCards.length; cardId++) {
			const card = usedCards[cardId];
			
			// Check if card is on stack other that card.onStack
			for (let stackIndex = 0; stackIndex < Object.keys(tempControlledStacks).length; stackIndex++) {
				const [stackIdString, stack] = Object.entries(tempControlledStacks)[stackIndex];
				const stackId = parseInt(stackIdString)
				if (stackId !== card.onStack) {
					if (stack.includes(cardId)) {
						// Remove cardId from controlledStacks
						tempControlledStacks[stackId] = stack.filter((stackCardId) => stackCardId !== cardId)
					}
				}
			}

			// Add cardId to tempControlledStacks if the card isnt already in it
			if (tempControlledStacks[card.onStack] && !tempControlledStacks[card.onStack].includes(cardId)) {
				tempControlledStacks[card.onStack] = [...tempControlledStacks[card.onStack], cardId]

				syncStacks(card)
			} else if(!tempControlledStacks[card.onStack]) {
				tempControlledStacks[card.onStack] = [cardId]

				syncStacks(card)
			}

			// Update the position of the cards in open type stacks
			const currentStackType = usedStacksRef.current[card.onStack].stackType
			if (currentStackType === "open" || currentStackType === "hand") {
				console.log("✋ Hand needs to be updated")
				console.log("✋ tempControlledStacks[card.onStack]", tempControlledStacks[card.onStack])
				console.log("✋ controlledStacks.current[card.onStack]", controlledStacks.current[card.onStack])
				// If that stack has a different length then the old card state, update all the cards in it
				if (tempControlledStacks[card.onStack].length !== controlledStacks.current[card.onStack]?.length) {
					setCards(cardId, card.onStack, true)
				}
			}
		}
		controlledStacks.current = tempControlledStacks
	}, [usedCards])


	const stackRef = useRef<HTMLDivElement[]>([]);
	const stacksReference = useRef<Stack[]>([])
	stacksReference.current = usedStacks
	// The delta of stackindeces caused by the hand and hidden stack not being synced
	const stackOffset = 2


	const [nearestStack, setNearestStack] = useState(null);
	const [isColliding, setIsColliding] = useState(false);


	//TODO: Only check distances on drop
	const getNearestStack: (cardRef: RefObject<HTMLDivElement>) => NearestStack = (cardRef: RefObject<HTMLDivElement>) => {
		const distances = usedStacksRef.current.map((stack: Stack, stackId: number) => {
			if (stackRef.current[stackId]) {
				return getDistanceBetweenTwoElements(stackRef.current[stackId], cardRef.current)
			} else {
				return 99999
			}
		});
		const nearestStack = stackRef.current[distances.indexOf(Math.min(...distances))];

		return {nearestStack, distanceToCard: Math.min(...distances), stackIndex: distances.indexOf(Math.min(...distances))};
	}

	// Setting Card Ref in usedCards State
	const setCardRef = (cardId: number, ref: HTMLDivElement) => {
		console.log("Setting Card Ref")
		cardRef.current[cardId] = ref;
	}

	const redrawCardZIndexes = () => {
		// Redraw Card ZIndexes
		const tempUsedCards = usedCardsRef.current
		usedCardsRef.current.forEach((card: UsedCard, cardId: number) => {
			const index = controlledStacks.current[card.onStack].indexOf(cardId)
			// Get zIndex from controlledStacks
			tempUsedCards[cardId].zIndex = index === -1 
				? cardId 
				: index || 0
		})
		setUsedCards(tempUsedCards)
	}

	const setCards = (cardId: number, stackId: number, comingFromSync: boolean = true) => {
		console.log("coming from sync: ",comingFromSync)
		if (!comingFromSync) setCardMoveAuthor("CLIENT")
		try {
			const tempUsedCards = [...usedCardsRef.current]
			const calculatedStackId = stackId <= 1 
				? tempUsedCards[cardId].hasPlayer === userId || !comingFromSync ? 0 : 1
				: stackId

			const stack: Stack = usedStacksRef.current[calculatedStackId]
	
			const cardPosition = {
				x: stack.stackType !== "hand" && stack.stackType !== "open" 
						? stackRef.current[calculatedStackId].getBoundingClientRect().x 
						: calculateCardPosition(cardRef, stackRef, calculatedStackId, controlledStacks, cardId),
				y: stackRef.current[calculatedStackId].getBoundingClientRect().y
			}

			const stackType = usedStacksRef.current[calculatedStackId].stackType
			const hasShadow = controlledStacks.current[calculatedStackId] 
								? Object.values(controlledStacks.current[calculatedStackId]).length - Object.values(controlledStacks.current[calculatedStackId]).indexOf(cardId) 
								<= 10 
									? true 
									: false 
								: false

			tempUsedCards[cardId] = {
				...tempUsedCards[cardId],
				onStack: calculatedStackId,
				controlledPosition: cardPosition,
				zIndex: calculateZIndex(calculatedStackId, cardId),
				onStackType: stackType,
				hasShadow,
			} 
			if(!comingFromSync) {
				setCardMoveAuthor("CLIENT")
				latestClientTimestamp.current = Date.now()
				setCard(
					{
						symbol: usedCards[cardId].symbol,
						cardId: cardId,
						onStack: nearestStack.stackIndex === 0 ? 1 : nearestStack.stackIndex,
						hasPlayer: stackId === 0 || stackId === 1 ? userId : "none",
					},
					cardId,
					latestClientTimestamp.current
				)
			}
			setUsedCards(tempUsedCards)
		}
		catch (e) {
			console.error("🐉 [acid tang] error setting cards", e, cardId, stackId)
		}
	}

	useEffect(() => {
		if(syncedStacks) {
			// Update usedStacks with syncedStacks
			console.log("🐉 [acid tang] Synced Stacks", syncedStacks)
			const tempStacks = [...usedStacksRef.current];

			syncedStacks.forEach((stack: Stack, stackId: number) => {
				// Adding "2" to the stackId to avoid overwriting the first two stacks
				// (Hand and Hidden stack)

				// Get synced Stack by property id
				const filteredSyncedStack = syncedStacks.filter((syncedStack: Stack) => stack.id === syncedStack.id) 

				const unhandledSyncedStack: Stack = {cards: [], ...filteredSyncedStack[0]}
			
				const { cards, ...syncedStack } = unhandledSyncedStack
				tempStacks[stack.id] = {
					...syncedStack,
					// ...syncedStacks[stackId],
				}
				controlledStacks.current[stack.id] = cards
			})
			console.log("🚨⚠️🚨⚠️🚨⚠️🚨⚠️🚨⚠️🚨⚠️🚨⚠️ Setting used Cards", tempStacks)
			setUsedStacks(tempStacks)
			redrawCardZIndexes()
		}
	}, [syncedStacks])

	const calculateZIndex = (stackId: number, cardId: number) => {
		const indexOfCard = controlledStacks.current[stackId]  ? Object.values(controlledStacks.current[stackId]).indexOf(cardId) : 0
		const cardIndex = indexOfCard === -1
								? cardId
								: indexOfCard

		return cardIndex
	}	

	const updateCards = () => {
		// Update usedCards with syncedCards
		console.log("🐉 [acid tang] Synced Cards", syncedCards)
		
		for (let cardId = 0; cardId < syncedCards.length; cardId++) {
			const card = syncedCards[cardId];			
			// Get Stack Type
			try {
				if(!usedStacksRef.current[card.onStack]){
					console.error("Stack not found with id: " + card.onStack)
					console.log("syncedStacks", syncedStacks)
					break;
				}
				
				const stackType = usedStacksRef.current[card.onStack].stackType

				// Set const "hasShadow" to true if the card is in the top 10 cards of the stack
				const hasShadow = controlledStacks.current[card.onStack] 
									? Object.values(controlledStacks.current[card.onStack]).length - Object.values(controlledStacks.current[card.onStack]).indexOf(cardId) 
									<= 10 
										? true 
										: false 
									: false
				
				const tempUsedCards = [...usedCardsRef.current];
				tempUsedCards[cardId] = {
					...syncedCards[cardId],
					controlledPosition: {x: 0, y: 0},
					zIndex: calculateZIndex(card.onStack, cardId) || 0,
					animation: "none",
					movedAside: "none",
					onStackType: stackType,
					hasShadow,
				}
				setUsedCards(tempUsedCards)
				setCards(cardId, card.onStack, true)
			} catch(e: any) {
				if (e instanceof Error) {
					console.error("🐉 [acid tang] Error updating cards", e, cardId, card)
					console.log(usedStacksRef.current[card.onStack])
				}
			}
		}
	}
	useEffect(() => {
		if(syncedCards) {
			setCardMoveAuthor("SYNC")
			if(usedCardsRef.current.length === 0) {
				// Set a timeout to wait for the stacks to be added
				const timeout = setTimeout(() => {
					updateCards()
					redrawCardZIndexes()
					clearTimeout(timeout)
				}, 10)
			} else {
				updateCards()
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [syncedCards])
 
	const [windowHeight, windowWidth] = useWindowDimension()
	useEffect(() => {
		for (let i = 0; i < usedCardsRef.current.length; i++) {
			const element = usedCardsRef.current[i];
			setCards(i, element.onStack, true)
		}
	}, [windowHeight, windowWidth])

	useEffect(() => {
		const timeout = setTimeout(() => {
			for (let i = 0; i < usedCardsRef.current.length; i++) {
				const element = usedCardsRef.current[i];
				setCards(i, element.onStack, true)
			}

			clearTimeout(timeout)
		}, 100)
		return () => clearTimeout(timeout)
	}, [])

	return (
		<div>
			<div style={{background: "#DEDBE5", position: "fixed"}}>
				<div><Toaster /></div>
                <div className='backgroundElement'></div>
                <div className="playingArea criticalMaxWidth">
				{
					usedStacks.map((stack: Stack, stackId: number) => {
						if(stack.stackType !== "hand" && stack.stackType !== "hidden") {
							return (
								<Stack key={stack.id} stackType={stack.stackType} stackRef={(el: HTMLDivElement) => stackRef.current[stackId] = el}/>
							)
						} else return null
					})
				}
                </div>

				<div className="cards">
					{
						typeof usedCards[Symbol.iterator] === 'function' ? usedCards?.map((card: UsedCard, cardId: number) => {
							return <Card 
									setRef={setCardRef} 
									card={card} 
									cardId={cardId}
									key={cardId}
									shuffle={() => {}}
									handleLongPress={() => {}}
									handleCardDrag={(cardRef, cardId) => handleCardDrag(cardRef, cardId, usedCardsRef.current, setUsedCards, getNearestStack, nearestStack, setNearestStack, usedStacks, controlledStacks, setIsColliding)} 
									handleCardDrop={(data, id) => handleCardDrop(id, usedCards, setUsedCards, isColliding, nearestStack, setCards)} />
						}) : <DebugComponent error={usedCards} />
					}
				</div>

                <GameHeader players={players} gameStatus={gameStatus} avatars={avatars}/>

                <div className="hand criticalMaxWidth" id="basicDrop">
					<Stack key={"handStack"} stackType={usedStacks[0].stackType} stackRef={(el: HTMLDivElement) => stackRef.current[0] = el}/>
                </div>

				<Stack key={"hiddenStack"} stackType={usedStacks[1].stackType} stackRef={(el: HTMLDivElement) => stackRef.current[1] = el}/>
            </div>
		</div>
	);
}

export default PlayingGame;
