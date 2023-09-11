// Firebase Stuff
// Import the functions you need from the SDKs you need
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth"
import {
	ref,
	getDatabase,
	set,
	onValue,
	onDisconnect,
	onChildAdded,
	serverTimestamp,
	DataSnapshot,
	remove,
} from "firebase/database"

import { useEffect, useRef, useState } from "react"
import { useLocation, useParams } from "react-router-dom"

import CreateGame from "./components/CreateGame"
import Loading from "./components/Loading"
import PlayingGame from "./PlayingGame"

import { miniCards } from "./helpers/Cards"
import { Distributor } from "./helpers/distributor/distributor"
import useStateRef from "./helpers/hooks/useStateRef"

function translateCardName(symbol: string) {
	return symbol
}

const convertStacksMapToObject = (stacks: Map<number | string, Stack>) => {
	console.log("👁️ Convert Stacks Map to Object", stacks)
	const _stacks: Map<number | string, any> = stacks
	_stacks.forEach((stack, stackId) => {
		_stacks.set(stackId, {
			...stack,
			cards: Array.from(stack.cards),
		})
	})

	return Object.fromEntries(_stacks)
}

export const GameWrapper = ({ app }: { app: any }) => {
	const dropdownContent: DropdownContent[] = [
		{
			count: 24,
			text: "9 to ACE",
			src: miniCards.d9,
			boundries: {
				from: 9,
				to: 14,
			},
		},
		{
			count: 32,
			text: "6 to ACE",
			src: miniCards.d6,
			boundries: {
				from: 6,
				to: 14,
			},
		},
		{
			count: 36,
			text: "7 to ACE",
			src: miniCards.d7,
			boundries: {
				from: 7,
				to: 14,
			},
		},
		{
			count: 52,
			text: "2 to ACE",
			src: miniCards.d2,
			boundries: {
				from: 2,
				to: 14,
			},
		},
	]

	const avatars = [
		{
			src: "../assets/avatars/avatar-1.svg",
		},
		{
			src: "../assets/avatars/avatar-2.svg",
		},
		{
			src: "../assets/avatars/avatar-3.svg",
		},
		{
			src: "../assets/avatars/avatar-4.svg",
		},
		{
			src: "../assets/avatars/avatar-5.svg",
		},
	]

	const [deckCards, setDeckCards] = useState(dropdownContent[0])
	const [joker, setJoker] = useState(0)
	const [decks, setDecks] = useState(1)
	const [hand, setHand] = useState(5)
	const [pile, setPile] = useState(true)
	const [gameStarted, setGameStarted] = useState(false)
	const [loading, setLoading] = useState(true)

	// TODO: Generate Random room name

	const [gameId, setGameId] = useState(useParams().gameId || "DEBUG")

	// Getting the set User Name
	const { state } = useLocation()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [name, setName, nameRef] = useStateRef<String>("")

	const gameStatusRef = useRef(null)
	const [gameStatusState, setGameStatusState] = useState<GameStatus>()
	const defaultGameStatus: (userId: string) => GameStatus = (
		userId: string
	) => {
		return {
			host: userId,
			created: serverTimestamp(),
			currentGameState: "lobby",
			timestamp: serverTimestamp(),
		}
	}

	const [userId, setUserId] = useState<string>(null)
	const playerRef = useRef(null)

	const allPlayersRef = useRef(null)
	const [allPlayers, setAllPlayers] = useState<ListOfPlayers>(new Map([]))

	const cardsRef = useRef(null)
	const [cardsState, setCardsState] = useState<Map<number, Card>>(new Map([]))

	const handStacksRef = useRef(null)
	const [handStacksState, setHandStacksState] = useState<
		Map<number | string, Stack>
	>(new Map([]))

	const tableStacksRef = useRef(null)
	const [tableStacksState, setTableStacksState] = useState<
		Map<number | string, Stack>
	>(new Map([]))

	const gameLogRef = useRef(null)
	const [gameLogState, setGameLogState] = useState<GameLog>()

	const [processCreate, setProcessCreate] = useState(true)
	const [processJoin, setProcessJoin] = useState(false)

	const initGame = () => {
		gameStatusRef.current = ref(
			getDatabase(app.current),
			`game/${gameId}/gameStatus/`
		)
		allPlayersRef.current = ref(
			getDatabase(app.current),
			`game/${gameId}/players/`
		)
		cardsRef.current = ref(
			getDatabase(app.current),
			`game/${gameId}/cards/`
		)
		handStacksRef.current = ref(
			getDatabase(app.current),
			`game/${gameId}/handStacks/`
		)
		tableStacksRef.current = ref(
			getDatabase(app.current),
			`game/${gameId}/tableStacks/`
		)

		// Game Logging
		gameLogRef.current = ref(
			getDatabase(app.current),
			`game/${gameId}/gameLog/`
		)

		// A new player connected to the game
		onValue(allPlayersRef.current, (snapshot) => {
			// If this is the only player, this player is starting the game instance

			// TODO: When only two players are playing and one refreshes the page, this is re-triggered
			if (snapshot.val() && Object.keys(snapshot.val()).length === 1) {
				console.log(
					"👁️ [gamewrapper] this is the first player, setting up the game",
					snapshot.val()
				)
				const gameStatus = defaultGameStatus(
					Object.keys(snapshot.val())[0]
				)

				// Check if the game is already started by comparing the gamestatus timestamp with servertimestamp()
				// If the game is already started, then the game is already set up
				// If the game is not started, then set up the game
				if (
					!gameStatusState ||
					gameStatusState.timestamp < gameStatus.timestamp
				) {
					// Setting the game status to the initial values
					set(gameStatusRef.current, gameStatus)
						.then(() =>
							console.log(
								"👁️ [gamewrapper] game status set",
								gameStatus
							)
						)
						.catch((error) =>
							console.log(
								"👁️ [gamewrapper] Encountered error setting game status",
								error
							)
						)
				} else {
					console.log(
						"👁️ [gamewrapper] game already started, skipping setup",
						gameStatusState,
						gameStatus
					)
				}
			}
		})

		// Game Status Value Change in FireBase Realtime Database
		onValue(gameStatusRef.current, (snapshot) => {
			// console.log("👁️ [gamewrapper] recieved a new game status: ", snapshot.val())
			const newGameStatus: GameStatus = snapshot.val()
			setGameStatusState(newGameStatus)

			// GameStatus Obj to Map
			setGameStarted(newGameStatus?.currentGameState === "game")
		})

		// Card Value Change in FireBase Realtime Database
		onValue(cardsRef.current, (snapshot) => {
			console.log("👁️ [gamewrapper] recieved new cards: ", snapshot.val())
			// setCardsState(snapshot.val());

			const newCards = snapshot.val()
			if (newCards) {
				// Convert the cards to a Map
				const _newCards: Map<number, Card> = new Map(
					newCards.map((card: Card) => [card.cardId, card])
				)
				setCardsState(_newCards)
			}
		})

		const handleStackChange = (
			snapshot: DataSnapshot,
			stackType: "hand" | "table"
		) => {
			console.log(
				`👁️ [gamewrapper] recieved new stacks of type ${stackType}: `,
				snapshot.val()
			)
			if (snapshot.val()) {
				const _newStacks: Map<number | string, Stack> = new Map()

				let newStacks = snapshot.val()
				if (typeof newStacks === "object")
					newStacks = Object.values(newStacks)
				newStacks.forEach((stack: Stack) => {
					const _stack = stack
					_stack.cards = new Set(stack.cards)
					_newStacks.set(stack.id, _stack)
				})

				// Convert the stacks to a Map
				if (stackType === "hand") setHandStacksState(_newStacks)
				else if (stackType === "table") setTableStacksState(_newStacks)
			}
		}
		// Stack Value Change in FireBase Realtime Database
		onValue(tableStacksRef.current, (snapshot) => {
			handleStackChange(snapshot, "table")
		})
		onValue(handStacksRef.current, (snapshot) => {
			handleStackChange(snapshot, "hand")
		})

		// Game Log Value Change in FireBase Realtime Database
		onValue(gameLogRef.current, (snapshot) => {
			setGameLogState(snapshot.val())
		})

		// Add the new player to the "allPlayers" state
		// onChildAdded(allPlayersRef.current, (snapshot) => {
		// 	const addedPlayer = snapshot.val();

		// 	setAllPlayers((prev) => {
		// 		const _prev = new Map(prev);
		// 		_prev.set(addedPlayer.id, addedPlayer);
		// 		return _prev;
		// 	})
		// })
		onValue(allPlayersRef.current, (snapshot) => {
			const players = snapshot.val()
			if (players) {
				const _players: ListOfPlayers = new Map(Object.entries(players))
				setAllPlayers(_players)
			}
		})
	}

	// Updater Function for the Game Status
	// recieves a GameStatus object and sets it in the Firebase Database
	const setGameStatus = (updatedGameStatus: GameStatus) => {
		// console.log("👁️ [gamewrapper] setting user requested gameStatus");
		set(gameStatusRef.current, updatedGameStatus)
			// .then(() => console.log("👁️ [gamewrapper] game status set", updatedGameStatus))
			.catch((e) =>
				console.log(
					"👁️ [gamewrapper] Encountered error setting game status",
					e
				)
			)
	}

	// Updater Function for the Cards
	// recieves a *SINGLE* Card object and sets it in the Firebase Database
	const setCard = (card: Card, cardId: number, timestamp: number) => {
		const cardRef = ref(
			getDatabase(app.current),
			`game/${gameId}/cards/${cardId}`
		)
		// console.log("👁️ [gamewrapper] setting user requested cards with path: ", cardRef, "and the timestamps: ", timestamp, gameStatusState.timestamp);

		// Convert usedCard to sync ready Card
		const _card: Card = {
			cardId: card.cardId,
			symbol: card.symbol,
			onStack: card.onStack,
		}

		// Check if timestamp is newer than the latest server timestamp
		if (
			gameStatusState.timestamp &&
			timestamp > (gameStatusState.timestamp as number)
		) {
			updateGameStatusTimestamp()
			set(cardRef, _card)
				.then(() =>
					console.log("👁️ [gamewrapper] card set", card, cardId)
				)
				.catch((e) =>
					console.log(
						"👁️ [gamewrapper] Encountered error setting the card",
						e
					)
				)

			// Add the card to the game log
			// e.g. Mila played a card
			// e.g. Mila took a card
			// e.g. Mila played 9 of Hearts
			// e.g. Mila took 9 of Hearts
			// e.g. Mila shuffled a stack

			const stack =
				tableStacksState.get(card.onStack) ||
				handStacksState.get(card.onStack)
			const wasStackVisible =
				stack.stackType === "front" || stack.stackType === "open"
			const wasStackHand = stack.stackType === "hand"

			const logMessage = `${allPlayers.get(userId).name} ${
				wasStackHand ? "took" : "played"
			} ${wasStackVisible ? translateCardName(card.symbol) : "a card"}`

			const handStack = handStacksState.get(userId)
			!wasStackHand
				? handStack.cards.delete(card.cardId)
				: handStack.cards.add(card.cardId)

			const newGameLog: GameLog = gameLogState
				? [
						...gameLogState,
						{
							message: logMessage,
							lastPlayerId: userId,
							lastPlayerCardsOnHand: handStack.cards.size,
						},
				  ]
				: [
						{
							message: logMessage,
							lastPlayerId: userId,
							lastPlayerCardsOnHand: handStack.cards.size,
						},
				  ]

			set(gameLogRef.current, newGameLog)
		} else {
			updateGameStatusTimestamp()
		}
	}

	// Updater Function for the Cards
	// recieves a *SINGLE* Stack object and sets it in the Firebase Database
	const setTableStack = (
		stack: Stack,
		stackId: number,
		timestamp: number
	) => {
		const currentTableStackRef = ref(
			getDatabase(app.current),
			`game/${gameId}/tableStacks/${stackId}`
		)
		console.log(
			"👁️ [gamewrapper] setting user requested stacks with stackpath: ",
			currentTableStackRef,
			" and stack: ",
			stack
		)

		const _stack = { ...stack, cards: Array.from(stack.cards) }

		// Check if timestamp is newer than the latest server timestamp
		if (
			gameStatusState.timestamp &&
			timestamp > (gameStatusState.timestamp as number)
		) {
			updateGameStatusTimestamp()
			set(currentTableStackRef, _stack)
				.then(() =>
					console.log("👁️ [gamewrapper] stack set", stack, stackId)
				)
				.catch((e) =>
					console.log(
						"👁️ [gamewrapper] Encountered error setting the stack",
						e
					)
				)
		} else {
			updateGameStatusTimestamp()
		}
	}

	const setHandStack = (stack: Stack, stackId: number, timestamp: number) => {
		const currentTableStackRef = ref(
			getDatabase(app.current),
			`game/${gameId}/handStacks/${userId}`
		)
		console.log(
			"👁️ [gamewrapper] setting user requested stacks with stackpath: ",
			currentTableStackRef,
			" and stack: ",
			stack
		)

		const _stack = { ...stack, cards: Array.from(stack.cards) }

		// Check if timestamp is newer than the latest server timestamp
		if (
			gameStatusState.timestamp &&
			timestamp > (gameStatusState.timestamp as number)
		) {
			updateGameStatusTimestamp()
			set(currentTableStackRef, _stack)
				.then(() =>
					console.log("👁️ [gamewrapper] stack set", stack, stackId)
				)
				.catch((e) =>
					console.log(
						"👁️ [gamewrapper] Encountered error setting the stack",
						e
					)
				)
		} else {
			updateGameStatusTimestamp()
		}
	}

	const updateGameStatusTimestamp = () => {
		const updatedGameStatus: GameStatus = {
			...gameStatusState,
			timestamp: serverTimestamp(),
		}
		setGameStatus(updatedGameStatus)
	}

	const startGame = () => {
		const distributor = new Distributor(
			deckCards.boundries,
			joker,
			decks,
			0
		)
		distributor.shuffleCards()

		// Convert player map to object
		const _allPlayers = Object.fromEntries(allPlayers)

		distributor.distributeCards(hand, _allPlayers)

		set(cardsRef.current, distributor.cards)
			.then(() => console.log("👁️ [gamewrapper] cards set"))
			.catch((error) =>
				console.log(
					"👁️ [gamewrapper] Encountered error setting cards",
					error
				)
			)
		set(
			tableStacksRef.current,
			convertStacksMapToObject(distributor.stacks)
		)
			.then(() => console.log("👁️ [gamewrapper] stacks set"))
			.catch((error) =>
				console.log(
					"👁️ [gamewrapper] Encountered error setting stacks",
					error
				)
			)
		set(
			handStacksRef.current,
			convertStacksMapToObject(distributor.handStacks)
		)
			.then(() => console.log("👁️ [gamewrapper] hand stacks set"))
			.catch((error) =>
				console.log(
					"👁️ [gamewrapper] Encountered error setting stacks",
					error
				)
			)

		setGameStatus({
			...gameStatusState,
			currentGameState: "game",
		})

		setGameStarted(true)
	}

	const signIn = () => {
		// Connect to Firebase
		signInAnonymously(getAuth(app.current)).catch((error) => {
			// Handle Errors here.
			var errorCode = error.code
			var errorMessage = error.message
			// ...
			console.log(
				"👁️ [gamewrapper] error signing in to no cards needed firebase",
				errorCode,
				errorMessage
			)
		})

		onAuthStateChanged(getAuth(app.current), (user) => {
			// If User is signed in
			if (user) {
				playerRef.current = ref(
					getDatabase(app.current),
					`game/${gameId}/players/${user.uid}`
				)
				set(playerRef.current, {
					id: user.uid,
					name: nameRef.current || "Player",
					cards: [],
					// Random int from 1 to 5 as avatar id
					avatar: Math.ceil(Math.random() * 5),
				})
				setUserId(user.uid)
				onDisconnect(playerRef.current).remove()
				// Connected
				initGame()
			} else {
				// User is signed out
				// ...
				console.log("👁️ [gamewrapper] User is signed out")
			}
		})
	}

	useEffect(() => {
		if (!loading) {
			signIn()
		}
	}, [loading])

	const signOut = () => {
		if (playerRef.current) remove(playerRef.current)
	}

	// Page Load
	useEffect(() => {
		if (state?.name) {
			setName(state.name)
			setLoading(false)
		} else {
			setLoading(true)
		}

		return () => {
			// Cleanup, remove the player from the game
			// if(allPlayersRef.current) {
			// 	console.log("👁️ [gamewrapper] cleanup, removed player from game", userId, allPlayersRef.current);
			// 	allPlayersRef.current.child(userId).remove();
			// }
			console.log(
				"👁️ [gamewrapper] cleanup, removed player from game",
				userId,
				allPlayersRef.current
			)
			signOut()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			{loading ? (
				<Loading
					processCreate={processCreate}
					setProcessCreate={setProcessCreate}
					processJoin={processJoin}
					setProcessJoin={setProcessJoin}
					gameId={gameId}
					setGameId={setGameId}
					setLoading={setLoading}
					setName={setName}
				/>
			) : !gameStarted ? (
				<CreateGame
					deckCards={deckCards}
					setDeckCards={setDeckCards}
					joker={joker}
					setJoker={setJoker}
					decks={decks}
					setDecks={setDecks}
					hand={hand}
					setHand={setHand}
					pile={pile}
					setPile={setPile}
					dropdownContent={dropdownContent}
					players={allPlayers}
					startGame={gameStarted}
					setStartGame={startGame}
					gameId={gameId}
					gameStatus={gameStatusState}
					userId={userId}
					avatars={avatars}
				/>
			) : (
				<PlayingGame
					gameStatus={gameStatusState}
					setGameStatus={setGameStatus}
					userId={userId}
					gameLog={gameLogState}
					syncedCards={cardsState}
					setCard={setCard}
					syncedTableStacks={tableStacksState}
					setTableStack={setTableStack}
					syncedHandStacks={handStacksState}
					setHandStack={setHandStack}
					players={allPlayers}
					avatars={avatars}
				/>
			)}
		</>
	)
}
