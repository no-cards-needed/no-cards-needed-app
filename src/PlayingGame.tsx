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

	const [ usedStacks, setUsedStacks ] = useState<Stack[]>(
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
	useEffect(() => {
		console.log("🐉 [acid tang] Used Stacks updated", usedStacks)
	}, [usedStacks])

	const stackRef = useRef<HTMLDivElement[]>([]);
	const stacksReference = useRef<Stack[]>([])
	stacksReference.current = usedStacks
	
	const cardRef = useRef<HTMLDivElement[]>([]);
	const [usedCards, setUsedCards] = useState<UsedCard[]>([])
	useEffect(() => {
		console.log("🐉 [acid tang] Used Cards updated", usedCards)
	}, [usedCards])

	const usedCardsReference = useRef({})
	usedCardsReference.current = usedCards
	
	const [nearestStack, setNearestStack] = useState(null);
	const stackDistances = useRef({})
	const [isColliding, setIsColliding] = useState(false);
	const [currentlyMovingStack, setCurrentlyMovingStack] = useState(false);

	const getNearestStack: (cardRef: RefObject<HTMLDivElement>) => NearestStack = (cardRef: RefObject<HTMLDivElement>) => {
		const distances = usedStacks.map((stack: Stack, stackId: number) => {
			if (stackRef.current[stackId]) {
				return getDistanceBetweenTwoElements(stackRef.current[stackId], cardRef.current)
			} else {
				return 99999
			}
		});
		const nearestStack = stackRef.current[distances.indexOf(Math.min(...distances))];

		return {nearestStack, distanceToCard: Math.min(...distances), stackIndex: distances.indexOf(Math.min(...distances))};
	}

	const updateCardPosition = (cardId: number, {x, y}: {x: number, y: number}) => {

		// Find card by cardId in usedCards and update the controlled Position
		const tempUsedCards = usedCards
		tempUsedCards[cardId].controlledPosition = {x, y}

		setUsedCards(tempUsedCards)
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

	const setCards = (cardId: number, stackId: number) => {
		try {
			console.log(stackId, usedStacks)
			const stack: {
				stackType: string;
				cards: number[];
				position: {
					x: number;
					y: number;
				};
			} = stacksReference.current[stackId]
	
			const cardPosition = {
				x: stack.stackType !== "hand" && stack.stackType !== "open" 
						? stackRef.current[stackId].getBoundingClientRect().x 
						: calculateCardPosition(cardRef.current[cardId], stackRef.current[stackId], stack, cardId),
				y: stackRef.current[stackId].getBoundingClientRect().y
			}

			const tempUsedCards = [...usedCards]
			const stackType = usedStacks[stackId].stackType
			tempUsedCards[cardId] = {
				...tempUsedCards[cardId],
				onStack: stackId,
				controlledPosition: cardPosition,
				zIndex: usedStacks[stackId].cards ? usedStacks[stackId].cards.length : 0,
				onStackType: stackType,
			} 
			setUsedCards(tempUsedCards)

			// Filter current card out of the tempUsedStacks
			let tempUsedStacks: Stack[] = []
			usedStacks.forEach((stack: Stack, stackId: number) => {
				tempUsedStacks[stackId] = {
					...usedStacks[stackId],
					cards: usedStacks[stackId].cards ? usedStacks[stackId].cards.filter((card) => card !== cardId) : []
				}
			})
			setUsedStacks(tempUsedStacks)
		}
		catch (e) {
			console.error("🐉 [acid tang] error setting cards", e, cardId, stackId)
		}
	}

	useEffect(() => {
		if(syncedStacks) {
			// Update usedStacks with syncedStacks
			console.log("🐉 [acid tang] Synced Stacks", syncedStacks)
			const tempStacks = [...usedStacks];

			syncedStacks.forEach((stack: Stack, stackId: number) => {
				// Adding "2" to the stackId to avoid overwriting the first two stacks
				// (Hand and Hidden stack)
				tempStacks[stackId + 2] = {
					...syncedStacks[stackId],
				}
			})

			setUsedStacks(tempStacks)
		} 
		
	}, [syncedStacks])

	const updateCards = () => {
			// Update usedCards with syncedCards
			console.log("🐉 [acid tang] Synced Cards", syncedCards)
				
			const tempUsedCards = [...usedCards];
	
			syncedCards.forEach((card: Card, cardId: number) => {
				// Get Stack Type
				try {
					if(!usedStacks[card.onStack]){
						throw new Error("Stack not found with id: " + card.onStack)
					}
					
					// const stackType = usedStacks[card.onStack].stackType
					const stackType: Stack["stackType"] = "back"

					tempUsedCards[cardId] = {
						...syncedCards[cardId],
						controlledPosition: usedCards[cardId] ? usedCards[cardId].controlledPosition : {x: 0, y: 0},
						zIndex: usedCards[cardId] ? usedCards[cardId].zIndex : 0,
						animation: usedCards[cardId] ? usedCards[cardId].animation : "none",
						movedAside: "none",
						onStackType: stackType,
					}
					
	
				} catch(e: any) {
					if (e instanceof Error) {
						console.error("🐉 [acid tang] Error updating cards", e, cardId, card)
						console.log(usedStacks[card.onStack])
					}
				}
			})
			setUsedCards(tempUsedCards)

			for (let i = 0; i < syncedCards.length; i++) {
				const cardId = i
				const card = syncedCards[i];
				
				setCards(cardId, card.onStack)
			}
		}
	useEffect(() => {

		if(syncedCards) {
			console.log("USED CARDS:",usedCards)
			if(usedCards.length === 0) {
				// Set a timeout to wait for the stacks to be added
				const timeout = setTimeout(() => {
					updateCards()
					clearTimeout(timeout)
				}, 5000)
			} else {
				updateCards()
			}
		}
	}, [syncedCards])

	const cardDimensions = {width: 80, height: 112}
 
	return (
		<div>
			<div style={{background: "#DEDBE5", position: "fixed"}}>
				<div><Toaster /></div>
                <div className='backgroundElement'></div>
                <div className="playingArea criticalMaxWidth">
				{
					usedStacks.map((stack: Stack, stackId: number) => {
						console.log(`${stack.id}-${stack.stackType}`)
						if(stack.stackType !== "hand" && stack.stackType !== "hidden") {
							return (
								<Stack key={`${stack.id}-${stack.stackType}`} stackType={stack.stackType} stackRef={(el: HTMLDivElement) => stackRef.current[stackId] = el}/>
							)
						}
						return null
					})
				}
                </div>

				<div className="cards">
					{
						usedCards.map((card: UsedCard, cardId: number) => {
							return <Card 
									setRef={setCardRef} 
									card={card} 
									cardId={cardId}
									key={cardId}
									shuffle={() => {}}
									handleLongPress={() => {}}
									handleCardDrag={(cardRef, cardId) => handleCardDrag(cardRef, cardId, usedCards, setUsedCards, getNearestStack, nearestStack, setNearestStack, usedStacks, setIsColliding)} 
									handleCardDrop={(data, id) => handleCardDrop(id, usedCards, setUsedCards, isColliding, nearestStack, setCards)} />
						})
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
