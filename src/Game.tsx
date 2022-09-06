import { useEffect, useRef, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
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
import { handleConnectionInstance, setDefaultStacks, setDefaultUsedCards, setupPeerInstance} from "./helpers/multiplayer";
import { shuffleCards } from "./helpers/shuffle-cards";
import {moveCardToPosition} from "./helpers/move-card-to-position";
import {moveCardsToStack} from "./helpers/move-cards-to-stack";
import useTimeout from "./helpers/hooks/useTimeout";
import GameHeader from "./components/GameHeader";

// https://www.npmjs.com/package/use-dynamic-refs
// import useDynamicRefs from "./assets/helpers/use-dynamic-refs";

function Game() {
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


	const { gameId } = useParams();

	const peerInstance = useRef(null)
	const connections = useRef([])
	const [peerId, setPeerid] = useState("")
	const [connectionId, setConnectionId] = useState("")

	const stackRef = useRef([]);
	const cardRef = useRef([]);
	const [isColliding, setIsColliding] = useState(false);
	const [cardStartPosition, setCardStartPosition] = useState({x: 0, y: 0});
	const [currentlyMovingStack, setCurrentlyMovingStack] = useState(false);

	const [stacks, setStacks] = useState([])
	const stacksReference = useRef([])
	stacksReference.current = stacks

	const [nearestStack, setNearestStack] = useState(null);
	
	const [usedCards, setUsedCards] = useState([]);
	const usedCardsReference = useRef([])
	usedCardsReference.current = usedCards

	const getNearestStack = (card) => {
		const distances = stacks.map((stack, index) => {
			const distance = getDistanceBetweenTwoElements(stackRef[index], card)

			// Update Stack Distance
			setStacks(stacks.map((stack, i) => {
				if (i === index) {
					stack.distance = distance;
				}
				return stack;
			}))

			return distance
		});
		const nearestStack = stackRef[distances.indexOf(Math.min(...distances))];

		return {nearestStack, distance: Math.min(...distances), index: distances.indexOf(Math.min(...distances))};
	}

	const updateCardPosition = (cardId, {x, y}) => {
		setUsedCards(usedCardsReference.current.map((card, i) => {
			if (i === cardId) {
				card.controlledPosition = {
					x,
					y
				}
			}
			return card;
		}))
	}

	// Setting Card Ref in usedCards State
	const setCardRef = (cardId, ref) => {
		setUsedCards(usedCards.map((card, i) => {
			if (i === cardId) {
				card.ref = ref;
			}
			return card;
		}))
	}

	// Shuffle cards by cardId
	const shuffleCardsById = (cardId: number) => {
		// Find stack of card
		const stack = stacks.find((stack, index) => {
			if (stack.cards.includes(cardId)) {
				return stack;
			}
		})

		const tempCards = stack.cards
		const shuffledCards = shuffleCards(tempCards)

		setStacks(stacks.map((updatedStack, index) => {
			if (index === stack.id) {
				updatedStack.cards = shuffledCards;
			}
			return updatedStack;
		}))

		resetCardZIndex(shuffledCards)

		connections.current.map((connection) => {
			connection.connection.send({
				type: "shuffle",
				data: {
					stacks: stacksReference.current,
					shuffledCards
				}
			})
		})
	}

	const resetCardZIndex = (shuffledCards) => {
		console.log("resetCardZIndex", shuffledCards)
		// Re-Set zIndex of the shuffled cards
		setUsedCards(usedCardsReference.current.map((card, i) => {
			if (shuffledCards.includes(card.id)) {
				card.zIndex = shuffledCards.indexOf(card.id)
				card.animation = "shuffle"
				const timeout = setTimeout(() => {
					// card.animation = "none"
					setUsedCards(usedCardsReference.current.map((card, i) => {
						if (i === i) {
							card.animation = "none"
						}
						return card;
					}))
					clearTimeout(timeout)
				}, 300)
			}
			return card;
		}))
	}

	// Check if LongPress is in proximity of card start position, if so: move stack not single card
	const handleLongPress = (cardId: number, cardStartPosition: {x: number, y: number}, cardCurrentPosition: {x: number, y: number}) => {
		// Check if cardPosition is in specific radius of cardStartPosition

		const distance = Math.sqrt(Math.pow(cardStartPosition.x - cardCurrentPosition.x, 2) + Math.pow(cardStartPosition.y - cardCurrentPosition.y, 2))

		if (distance < 50) {
			setCurrentlyMovingStack(true)

			// Set Animation of current card to "stack" the it's obvious the user is moving a stack
			setUsedCards(usedCards.map((card, i) => {
				if (i === cardId) {
					card.animation = "stack"
				}
				return card;
			}))

			// Get All Cards in current Stack
			const {cards} = stacks.find((stack, index) => {
				if (stack.cards.includes(cardId)) {
					return stack;
				}
			})

			// Set All cards in stack of the moved card expect the one beeing moved to animation "hidden"
			setUsedCards(usedCards.map((card, i) => {
				if (cards.includes(card.id) && card.id !== cardId) {
					card.animation = "hidden"
				}
				return card;
			}))
		}
	}

	const cardMove_stack = (data) => {
		const {stackIndex, cardId, tempStacks} = data.data

		let stackPosition = getPositionAtCenter(stackRef[stackIndex]);

		moveCardToPosition(stacksReference.current, setStacks, usedCardsReference.current, setUsedCards, stackIndex, updateCardPosition, cardId, stackPosition)
	}
	const cardMove_hand = (data) => {
		const {stackIndex, cardId, tempStacks} = data.data

		let stackPosition = getPositionAtCenter(stackRef[stackIndex]);

		moveCardToPosition(stacksReference.current, setStacks, usedCardsReference.current, setUsedCards, stackIndex, updateCardPosition, cardId, stackPosition)
	}
	const recieveShuffledCards = (data) => {
		setStacks(data.data.stacks)

		resetCardZIndex(data.data.shuffledCards)
	}

	const dataRecievedCallback = (data) => {
		console.log(data)
		switch (data.type) {
			case "lobby":
				window.history.replaceState(null, "No Cards Needed", "/game/"+data.data.lobbyString)
				break;
			case "cards":
				setUsedCards(data.data.cards)
				// Sending Cards to Stack after a time period to make sure the cards are loaded
				window.setTimeout(() => {
					moveCardsToStack(usedCardsReference.current, setUsedCards, updateCardPosition, stacksReference.current, setStacks, stackRef, 2)
				}, 100)
				break;
			case "stacks":
				setStacks(data.data.stacks)
				break;

			case "cardMove_stack":
				if(data.data.id !== peerId) {
					cardMove_stack(data)
				}
				break;
			case "cardMove_hand":
				if(data.data.id !== peerId) {
					cardMove_hand(data)
				}
				break;
			case "shuffle":
				recieveShuffledCards(data)
				break;
			case "newConnection":
				if(!connections.current.some((connection) => connection.peerId === data.data.id) && data.data.id !== peerId && data.data.id !== undefined) {
					console.log("if passed")
					handleConnectionInstance(peerInstance.current, connections, data.data.id, dataRecievedCallback)
					connections.current.map((connection) => {
						console.log("mapped connection: ", connection)
						if (connection.peerId !== undefined) {
							console.log("connection id defined")
							connection.connection.send({
								type: "newConnection",
								data: {
									id: data.data.id,
								}
							})
						}
						return connection
					})
				}
				break;
		}
	}

	useEffect(() => {
		if (currentlyMovingStack) {
			// get all hidden cards to move to the closest stack
			usedCards.map((card, i) => {
				if (card.animation === "hidden") {
					const stackPosition = getPositionAtCenter(nearestStack.nearestStack)
					const {width, height} = card.ref.current.getBoundingClientRect()
					updateCardPosition(card.id, {x: stackPosition.x - width / 2, y: stackPosition.y - height / 2})
				}
			})
			
		}
	}, [isColliding])

	// Move Cards to Hand on Start
	useEffect(() => {
		console.log(gameId)
		if(gameId === "new") {
			peerInstance.current = setupPeerInstance(dataRecievedCallback, connections, gameId)
		} else {
			peerInstance.current = setupPeerInstance(dataRecievedCallback, connections, null)
			window.setTimeout(() => {
				handleConnectionInstance(peerInstance.current, connections, gameId, dataRecievedCallback)
			}, 1000)
		}
		setPeerid(peerInstance.current.id)
	}, [])

	return (
		<div>
			{/* <div className='cardStack' style={{border: isColliding ? '1px solid green' : '1px solid red',}} ref={stackRef}></div> */}
{/*			<div style={{margin: "100px auto", display: "flex", flexDirection: "column", alignItems: "center", position: "fixed", zIndex: 5}}>
				<p style={{textAlign: "center", background: "#ffffff1a", padding: "4px 16px", borderRadius: "7px"}} onClick={() => navigator.clipboard.writeText(peerId)}>{
					peerId
				}</p>
				<div>
					<input value={connectionId} onChange={(e) => setConnectionId(e.target.value)}/>
					<button onClick={() => handleConnectionInstance(peerInstance.current, connections, connectionId, dataRecievedCallback)}>Connect</button>
				</div>
			</div>	*/}
			<div style={{background: "#DEDBE5", position: "fixed"}}>
                <div className='backgroundElement'></div>
                <div className="playingArea criticalMaxWidth">
                    <div className="playingAreaColumn">
                        <div className="playingAreaRow">
							{
								stacks.map((stack, index) => {
									if(index > 1 && index < 3) {
										return (
											<Stack key={index} stack={stack} stackRef={el => stackRef[stack.id] = el} updateCardPosition={updateCardPosition}/>
										)
									}
								})
							}
                        </div>
                        <div className="playingAreaRow">
							{
								stacks.map((stack, index) => {
									if(index > 2) {
										return (
											<Stack key={index} stack={stack} stackRef={el => stackRef[stack.id] = el} updateCardPosition={updateCardPosition}/>
										)
									}
								})
							}
                        </div>
                    </div>
                </div>

				<div className="cards">
					{
						usedCards.map((card, index) => {
							return <Card 
									setRef={setCardRef} 
									card={card} 
									key={card.id}
									shuffle={shuffleCardsById}
									handleLongPress={handleLongPress}
									handleCardDrag={(data, id) => handleCardDrag(data, id, usedCards, setUsedCards, getNearestStack, nearestStack, setNearestStack, stacks, setIsColliding)} 
									handleCardDrop={(data, id) => handleCardDrop(data, id, usedCards, setUsedCards, isColliding, setIsColliding, stacks, setStacks, nearestStack, updateCardPosition, stackRef, currentlyMovingStack, setCurrentlyMovingStack, connections)} />
						})
					}
				</div>

                <GameHeader />


  
                <div className="hand criticalMaxWidth" id="basicDrop">
					{
						stacks.map((stack, index) => {
							if(index === 1) {
								return (
									<Stack key={index} stack={stack} stackRef={el => stackRef[stack.id] = el} updateCardPosition={updateCardPosition}/>
								)
							}
						})
					}
                </div>
				{
						stacks.map((stack, index) => {
							if(index === 0) {
								return (
									<Stack key={index} stack={stack} stackRef={el => stackRef[stack.id] = el} updateCardPosition={updateCardPosition}/>
								)
							}
						})
					}
            </div>
		</div>
	);
}

export default Game;
