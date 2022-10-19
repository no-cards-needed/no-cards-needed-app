import { createRef, useEffect, useRef, useState } from "react";
import {useNavigate, useParams, } from "react-router-dom";
import './css/App.css';

import Card from "./components/Card";
import { Stack } from "./components/Stack";
import { calculateCardPosition } from "./helpers/calculate-card-position";
import { getDistanceBetweenTwoElements } from "./helpers/get-distance-between-two-elements";
import { getPositionAtCenter } from "./helpers/get-position-at-center";
import { handleCardDrag } from "./helpers/handle-card-drag";
import { handleCardDrop } from "./helpers/handle-card-drop";
import { moveCardsAside } from "./helpers/move-cards-aside";
import { moveCardsToHand } from "./helpers/move-cards-to-hand";
import { shuffleCards } from "./helpers/shuffle-cards";
import {addCardIntoStack, moveCardToPosition} from "./helpers/move-card-to-position";
import {moveCardsToStack} from "./helpers/move-cards-to-stack";
import useTimeout from "./helpers/hooks/useTimeout";
import GameHeader from "./components/GameHeader";
import toast, {Toaster} from "react-hot-toast";
import { getCardPositionInStack } from "./helpers/get-card-position-in-stack";

// https://www.npmjs.com/package/use-dynamic-refs
// import useDynamicRefs from "./assets/helpers/use-dynamic-refs";

function PlayingGame(
		{
			syncedCards, 
			syncedStacks, 
			setCard,
			setStack
		}: {
			syncedCards: {0?: Card}, 
			syncedStacks: {0?: Stack}, 
			setCard: (card, cardId) => void,
			setStack: (stack, stackId) => void
		}) {

	const [ lashTextTricks, setLashTextTricks ] = useState( 'Show Tricks' )
    const [ lashTextRemoved, setLashTextRemoved ] = useState( 'Show Removed Cards' )
    const [ activeTricks, setActiveTricks ] = useState( false )
    const [ activeRemoved, setActiveRemoved ] = useState( false )

	function toggleDisplayTricks() {
        if (activeTricks) {   
            setActiveTricks(false) 
            setLashTextTricks('Show Tricks')
        } else { 
          setActiveTricks(true) 
          setLashTextTricks('Hide Tricks')

          setActiveRemoved(false) 
          setLashTextRemoved('Show Removed Cards')
        }
	} 

	function toggleDisplayRemoved() {
	if (activeRemoved) {   
		setActiveRemoved(false) 
		setLashTextRemoved('Show Removed Cards')
	} else { 
		setActiveRemoved(true) 
		setLashTextRemoved('Hide Removed Cards')

		setActiveTricks(false) 
		setLashTextTricks('Show Tricks')
	}
	} 

	const [ usedStacks, setUsedStacks ] = useState({
		0: {
			stackType: "hand",
			cards: [],
			position: {x: 0, y: 0},
		},
		1: {
			stackType: "hidden",
			cards: [],
			position: {x: 0, y: 0},
		}
	})

	useEffect(() => {
		// console.log("usedStacks updated", usedStacks)
	}, [usedStacks])

	const [ usedCards, setUsedCards ] = useState({})

	const stackRef = useRef([]);
	const cardRef = useRef([]);
	
	const stacksReference = useRef({})
	stacksReference.current = usedStacks
	
	const usedCardsReference = useRef({})
	usedCardsReference.current = usedCards
	
	const [nearestStack, setNearestStack] = useState(null);
	const stackDistances = useRef({})
	const [isColliding, setIsColliding] = useState(false);
	const [currentlyMovingStack, setCurrentlyMovingStack] = useState(false);

	const getNearestStack = (cardRef) => {
		const distances = Object.keys(usedStacks).map((stackId) => {
			if (stackRef.current[stackId]) {
				return getDistanceBetweenTwoElements(stackRef.current[stackId], cardRef.current)
			} else {
				return 99999
			}
		});
		const nearestStack = stackRef.current[distances.indexOf(Math.min(...distances))];

		return {nearestStack, distance: Math.min(...distances), index: distances.indexOf(Math.min(...distances))};
	}

	const updateCardPosition = (cardId, {x, y}) => {
		setUsedCards(
			{
				...usedCards,
				[cardId]: {
					...usedCards[cardId],
					controlledPosition: {
						x,
						y
					}
				}
			}
		)
	}

	// Setting Card Ref in usedCards State
	const setCardRef = (cardId, ref) => {
		console.log("Setting Card Ref")
		cardRef.current[cardId] = ref;
	}

	const resetCardZIndex = (shuffledCards) => {
		// Re-Set zIndex of the shuffled cards
		shuffledCards.forEach((cardId) => {
			setUsedCards(
				{
					...usedCards,
					[cardId]: {
						...usedCards[cardId],
						zIndex: shuffledCards.indexOf(cardId),
						animation: "shuffle"
					}
				}
			)
		})
		const timeout = setTimeout(() => {
			shuffledCards.forEach((cardId) => {
				setUsedCards(
					{
						...usedCards,
						[cardId]: {
							...usedCards[cardId],
							animation: "none"
						}
					}
				)
			})
			clearTimeout(timeout)
		}, 300)
	}

	const setCards = (cardId: number, stackId: number) => {
		try {
			const stack: {
				stackType: string;
				cards: number[];
				position: {
					x: number;
					y: number;
				};
			} = usedStacks[stackId]
			const card = usedCards[cardId]
	
			const cardPosition = {
				x: stack.stackType !== "hand" && stack.stackType !== "open" ? stackRef.current[stackId].getBoundingClientRect().x : calculateCardPosition(cardRef.current[cardId], stackRef.current[stackId], stack, cardId),
				y: stackRef.current[stackId].getBoundingClientRect().y
			}
			console.log(getCardPositionInStack(card, stack))
			setUsedCards(
				{
					...usedCards,
					[cardId]: {
						...card,
						stackId: stackId,
						controlledPosition: cardPosition,
						orientation: stack.stackType === "hand" || stack.stackType === "front" ? "front" : "back",
						zIndex: getCardPositionInStack(card, stack),
					} 
				}
			)
			setUsedStacks(
				{
					...usedStacks,
					[stackId]: {
						...stack,
						cards: [
							...stack.cards ? stack.cards : [],
							cardId
						]
					}
				}
			)
		}
		catch (e) {
			console.error(e)
			console.error("COULD NOT SET CARDS")
			console.error(cardId, stackId)
		}
	}

	useEffect(() => {
		if(syncedCards) {
			console.log("Synced Cards", syncedCards)
			let cards = usedCards;
			Object.keys(syncedCards).forEach(cardId => {
				setCards(parseInt(cardId), syncedCards[cardId].onStack)
				cards[cardId] = {
					...syncedCards[cardId],
					controlledPosition: usedCards[cardId] ? usedCards[cardId].controlledPosition : {x: 0, y: 0},
					zIndex: usedCards[cardId] ? usedCards[cardId].zIndex : 0,
					animation: usedCards[cardId] ? usedCards[cardId].animation : "none",
					orientation: "back"
				}
			});
			setUsedCards(cards)
		}
 
		if(syncedStacks) {
			// Update Stacks with syncedStacks
			let stacks = usedStacks;
			console.log("Synced Stacks", syncedStacks)
			Object.keys(syncedStacks).forEach(stackId => {
				stacks[stackId] = {
					...syncedStacks[stackId],
				}
			});
			setUsedStacks(stacks)
		} 

	}, [syncedCards, syncedStacks])

	const cardDimensions = {width: 80, height: 112}

	return (
		<div>
			<div style={{background: "#DEDBE5", position: "fixed"}}>
				<div><Toaster /></div>
                <div className='backgroundElement'></div>
                <div className="playingArea criticalMaxWidth">
				{
					Object.keys(usedStacks).map((stackId) => {
						if(parseInt(stackId) > 1) {
							return (
								<Stack key={stackId} stackType={usedStacks[stackId].stackType} stackRef={el => stackRef.current[stackId] = el}/>
							)
						}
					})
				}
                </div>

				<div className="cards">
					{
						Object.keys(usedCards).map((cardId) => {
							return <Card 
									setRef={setCardRef} 
									card={usedCards[cardId]} 
									cardId={cardId}
									key={cardId}
									shuffle={() => {}}
									handleLongPress={() => {}}
									handleCardDrag={(cardRef, cardId) => handleCardDrag(cardRef, cardId, usedCards, setUsedCards, getNearestStack, nearestStack, setNearestStack, usedStacks, setIsColliding)} 
									handleCardDrop={(data, id) => handleCardDrop(id, usedCards, setUsedCards, isColliding, usedStacks, setUsedStacks, nearestStack, setCards)} />
						})
					}
				</div>

                <GameHeader />

                <div className="hand criticalMaxWidth" id="basicDrop">
					<Stack key={"handStack"} stackType={usedStacks[0].stackType} stackRef={el => stackRef.current[0] = el}/>
                </div>
				<Stack key={"hiddenStack"} stackType={usedStacks[1].stackType} stackRef={el => stackRef.current[1] = el}/>
            </div>
		</div>
	);
}

export default PlayingGame;
