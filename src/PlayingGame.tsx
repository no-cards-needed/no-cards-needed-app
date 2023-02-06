import useAsyncReference from "./helpers/hooks/useAsyncReference"

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
	}: PlayingGameProps) {

		const usedCards = useAsyncReference<UsedCard[]>([])
		const usedStacks = useAsyncReference<Stack[]>([])

		const placeCard = (cardId: number, stackId: number, userInitiated: Boolean = false) => {


			if (userInitiated) {
				sendCard(usedCards.current[cardId], cardId, Date.now())
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
				<div><Toaster /></div>
				<div className='backgroundElement'></div>
				<div className="playingArea criticalMaxWidth">
				{
					usedStacks.map((stack: Stack, stackId: number) => {
						if(stack.stackType !== "hand" && stack.stackType !== "hidden") {
							return (
								<Stack key={stack.id} stackType={stack.stackType} stackRef={(el: HTMLDivElement) => stackRef.current[stackId] = el}/>
							)
						} else return null
					})
				}
				</div>

				<div className="cards">
					{
						typeof usedCards[Symbol.iterator] === 'function' ? usedCards?.map((card: UsedCard, cardId: number) => {
							return <Card 
									setRef={setCardRef} 
									card={card} 
									cardId={cardId}
									key={cardId}
									shuffle={() => {}}
									handleLongPress={() => {}}
									handleCardDrag={(cardRef, cardId) => handleCardDrag(cardRef, cardId, usedCardsRef.current, setUsedCards, getNearestStack, nearestStack, setNearestStack, usedStacks, controlledStacks, setIsColliding)} 
									handleCardDrop={(data, id) => handleCardDrop(id, usedCards, setUsedCards, isColliding, nearestStack, setCards)} />
						}) : <DebugComponent error={usedCards} />
					}
				</div>

				<GameHeader />

				<div className="hand criticalMaxWidth" id="basicDrop">
					<Stack key={"handStack"} stackType={usedStacks[0].stackType} stackRef={(el: HTMLDivElement) => stackRef.current[0] = el}/>
				</div>

				<Stack key={"hiddenStack"} stackType={usedStacks[1].stackType} stackRef={(el: HTMLDivElement) => stackRef.current[1] = el}/>
			</div>
		</div>
	);
}

export default PlayingGame;
