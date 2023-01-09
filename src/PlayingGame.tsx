import { RefObject, useEffect, useRef, useState } from "react";
import './css/App.css';

import Card from "./components/Card";
import { Stack } from "./components/Stack";
import { calculateCardPosition } from "./helpers/calculate-card-position";
import { getDistanceBetweenTwoElements } from "./helpers/get-distance-between-two-elements";
import { handleCardDrag } from "./helpers/handle-card-drag";
import { handleCardDrop } from "./helpers/handle-card-drop";
import GameHeader from "./components/GameHeader";
import {Toaster} from "react-hot-toast";

const DebugComponent = ({error}: {error:any}) => {
	console.log(error)
	return <></>
}

function PlayingGame(
		{
			gameStatus,
			setGameStatus,

			syncedCards, 
			setCard,

			syncedStacks, 
			setStack,
		}: {
			gameStatus: GameStatus,
			setGameStatus: (gameStatus: GameStatus) => void,

			syncedCards: Card[], 
			syncedStacks: Stack[], 
			setCard: (card: Card, cardId: number) => void,
			setStack: (stack: Stack, stackId: number) => void
		}) {

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

	const [ usedStacks, setUsedStacksState ] = useState<Stack[]>(
		[
			{
				id: 0,
				stackType: "hand",
				cards: [],
				position: {x: 0, y: 0},
			},
			{
				id: 1,
				stackType: "hidden",
				cards: [],
				position: {x: 0, y: 0},
			}
		]
	)
	const usedStacksRef = useRef<Stack[]>([
		{
			id: 0,
			stackType: "hand",
			cards: [],
			position: {x: 0, y: 0},
		},
		{
			id: 1,
			stackType: "hidden",
			cards: [],
			position: {x: 0, y: 0},
		}
	])
	const setUsedStacks = (usedStacks: Stack[]) => {
		setUsedStacksState(usedStacks)
		usedStacksRef.current = usedStacks
	}
	useEffect(() => {
		console.log("🐉 [acid tang] Used Stacks updated", usedStacks)
	}, [usedStacks])

	const stackRef = useRef<HTMLDivElement[]>([]);
	const stacksReference = useRef<Stack[]>([])
	stacksReference.current = usedStacks
	// The delta of stackindeces caused by the hand and hidden stack not being synced
	const stackOffset = 2
	
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
	
	const [nearestStack, setNearestStack] = useState(null);
	const [isColliding, setIsColliding] = useState(false);

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

	const resetCardZIndex = (shuffledCards: UsedCard[]) => {
		// Re-Set zIndex of the shuffled cards
		shuffledCards.forEach((card: UsedCard, cardId: number) => {
			const tempUsedCards = usedCards
			tempUsedCards[cardId].zIndex = cardId
			tempUsedCards[cardId].animation = "shuffle"
			setUsedCards(tempUsedCards)
		})
		const timeout = setTimeout(() => {
			shuffledCards.forEach((card: UsedCard, cardId: number) => {
				const tempUsedCards = usedCards
				tempUsedCards[cardId].animation = "none"
				setUsedCards(tempUsedCards)
			})
			clearTimeout(timeout)
		}, 300)
	}

	const setCards = (cardId: number, stackId: number, comingFromSync: boolean = true) => {
		try {
			const stack: Stack = usedStacksRef.current[stackId]
	
			const cardPosition = {
				x: stack.stackType !== "hand" && stack.stackType !== "open" 
						? stackRef.current[stackId].getBoundingClientRect().x 
						: calculateCardPosition(cardRef.current[cardId], stackRef.current[stackId], stack, cardId),
				y: stackRef.current[stackId].getBoundingClientRect().y
			}

			const stackType = usedStacksRef.current[stackId].stackType
			const tempUsedCards = [...usedCardsRef.current]
			const hasShadow = usedStacksRef.current[stackId]?.cards ? usedStacksRef.current[stackId].cards.length - usedStacksRef.current[stackId].cards.indexOf(cardId) <= 10 ? true : false : false
			const stackLength = usedStacksRef.current[stackId].cards ? usedStacksRef.current[stackId].cards.length : 0

			tempUsedCards[cardId] = {
				...tempUsedCards[cardId],
				onStack: stackId,
				controlledPosition: cardPosition,
				zIndex: stackLength,
				onStackType: stackType,
				hasShadow,
			} 
			setUsedCards(tempUsedCards)
			if(!comingFromSync) {
				setCard(
					{
						symbol: usedCards[cardId].symbol,
						onStack: nearestStack.stackIndex,
						hasPlayer: usedCards[cardId].hasPlayer || "none"
					},
					cardId,
				)


				// Filter current card out of the tempUsedStacks
				let tempUsedStacks: Stack[] = [...usedStacksRef.current]
				
				const prevStackId = usedCardsRef.current[cardId].onStack

				// Remove card from previous stack
				tempUsedStacks[prevStackId] = {
					...tempUsedStacks[prevStackId],
					cards: tempUsedStacks[prevStackId].cards ? tempUsedStacks[prevStackId].cards.filter((card: number) => card !== cardId) : []
				}
				setStack(tempUsedStacks[prevStackId], prevStackId-stackOffset)

				// Add card to the new stack
				tempUsedStacks[stackId] = {
					...tempUsedStacks[stackId],
					cards: tempUsedStacks[stackId].cards ? [...tempUsedStacks[stackId].cards, cardId] : [cardId]
				}
				setStack(tempUsedStacks[stackId], stackId-stackOffset)

				setUsedStacks(tempUsedStacks)
			}

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
				tempStacks[stackId + stackOffset] = {
					...syncedStacks[stackId],
				}
			})

			setUsedStacks(tempStacks)
		} 
		
	}, [syncedStacks])

	const updateCards = () => {
			// Update usedCards with syncedCards
			console.log("🐉 [acid tang] Synced Cards", syncedCards)
				
	
			syncedCards.forEach((card: UsedCard, cardId: number) => {
				// Get Stack Type
				try {
					if(!usedStacksRef.current[card.onStack]){
						throw new Error("Stack not found with id: " + card.onStack)
					}
					
					const stackType = usedStacksRef.current[card.onStack].stackType

					// Index of Card in Stack  
					const cardIndex = usedStacksRef.current[card.onStack].cards ? usedStacksRef.current[card.onStack].cards.indexOf(cardId) : 0
					console.log(cardIndex)
					// Set const "hasShadow" to true if the card is in the top 10 cards of the stack
					const hasShadow = usedStacksRef.current[card.onStack].cards ? usedStacksRef.current[card.onStack].cards.length - usedStacksRef.current[card.onStack].cards.indexOf(cardId) <= 10 ? true : false : false
					
					const tempUsedCards = [...usedCardsRef.current];
					tempUsedCards[cardId] = {
						...syncedCards[cardId],
						controlledPosition: card ? card.controlledPosition ? card.controlledPosition : {x: 0, y: 0} : {x: 0, y: 0},
						zIndex: card ? card.zIndex ? card.zIndex : cardIndex : 0,
						animation: card ? card.animation ? card.animation : "none" : "none",
						movedAside: "none",
						onStackType: stackType,
						hasShadow
					}
					setUsedCards(tempUsedCards)
				} catch(e: any) {
					if (e instanceof Error) {
						console.error("🐉 [acid tang] Error updating cards", e, cardId, card)
						console.log(usedStacksRef.current[card.onStack])
					}
				}
			})

			for (let i = 0; i < syncedCards.length; i++) {
				const cardId = i
				const card = syncedCards[i];
				
				setCards(cardId, card.onStack, true)
			}
		}
	useEffect(() => {
		if(syncedCards) {
			if(usedCardsRef.current.length === 0) {
				// Set a timeout to wait for the stacks to be added
				const timeout = setTimeout(() => {
					updateCards()
					clearTimeout(timeout)
				}, 1000)
			} else {
				updateCards()
			}
		}
	}, [syncedCards])
 
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
						}
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
									handleCardDrag={(cardRef, cardId) => handleCardDrag(cardRef, cardId, usedCardsRef.current, setUsedCards, getNearestStack, nearestStack, setNearestStack, usedStacks, setIsColliding)} 
									handleCardDrop={(data, id) => handleCardDrop(id, usedCards, setUsedCards, isColliding, nearestStack, setCards)} />
						}) : <DebugComponent error={usedCards} />
					}
				</div>

                <GameHeader />

                <div className="hand criticalMaxWidth" id="basicDrop">
					<Stack key={"handStack"} stackType={usedStacks[0].stackType} stackRef={(el: HTMLDivElement) => stackRef.current[0] = el}/>
                </div>

				<Stack key={"hiddenStack"} stackType={usedStacks[1].stackType} stackRef={(el: HTMLDivElement) => stackRef.current[1] = el}/>
            </div>
		</div>
	);
}

export default PlayingGame;
