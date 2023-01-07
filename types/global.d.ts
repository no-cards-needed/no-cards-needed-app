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
    stackType: "hand" | "hidden" | "back" | "front",
    cards: number[],
    /**
     * Position of stack in Stack-Grid
     */
    position: {x: number, y: number}
}

type UsedCard = {
    symbol: string,
    onStack: number,
    onStackType: "hand" | "hidden" | "back" | "front"
    hasPlayer: string,

    controlledPosition: {x: number, y: number},
    zIndex: number,
    animation: string,
    movedAside: "left" | "right" | "none"
}