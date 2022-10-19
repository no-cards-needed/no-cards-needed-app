// Firebase Stuff
// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";	
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { ref, getDatabase, set, onValue, push, child, get, update, remove, onDisconnect, onChildAdded } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { useAuthState } from 'react-firebase-hooks/auth';

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PlayingGame from "./PlayingGame";
import { setDefaultStacks, setDefaultUsedCards } from "./helpers/mp";


import CreateGame from "./components/CreateGame.js"
import { textChangeRangeIsUnchanged } from "typescript";

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
	const [ganmeId, setGameId] = useState("auth")

	// Getting the set User Name
	const {state} = useLocation();
	const {name} = state as {name: string};
	

	const [userId, setUserId] = useState(null);
	const playerRef = useRef(null);

	const allPlayersRef = useRef(null);
	const [allPlayers, setAllPlayers] = useState({});

	const cardsRef = useRef(null);
	const stacksRef = useRef(null);
	const [cardsState, setCardsState] = useState({});
	const [stacksState, setStacksState] = useState({});

	const initGame = () => {

		allPlayersRef.current = ref(getDatabase(app.current), 'game/debug_/players/')
		cardsRef.current = ref(getDatabase(app.current), 'game/debug_/cards/')
		stacksRef.current = ref(getDatabase(app.current), 'game/debug_/stacks/')

		onValue(allPlayersRef.current, (snapshot) => {
			// Whenever a change occuts	// 

			// If this is the only player, set cardsRef and stacksRef
			if (Object.keys(snapshot.val()).length === 1) {
				// Temporatilly setting stacks and cards
				set(cardsRef.current, setDefaultUsedCards()).then(() => console.log("data saved")).catch((error) => console.log(error));
				set(stacksRef.current, setDefaultStacks());

				// Sets the last player to be the host
				update(playerRef.current, {host: true});
			}
		})

		onValue(cardsRef.current, (snapshot) => {
			console.log("cardsRef change", snapshot.val());
			setCardsState(snapshot.val());
		})

		onValue(stacksRef.current, (snapshot) => {
			console.log("stacksRef change", snapshot.val());
			setStacksState(snapshot.val());
		})

		onChildAdded(allPlayersRef.current, (snapshot) => {
			const addedPlayer = snapshot.val();

			// New Player
			setAllPlayers((prev) => {
				return {...prev, [addedPlayer.id]: addedPlayer}
			})
		})
	}

	

	const setCard = (card, cardId) => {
		console.log("setcards");
		set(cardsRef.current.child(cardId), card);
	}
	const setStack = (stack, stackId) => {
		console.log("setStacks");
		set(stacksRef.current.child(stackId), stack);
	}


	// Page Load
	useEffect(() => {
		// Connect to Firebase
		signInAnonymously(getAuth(app.current)).catch((error) => {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...
			console.log(errorCode, errorMessage);
		});

		console.log(allPlayers)

		onAuthStateChanged(getAuth(app.current), (user) => {
			if (user) {
				// User is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/firebase.User
	
				playerRef.current = ref(getDatabase(app.current), 'game/debug_/players/' + user.uid)
				set(playerRef.current, {
					id: user.uid,
					name: name || "Player",
					cards: [],
					host: false
				})
				setUserId(user.uid);

				onDisconnect(playerRef.current).remove();
	
	
				// Connected
				initGame()
	
			} else {
				// User is signed out
				// ...
				console.log("User is signed out");
			}
		});

		return() => {
			// Assign another player to be the host if leaving player is the host
			// if (allPlayers[userId] && allPlayers[userId].host) {
			// 	// Get the first player in the list
			// 	const firstPlayerId = Object.keys(allPlayers)[0];
			// 	update(ref(getDatabase(app.current), 'game/debug_/players/' + firstPlayerId), {host: true});
			// }
		}

	}, []);

	return (
		<>
		{/* {Object.values(allPlayers).map((player: any) => {
			return <div key={player.id}>{player.name}-{player.host ? "Host" : ""}</div>
		})
		} */}

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
			syncedCards={cardsState}
			syncedStacks={stacksState}
			setCard={setCard}
			setStack={setStack}
		/>}
			{/* <CreateGame deckCards={deckCards} setDeckCards={setDeckCards} joker={joker} setJoker={setJoker} decks={decks} setDecks={setDecks} hand={hand} setHand={setHand} pile={pile} setPile={setPile} dropdownContent={dropdownContent} players={players}/> */}

		</>
	)
}