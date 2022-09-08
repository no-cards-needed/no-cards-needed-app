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

export const GameWrapper = () => {

	const dropdownContent = [
		[24, " Cards, 9–Ace"],
		[32, " Cards, 7–Ace"],
		[36, " Cards, 6-Ace"],
		[52, " Cards, 2–Ace"],
	  ]

	const players = [
		"Milla", 
		"Kleo", 
		"Hannibal", 
		"Kalle" 
	]

	const [deckCards, setDeckCards] = useState(dropdownContent[0])
    const [joker, setJoker] = useState(0)
    const [decks, setDecks] = useState(1)
    const [hand, setHand] = useState(5)
    const [pile, setPile] = useState(true)


	// TODO: Add SDKs for Firebase products that you want to use
	// https://firebase.google.com/docs/web/setup#available-libraries

	const {state} = useLocation();
	const {name} = state as {name: string};
	

	const [userId, setUserId] = useState(null);
	const playerRef = useRef(null);

	const allPlayersRef = useRef(null);
	const [allPlayers, setAllPlayers] = useState({});

	const usedCardsRef = useRef(null);
	const stacksRef = useRef(null);
	const [usedCardsState, setUsedCardsState] = useState([]);
	const [stacksState, setStacksState] = useState([]);

	const initGame = () => {
		console.log("initGame");
		allPlayersRef.current = ref(getDatabase(app.current), 'game/debug_/players/')
		usedCardsRef.current = ref(getDatabase(app.current), 'game/debug_/usedCards/')
		stacksRef.current = ref(getDatabase(app.current), 'game/debug_/stacks/')

		onValue(allPlayersRef.current, (snapshot) => {
			// Whenever a change occuts	// 
			console.log("all players", snapshot.val());

			// If this is the only player, set usedCardsRef and stacksRef
			if (Object.keys(snapshot.val()).length === 1) {
				// Temporatilly setting stacks and cards
				set(usedCardsRef.current, setDefaultUsedCards());
				set(stacksRef.current, setDefaultStacks());

				// Sets the last player to be the host
				update(playerRef.current, {host: true});
			}
		})

		onValue(usedCardsRef.current, (snapshot) => {
			console.log("usedCardsRef change", snapshot.val());
			setUsedCardsState(snapshot.val());
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

	

	const setUsedCards = (usedCards) => {
		console.log("setUsedCards");
		set(usedCardsRef.current, usedCards);
	}
	const setStacks = (stacks) => {
		console.log("setStacks");
		set(stacksRef.current, stacks);
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
			if (allPlayers[userId] && allPlayers[userId].host) {
				// Get the first player in the list
				const firstPlayerId = Object.keys(allPlayers)[0];
				update(ref(getDatabase(app.current), 'game/debug_/players/' + firstPlayerId), {host: true});
			}
		}

	}, []);

	return (
		<>
		{Object.values(allPlayers).map((player: any) => {
			return <div key={player.id}>{player.name}-{player.host ? "Host" : ""}</div>
		})
		}
		<PlayingGame 
			usedCardsFirebase={usedCardsState}
			stacks={stacksState}
			setStacks={setStacks}
		/>
			<CreateGame deckCards={deckCards} setDeckCards={setDeckCards} joker={joker} setJoker={setJoker} decks={decks} setDecks={setDecks} hand={hand} setHand={setHand} pile={pile} setPile={setPile} dropdownContent={dropdownContent} players={players}/>
			{Object.values(allPlayers).map((player: any) => {
				
				return <div key={player.id}>{player.name}</div>
			})
			}
		</>
	)
}