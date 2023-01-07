// Firebase Stuff
// Import the functions you need from the SDKs you need
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { ref, getDatabase, set, onValue, onDisconnect, onChildAdded } from "firebase/database";

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PlayingGame from "./PlayingGame";
import { setDefaultStacks, setDefaultUsedCards } from "./helpers/mp";

import CreateGame from "./components/CreateGame.js"

export const GameWrapper = ({app}: {app:any}) => {

	const dropdownContent = [
		[24, " Cards, 9–Ace"],
		[32, " Cards, 7–Ace"],
		[36, " Cards, 6-Ace"],
		[52, " Cards, 2–Ace"],
	  ]

	const [deckCards, setDeckCards] = useState(dropdownContent[0])
    const [joker, setJoker] = useState(0)
    const [decks, setDecks] = useState(1)
    const [hand, setHand] = useState(5)
    const [pile, setPile] = useState(true)
	const [startGame, setStartGame] = useState(false)
	const [gameId, setGameId] = useState("auth")

	// Getting the set User Name
	const {state} = useLocation();
	const {name} = state as {name: string};
	
	const gameStatusRef = useRef(null)
	const [gameStatusState, setGameStatusState] = useState<GameStatus>()
	const defaultGameStatus: (userId: string) => GameStatus = (userId: string) => {
		return {
			host: userId,
			created: new Date(),
			currentGameState: "lobby"
		}
	}

	const [userId, setUserId] = useState(null);
	const playerRef = useRef(null);

	const allPlayersRef = useRef(null);
	const [allPlayers, setAllPlayers] = useState({});
	
	const cardsRef = useRef(null);
	const [cardsState, setCardsState] = useState<Card[]>([]);
	
	const stacksRef = useRef(null);
	const [stacksState, setStacksState] = useState<Stack[]>([]);

	const initGame = () => {

		gameStatusRef.current = ref(getDatabase(app.current), `game/${gameId}/status/`)
		allPlayersRef.current = ref(getDatabase(app.current), `game/${gameId}/players/`)
		cardsRef.current = ref(getDatabase(app.current), `game/${gameId}/cards/`)
		stacksRef.current = ref(getDatabase(app.current), `game/${gameId}/stacks/`)

		// A new player connected to the game
		onValue(allPlayersRef.current, (snapshot) => {

			// If this is the only player, this player is starting the game instance
			if (Object.keys(snapshot.val()).length === 1) {

				// Setting the game status to the initial values
				set(gameStatusRef.current, defaultGameStatus(userId))
					.then(() => console.log("👁️ [gamewrapper] game status set"))
					.catch((error) => console.log("👁️ [gamewrapper] Encountered error setting game status", error));
				
				// Temporatilly setting stacks and cards
				// TODO: Get correct cards from CreateGame.js
				set(cardsRef.current, setDefaultUsedCards())
					.then(() => console.log("👁️ [gamewrapper] cards set"))
					.catch((error) => console.log("👁️ [gamewrapper] Encountered error setting cards", error));
				set(stacksRef.current, setDefaultStacks())
					.then(() => console.log("👁️ [gamewrapper] stacks set"))
					.catch((error) => console.log("👁️ [gamewrapper] Encountered error setting stacks", error));
			}
		})

		// Game Status Value Change in FireBase Realtime Database
		onValue(gameStatusRef.current, (snapshot) => {
			console.log("👁️ [gamewrapper] recieved a new game status: ", snapshot.val())
			setGameStatusState(snapshot.val())
		})

		// Card Value Change in FireBase Realtime Database
		onValue(cardsRef.current, (snapshot) => {
			console.log("👁️ [gamewrapper] recieved new cards: ", snapshot.val());
			setCardsState(snapshot.val());
		})

		// Stack Value Change in FireBase Realtime Database
		onValue(stacksRef.current, (snapshot) => {
			console.log("👁️ [gamewrapper] recieved new stacks: ", snapshot.val());
			setStacksState(snapshot.val());
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
		console.log("👁️ [gamewrapper] setting user requested gameStatus");
		set(gameStatusRef.current, updatedGameStatus)
			.then(() => console.log("👁️ [gamewrapper] game status set"))
			.catch((e) => console.log("👁️ [gamewrapper] Encountered error setting game status", e))
	}

	// Updater Function for the Cards
	// recieves a *SINGLE* Card object and sets it in the Firebase Database
	const setCard = (card: Card, cardId: number) => {
		console.log("👁️ [gamewrapper] setting user requested cards");
		set(cardsRef.current.child(cardId), card)
			.then(() => console.log("👁️ [gamewrapper] card set"))
			.catch((e) => console.log("👁️ [gamewrapper] Encountered error setting the card", e))
	}

	// Updater Function for the Cards
	// recieves a *SINGLE* Stack object and sets it in the Firebase Database
	const setStack = (stack: Stack, stackId: number) => {
		console.log("👁️ [gamewrapper] setting user requested stacks");
		set(stacksRef.current.child(stackId), stack)
			.then(() => console.log("👁️ [gamewrapper] stack set"))
			.catch((e) => console.log("👁️ [gamewrapper] Encountered error setting the stack", e))
	}

	// Page Load
	useEffect(() => {
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

		return() => {
		}

	}, []);

	return (
		<>
			{!startGame ? <CreateGame 
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
				startGame={startGame}
				setStartGame={setStartGame}
				gameId={"jkhasjghf"}
			/> : <PlayingGame 
				gameStatus={gameStatusState}
				setGameStatus={setGameStatus}

				syncedCards={cardsState}
				setCard={setCard}
				
				syncedStacks={stacksState}
				setStack={setStack}
			/>}
		</>
	)
}