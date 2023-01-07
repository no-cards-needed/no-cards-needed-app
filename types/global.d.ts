type GameStatus = {
    host: string,
    created: Date,
    currentGameState: "lobby" | "game"
} 

type Card = {
    symbol: string,
    onStack: number,
    hasPlayer: string
}

type Stack = {
    /**
     * Type of stack
     * 
     * can be "hidden", "back", "front"
     */
    stackType: string,
    cards: number[],
    /**
     * Position of stack in Stack-Grid
     */
    position: {x: number, y: number}
}

type UsedCards = {
    symbol: string,
    onStack: number,
    hasPlayer: string,

    controlledPosition: {x: 0, y: 0},
    zIndex: number,
    animation: string,
}