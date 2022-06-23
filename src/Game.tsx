import { useEffect, useRef, useState } from "react";
import { useSpring } from "react-spring";
import './App.css';

import Card from "./assets/components/Card";
import { Stack } from "./assets/components/Stack";
import { calculateCardPosition } from "./assets/helpers/calculate-card-position";
import { getDistanceBetweenTwoElements } from "./assets/helpers/get-distance-between-two-elements";
import { getPositionAtCenter } from "./assets/helpers/get-position-at-center";
import { handleCardDrag } from "./assets/helpers/handle-card-drag";	
import { handleCardDrop } from "./assets/helpers/handle-card-drop";
import { moveCardsAside } from "./assets/helpers/move-cards-aside";
import { moveCardsToHand } from "./assets/helpers/move-cards-to-hand";
import { connectToGame, createPeer } from "./assets/helpers/multiplayer";
import { shuffleCards } from "./assets/helpers/shuffle-cards";

// https://www.npmjs.com/package/use-dynamic-refs
// import useDynamicRefs from "./assets/helpers/use-dynamic-refs";

function Game() {

	const peerInstance = useRef(null)
	const connection = useRef(null)
	const [peerId, setPeerid] = useState("")
	const [connectionId, setConnectionId] = useState("")

	const connect = () => {
		connection.current = connectToGame(peerInstance.current, connectionId)
		connection.current.on("open", () => {
			connection.current.send("hi!");
		});
	}

	const stackRef = useRef([]);
	const cardRef = useRef([]);
	const [isColliding, setIsColliding] = useState(false);
	const [cardStartPosition, setCardStartPosition] = useState({x: 0, y: 0});
	const [currentlyMovingStack, setCurrentlyMovingStack] = useState(false);

	const [stacks, setStacks] = useState([
		{
			id: 0,
			stackType: "hand",
			orientation: "front",
			cards: [],
			currentlyNearest: false,
			colliding: false,
			distance: 0,
			height: 200,
			width: 300,
			position: {
				x: 0,
				y: 0
			}
		},
		{
			id: 1,
			stackType: "stack",
			orientation: "front",
			cards: [],
			currentlyNearest: false,
			colliding: false,
			distance: 0,
			height: 200,
			width: 300,
			position: {
				x: 0,
				y: 0
			}
		},
		{
			id: 2,
			stackType: "stack",
			orientation: "front",
			cards: [],
			currentlyNearest: false,
			colliding: false,
			distance: 0,
			height: 200,
			width: 300,
			position: {
				x: 0,
				y: 0
			}
		},
		{
			id: 3,
			stackType: "openStack",
			orientation: "front",
			cards: [],
			currentlyNearest: false,
			colliding: false,
			distance: 0,
			height: 200,
			width: 300,
			position: {
				x: 0,
				y: 0
			}
		},
	])

	const [nearestStack, setNearestStack] = useState(null);
	
	const [usedCards, setUsedCards] = useState([
		{
			id: 0,
			symbol: "10C",
			controlledPosition: {
				x: 0,
				y: 0
			},
			zIndex: 0,
			movedAside: "false",
			onStackType: "none",
			ref: null,
			animation: "none"
		},
		{
			id: 1,
			symbol: "10D",
			controlledPosition: {
				x: 0,
				y: 0
			},
			zIndex: 0,
			movedAside: "false",
			onStackType: "none",
			ref: null,
			animation: "none"
		},
		{
			id: 2,
			symbol: "10H",
			controlledPosition: {
				x: 0,
				y: 0
			},
			zIndex: 0,
			movedAside: "false",
			onStackType: "none",
			ref: null,
			animation: "none"
		},
		{
			id: 3,
			symbol: "10H",
			controlledPosition: {
				x: 0,
				y: 0
			},
			zIndex: 0,
			movedAside: "false",
			onStackType: "none",
			ref: null,
			animation: "none"
		},
		{
			id: 4,
			symbol: "9H",
			controlledPosition: {
				x: 0,
				y: 0
			},
			zIndex: 0,
			movedAside: "false",
			onStackType: "none",
			ref: null,
			animation: "none"
		},
	]);

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
		setUsedCards(usedCards.map((card, i) => {
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
		
		// Re-Set zIndex of the shuffled cards
		setUsedCards(usedCards.map((card, i) => {
			if (shuffledCards.includes(card.id)) {
				card.zIndex = shuffledCards.indexOf(card.id)
				card.animation = "shuffle"
				const timeout = setTimeout(() => {
					// card.animation = "none"
					setUsedCards(usedCards.map((card, i) => {
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

		moveCardsToHand(usedCards, updateCardPosition, stacks, setStacks, stackRef)

		peerInstance.current = createPeer()

		// handle peer errors
		const FATAL_ERRORS = ['invalid-id', 'invalid-key', 'network', 'ssl-unavailable', 'server-error', 'socket-error', 'socket-closed', 'unavailable-id', 'webrtc'];
		peerInstance.current.on('error', (e) => {
			if (FATAL_ERRORS.includes(e.type)) {
				console.log(e)
				peerInstance.current.reconnect(e); // this function waits then tries the entire connection over again
			} else {
				console.log('Non fatal error: ',  e.type);
			}
		})

		peerInstance.current.on("open", (id) => {
			console.log("Peer created with id: "+id)
			setPeerid(id)
		})

		peerInstance.current.on("connection", (conn) => {
			conn.on("data", (data) => {
				// Will print 'hi!'
				console.log(data);
			});
			conn.on("open", (id) => {
				conn.send("hi!");
				console.log("my id is" + id)
			});
		})

	}, [])

	

	return (
		<div className="App">
			{/* <div className='cardStack' style={{border: isColliding ? '1px solid green' : '1px solid red',}} ref={stackRef}></div> */}
			<p style={{width: 500, margin: "0 auto"}}>{
				peerId
			}</p>
			<div>
				<input value={connectionId} onChange={(e) => setConnectionId(e.target.value)}/>
				<button onClick={() => connect()}>Connect</button>
			</div>
			{
				stacks.map((stack, index) => {
					return (
						<Stack key={index} stack={stack} stackRef={el => stackRef[index] = el} updateCardPosition={updateCardPosition}/>
					)
				})
			}
			{/* <Stack height={500} width={500} position={{x: 0, y: 0}} updateCardPosition={updateCardPosition} isColliding={isColliding} stackRef={stackRef}/> */}

			{/* <div className='hand' style={{border: isColliding ? '1px solid green' : '1px solid red',}}></div> */}
			<div className="hand">
				{
					usedCards.map((card, index) => {
						return <Card 
								setRef={setCardRef} 
								card={card} 
								key={card.id}
								shuffle={shuffleCardsById}
								handleLongPress={handleLongPress}
								handleCardDrag={(data, id) => handleCardDrag(data, id, usedCards, setUsedCards, getNearestStack, nearestStack, setNearestStack, stacks, setIsColliding)} 
								handleCardDrop={(data, id) => handleCardDrop(data, id, usedCards, setUsedCards, isColliding, setIsColliding, stacks, setStacks, nearestStack, updateCardPosition, stackRef, currentlyMovingStack, setCurrentlyMovingStack, connection)} />
					})
				}
			</div>
		</div>
	);
}

export default Game;
