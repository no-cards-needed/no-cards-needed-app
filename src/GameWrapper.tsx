// Firebase Stuff
// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";	
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { ref, getDatabase, set, onValue, push, child, get, update, remove, onDisconnect, onChildAdded } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { useAuthState } from 'react-firebase-hooks/auth';

import { useEffect, useRef, useState } from "react";


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

	// Your web app's Firebase configuration
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional
	const firebaseConfig = {
	apiKey: "AIzaSyCG45BoW8JEIEefb6IbHAkSQgzlqz3EVvM",
	authDomain: "no-cards-needed.firebaseapp.com",
	databaseURL: "https://no-cards-needed-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "no-cards-needed",
	storageBucket: "no-cards-needed.appspot.com",
	messagingSenderId: "917536359159",
	appId: "1:917536359159:web:20c347751643b46b2a09f2",
	measurementId: "G-LDX1SMVPRE"
	};


	// Initialize Firebase
	const app = useRef(firebase.initializeApp(firebaseConfig));
	const analytics = useRef(getAnalytics(app.current));

	const [userId, setUserId] = useState(null);
	const playerRef = useRef(null);

	const allPlayersRef = useRef(null);
	const [allPlayers, setAllPlayers] = useState({});

	const initGame = () => {
		allPlayersRef.current = ref(getDatabase(app.current), 'game/debug/players/')

		onValue(allPlayersRef.current, (snapshot) => {
			// Whenever a change occuts	// 
		})

		onChildAdded(allPlayersRef.current, (snapshot) => {
			const addedPlayer = snapshot.val();

			// New Player
			setAllPlayers((prev) => {
				return {...prev, [addedPlayer.id]: addedPlayer}
			})
		})
	}

	onAuthStateChanged(getAuth(app.current), (user) => {
		if (user) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/firebase.User

			playerRef.current = ref(getDatabase(app.current), 'game/debug/players/' + user.uid)
			set(playerRef.current, {
				id: user.uid,
				name: "",
				cards: [],
				host: true
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

	}, []);

	return (
		<>
			<CreateGame deckCards={deckCards} setDeckCards={setDeckCards} joker={joker} setJoker={setJoker} decks={decks} setDecks={setDecks} hand={hand} setHand={setHand} pile={pile} setPile={setPile} dropdownContent={dropdownContent} players={players}/>
			{Object.values(allPlayers).map((player: any) => {
				
				return <div key={player.id}>{player.name}</div>
			})
			}
		</>
	)
}