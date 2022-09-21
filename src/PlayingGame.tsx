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

// https://www.npmjs.com/package/use-dynamic-refs
// import useDynamicRefs from "./assets/helpers/use-dynamic-refs";

function PlayingGame(
		{
			syncedCards, 
			stacks, 
			setCard,
			setStack
		}: {
			syncedCards: {0?: Card}, 
			stacks: {0?: Stack}, 
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

	const [ usedCards, setUsedCards ] = useState({})

	const stackRef = useRef([]);
	const cardRef = useRef([]);
	
	const stacksReference = useRef({})
	stacksReference.current = stacks
	
	const usedCardsReference = useRef({})
	usedCardsReference.current = usedCards
	
	const [nearestStack, setNearestStack] = useState(null);
	const stackDistances = useRef({})
	const [isColliding, setIsColliding] = useState(false);
	const [currentlyMovingStack, setCurrentlyMovingStack] = useState(false);

	const getNearestStack = (cardRef) => {
		const distances = Object.keys(stacks).map((stackId) => {
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

	useEffect(() => {
		let cards;
		Object.keys(syncedCards).forEach(cardId => {
			cards[cardId] = {
				...syncedCards[cardId],
				controlledPosition: {x: 0, y: 0},
				zIndex: 0,
				animation: "none",
			}
		});
		setUsedCards(syncedCards)
	}, [syncedCards])

	const cardDimensions = {width: 80, height: 112}

	return (
		<div>
			<div style={{background: "#DEDBE5", position: "fixed"}}>
				<div><Toaster /></div>
                <div className='backgroundElement'></div>
                <div className="playingArea criticalMaxWidth">
				{
					Object.keys(stacks).map((stackId) => {
						return (
							<Stack key={stackId} stackType={stacks[stackId].stackType} stackRef={el => stackRef.current[stackId] = el}/>
						)
					})
				}
                </div>

				<div className="cards">
					{
						Object.keys(usedCards).map((cardId) => {
							return <Card 
									setRef={setCardRef} 
									card={usedCards[cardId]} 
									key={cardId}
									shuffle={() => {}}
									handleLongPress={() => {}}
									handleCardDrag={(cardRef, cardId) => handleCardDrag(cardRef, cardId, usedCards, setUsedCards, getNearestStack, nearestStack, setNearestStack, stacks, setIsColliding)} 
									handleCardDrop={(data, id) => handleCardDrop(data, id, usedCards, setUsedCards, isColliding, setIsColliding, stacks, setStacks, nearestStack, updateCardPosition, stackRef, cardRef, currentlyMovingStack, setCurrentlyMovingStack)} />
						})
					}
				</div>

                <GameHeader />

                <div className="hand criticalMaxWidth" id="basicDrop">
					<Stack key={"handStack"} stackType={stacks[0].stackType} stackRef={el => stackRef.current[0] = el}/>
                </div>
				<Stack key={"hiddenStack"} stackType={stacks[1].stackType} stackRef={el => stackRef.current[1] = el}/>
            </div>
		</div>
	);
}

export default PlayingGame;
