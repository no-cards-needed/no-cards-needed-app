// Firebase Stuff
// Import the functions you need from the SDKs you need
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { ref, getDatabase, set, onValue, onDisconnect, onChildAdded, serverTimestamp } from "firebase/database";

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { setDefaultStacks, setDefaultUsedCards } from "./helpers/mp";

import CreateGame from "./components/CreateGame"
import Loading from "./components/Loading"
import PlayingGame from "./PlayingGame"

import { miniCards } from "./helpers/Cards";
import { Distributor } from "./helpers/distributor/distributor";
import useAsyncReference from "./helpers/hooks/useAsyncReference";

export const GameWrapper = ({app}: {app:any}) => {

	const dropdownContent: DropdownContent[] = [
		{
			count: 24,
			text: '9 to ACE',
			src: miniCards.d9,
			boundries: {
				from: 9,
				to: 14
			}
		},
		{
			count: 32,
			text: '6 to ACE',
			src: miniCards.d6,
			boundries: {
				from: 6,
				to: 14
			}
		},
		{
			count: 36,
			text: '7 to ACE',
			src: miniCards.d7,
			boundries: {
				from: 7,
				to: 14
			}
		},
		{
			count: 52,
			text: '2 to ACE',
			src: miniCards.d2,
			boundries: {
				from: 2,
				to: 14
			}
		},
	]

	const avatars = [
		{
			src: '../assets/avatars/avatar-1.svg'
		},
		{
			src: '../assets/avatars/avatar-2.svg'
		},
		{
			src: '../assets/avatars/avatar-3.svg'
		},
		{
			src: '../assets/avatars/avatar-4.svg'
		},
		{
			src: '../assets/avatars/avatar-5.svg'
		},
	]

	const [deckCards, setDeckCards] = useState(dropdownContent[0])
    const [joker, setJoker] = useState(0)
    const [decks, setDecks] = useState(1)
    const [hand, setHand] = useState(5)
    const [pile, setPile] = useState(true)
	const [gameStarted, setGameStarted] = useState(false)
	const [ loading, setLoading ] = useState(false)

	// TODO: Generate Random room name
	const [gameId, setGameId] = useState("auth")

	// Getting the set User Name
	const {state} = useLocation();
	// const [name, setName] = useState<String>()
	const [name, setName] = useStateRef<String>("")

	const gameStatusRef = useRef(null)
	const [gameStatusState, setGameStatusState] = useState<GameStatus>()
	const defaultGameStatus: (userId: string) => GameStatus = (userId: string) => {
		return {
			host: userId,
			created: serverTimestamp(),
			currentGameState: "lobby",
			timestamp: serverTimestamp(),
		}
	}

	const [userId, setUserId] = useState<string>(null);
	const playerRef = useRef(null);

	const allPlayersRef = useRef(null);
	const [allPlayers, setAllPlayers] = useState<ListOfPlayers>({});
	
	const cardsRef = useRef(null);
	const [cardsState, setCardsState] = useState<Card[]>([]);
	
	const stacksRef = useRef(null);
	const [stacksState, setStacksState] = useState<Stack[]>([]);

	const [ processCreate, setProcessCreate ] = useState( true )
	const [ processJoin, setProcessJoin ] = useState( false )

	const initGame = () => {

		gameStatusRef.current = ref(getDatabase(app.current), `game/${gameId}/gameStatus/`)
		allPlayersRef.current = ref(getDatabase(app.current), `game/${gameId}/players/`)
		cardsRef.current = ref(getDatabase(app.current), `game/${gameId}/cards/`)
		stacksRef.current = ref(getDatabase(app.current), `game/${gameId}/stacks/`)

		// A new player connected to the game
		onValue(allPlayersRef.current, (snapshot) => {
			// If this is the only player, this player is starting the game instance

			// TODO: When only two players are playing and one refreshes the page, this is re-triggered
			if (snapshot.val() && Object.keys(snapshot.val()).length === 1) {
				console.log("👁️ [gamewrapper] this is the first player, setting up the game", snapshot.val())
				const gameStatus = defaultGameStatus(Object.keys(snapshot.val())[0])
				
				// Check if the game is already started by comparing the gamestatus timestamp with servertimestamp()
				// If the game is already started, then the game is already set up
				// If the game is not started, then set up the game
				if (!gameStatusState || gameStatusState.timestamp < gameStatus.timestamp) {
					// Setting the game status to the initial values
					set(gameStatusRef.current, gameStatus)
						.then(() => console.log("👁️ [gamewrapper] game status set", gameStatus))
						.catch((error) => console.log("👁️ [gamewrapper] Encountered error setting game status", error));
				} else {
					console.log("👁️ [gamewrapper] game already started, skipping setup", gameStatusState, gameStatus)
				}
			}
		})

		// Game Status Value Change in FireBase Realtime Database
		onValue(gameStatusRef.current, (snapshot) => {
			// console.log("👁️ [gamewrapper] recieved a new game status: ", snapshot.val())
			const newGameStatus: GameStatus = snapshot.val()
			setGameStatusState(newGameStatus)
			setGameStarted(newGameStatus?.currentGameState === "game")
		})

		// Card Value Change in FireBase Realtime Database
		onValue(cardsRef.current, (snapshot) => {
			// console.log("👁️ [gamewrapper] recieved new cards: ", snapshot.val());
			setCardsState(snapshot.val());
		})

		// Stack Value Change in FireBase Realtime Database
		onValue(stacksRef.current, (snapshot) => {
			console.log("👁️ [gamewrapper] recieved new stacks: ", snapshot.val());
			const newStacks = snapshot.val()
			
			if(newStacks) {
				for (let i = 0; i < newStacks.length; i++) {
					if (!newStacks[i].cards) {
						newStacks[i].cards = [];
					}
				}
				setStacksState(newStacks);
			}
		})

		// Add the new player to the "allPlayers" state
		onChildAdded(allPlayersRef.current, (snapshot) => {
			const addedPlayer = snapshot.val();

			// New Player
			setAllPlayers((prev) => {
				return {...prev, [addedPlayer.id]: addedPlayer}
			})
		})
	}

	// Updater Function for the Game Status
	// recieves a GameStatus object and sets it in the Firebase Database
	const setGameStatus = (updatedGameStatus: GameStatus) => {
		// console.log("👁️ [gamewrapper] setting user requested gameStatus");
		set(gameStatusRef.current, updatedGameStatus)
			// .then(() => console.log("👁️ [gamewrapper] game status set", updatedGameStatus))
			.catch((e) => console.log("👁️ [gamewrapper] Encountered error setting game status", e))
	}

	// Updater Function for the Cards
	// recieves a *SINGLE* Card object and sets it in the Firebase Database
	const setCard = (card: Card, cardId: number, timestamp: number) => {
		const cardRef = ref(getDatabase(app.current), `game/${gameId}/cards/${cardId}`)
		// console.log("👁️ [gamewrapper] setting user requested cards with path: ", cardRef, "and the timestamps: ", timestamp, gameStatusState.timestamp);

		// Check if timestamp is newer than the latest server timestamp
		if (gameStatusState.timestamp && timestamp > gameStatusState.timestamp) {
			updateGameStatusTimestamp()
			set(cardRef, card)
				// .then(() => console.log("👁️ [gamewrapper] card set", card, cardId))
				.catch((e) => console.log("👁️ [gamewrapper] Encountered error setting the card", e))
		} else {
			updateGameStatusTimestamp()
		}
	}

	// Updater Function for the Cards
	// recieves a *SINGLE* Stack object and sets it in the Firebase Database
	const setStack = (stack: Stack, stackId: number, timestamp: number) => {
		const stackRef = ref(getDatabase(app.current), `game/${gameId}/stacks/${stackId}`)
		console.log("👁️ [gamewrapper] setting user requested stacks with stackpath: ", stackRef, " and stack: ", stack);

		// Check if timestamp is newer than the latest server timestamp
		if (gameStatusState.timestamp && timestamp > gameStatusState.timestamp) {
			updateGameStatusTimestamp()
			set(stackRef, stack)
				.then(() => console.log("👁️ [gamewrapper] stack set", stack, stackId))
				.catch((e) => console.log("👁️ [gamewrapper] Encountered error setting the stack", e))
		} else {
			updateGameStatusTimestamp()
		}
	}

	const updateGameStatusTimestamp = () => {
		const updatedGameStatus: GameStatus = {...gameStatusState, timestamp: serverTimestamp()}
		setGameStatus(updatedGameStatus)
	}

	const startGame = () => {
		const distributor = new Distributor(deckCards.boundries, joker, decks, 2);
		distributor.shuffleCards();

		distributor.distributeCards(hand, allPlayers)

		set(cardsRef.current, distributor.cards)
			.then(() => console.log("👁️ [gamewrapper] cards set"))
			.catch((error) => console.log("👁️ [gamewrapper] Encountered error setting cards", error));
		set(stacksRef.current, distributor.stacks)
			.then(() => console.log("👁️ [gamewrapper] stacks set"))
			.catch((error) => console.log("👁️ [gamewrapper] Encountered error setting stacks", error));

		setGameStatus({
			...gameStatusState,
			currentGameState: "game"
		})

		setGameStarted(true);
	}

	// Page Load
	useEffect(() => {
		state?.name ? setName(state.name) : (setLoading(true))
		console.log(`state.name = ${state?.name}`)
		console.log(loading)

		// Connect to Firebase
		signInAnonymously(getAuth(app.current)).catch((error) => {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
			console.log("👁️ [gamewrapper] error signing in to no cards needed firebase", errorCode, errorMessage);
		});

		onAuthStateChanged(getAuth(app.current), (user) => {
			// If User is signed in
			if (user) {
				playerRef.current = ref(getDatabase(app.current), `game/${gameId}/players/${user.uid}`)
				set(playerRef.current, {
					id: user.uid,
					name: name || "Player",
					cards: [],
					// Random int from 1 to 5 as avatar id
					avatar: Math.ceil(Math.random() * 5)
				})
				setUserId(user.uid);

				onDisconnect(playerRef.current).remove();
	
				// Connected
				initGame()
			} else {
				// User is signed out
				// ...
				console.log("👁️ [gamewrapper] User is signed out");
			}
		});

		return () => {
			// Cleanup, remove the player from the game
			// if(allPlayersRef.current) {
			// 	console.log("👁️ [gamewrapper] cleanup, removed player from game", userId, allPlayersRef.current);
			// 	allPlayersRef.current.child(userId).remove();
			// }
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{
			loading ? <Loading 
			processCreate={processCreate}
			setProcessCreate={setProcessCreate}
			processJoin={processJoin}
			setProcessJoin={setProcessJoin}
			gameId={gameId}
			setGameId={setGameId}
			setLoading={setLoading}
			setName={setName}
			/> : !gameStarted ? <CreateGame 
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
			/> : <PlayingGame 
				gameStatus={gameStatusState}
				setGameStatus={setGameStatus}
				userId={userId}
				syncedCards={cardsState}
				setCard={setCard}
				
				syncedStacks={stacksState}
				setStack={setStack}
				players={allPlayers} 
				avatars={avatars}
			/>
			}
		</>
	)
}