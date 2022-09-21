declare interface Card {
    symbol: string,
    onStack: number,
    hasPlayer: string
}

declare interface Stack {
    /**
     * Type of stack
     * 
     * can be "hidden", "back", "front"
     */
    stackType: string,
    cards: {
        0: Card,
    },
    /**
     * Position of stack in Stack-Grid
     */
    position: {x: number, y: number}
}

declare interface UsedCards {
    symbol: string,
    onStack: number,
    hasPlayer: string,

    controlledPosition: {x: 0, y: 0},
    zIndex: number,
    animation: string,
}