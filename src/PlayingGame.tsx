import { useRef, useState } from "react"
import Card from "./components/Card"
import { DebugComponent } from "./components/Debug"
import GameHeader from "./components/GameHeader"
import { Stack } from "./components/Stack"
import { handleCardDrag } from "./helpers/handle-card-drag"
import { handleCardDrop } from "./helpers/handle-card-drop"
import useStateRef from "./helpers/hooks/useStateRef"

type PlayingGameProps = {
	gameStatus: GameStatus,
	setGameStatus: (gameStatus: GameStatus) => void,
	userId: string,

	syncedCards: Card[], 
	setCard: (card: Card, cardId: number, timestamp: number) => void,
	
	syncedStacks: Stack[], 
	setStack: (stack: Stack, stackId: number, timestamp: number) => void
	players: {
		[id: string]: {
			name: string,
			id: string,
			avatar: 1 | 2 | 3 | 4 | 5
		}
	},
	avatars: {
		src: string
	}[]
}

function PlayingGame({
		gameStatus,
		setGameStatus,
		userId,

		syncedCards, 
		setCard,

		syncedStacks, 
		setStack,

		players,
		avatars,
	}: PlayingGameProps) {

		const [usedCards, setUsedCards, usedCardsRef] = useStateRef<UsedCard[]>([])
		const cardsDomRef = useRef<HTMLDivElement[]>([])
		const [usedStacks, setUsedStacks, usedStacksRef] = useStateRef<Stack[]>([])
		const stacksDomRef = useRef<HTMLDivElement[]>([])

		const [nearestStack, setNearestStack] = useState<NearestStack>(null);
		const [isColliding, setIsColliding] = useState<boolean>(false);

		const placeCard = (cardId: number, stackId: number, userInitiated: boolean = false) => {


			if (userInitiated) {
				sendCard(usedCardsRef.current[cardId], cardId)
			}
		}
		const recieveCards = () => {

		}
		const sendCard = (card: Card, cardId: number) => {
			setCard(card, cardId, Date.now())
		}

		const recieveStacks = () => {

		}
		const sendStack = (stack: Stack, stackId: number) => {
			setStack(stack, stackId, Date.now())
		}

	return (
		<div>
			<div style={{background: "#DEDBE5", position: "fixed"}}>
				<div className='backgroundElement'></div>
				<div className="playingArea criticalMaxWidth">
				{
					usedStacks.map((stack: Stack, stackId: number) => {
						if(stack.stackType !== "hand" && stack.stackType !== "hidden") {
							return (
								<Stack key={stack.id} stackType={stack.stackType} stackRef={(el: HTMLDivElement) => stacksDomRef.current[stackId] = el}/>
							)
						} else return null
					})
				}
				</div>

				<div className="cards">
					{
						typeof usedCards[Symbol.iterator] === 'function' ? usedCards?.map((card: UsedCard, cardId: number) => {
							return <Card 
									setRef={(cardRef: HTMLDivElement) => cardsDomRef.current[cardId] = cardRef} 
									card={card} 
									cardId={cardId}
									key={cardId}
									shuffle={() => {}}
									handleLongPress={() => {}}
									handleCardDrag={(cardRef, cardId) => handleCardDrag(cardRef, cardId, usedCardsRef.current, setUsedCards, nearestStack, setNearestStack, usedStacksRef, stacksDomRef, setIsColliding)} 
									handleCardDrop={(data, id) => handleCardDrop(id, usedCards, setUsedCards, isColliding, nearestStack, placeCard)} />
						}) : <DebugComponent error={usedCards} />
					}
				</div>

				<GameHeader players={players} gameStatus={gameStatus} avatars={avatars} />

				<div className="hand criticalMaxWidth" id="basicDrop">
					<Stack key={"handStack"} stackType={usedStacks[0].stackType} stackRef={(el: HTMLDivElement) => stacksDomRef.current[0] = el}/>
				</div>

				<Stack key={"hiddenStack"} stackType={usedStacks[1].stackType} stackRef={(el: HTMLDivElement) => stacksDomRef.current[1] = el}/>
			</div>
		</div>
	);
}

export default PlayingGame;
