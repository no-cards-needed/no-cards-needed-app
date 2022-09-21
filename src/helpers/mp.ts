import { cards } from "./Cards"

export const setDefaultStacks = () => {
    return {
        1: {
            stackType: "hidden",
            cards: {},
            position: {x: 0, y: 0}
        },
        2: {
            stackType: "back",
            cards: {},
            position: {x: 0, y: 0}
        },
        3: {
            stackType: "front",
            cards: {},
            position: {x: 0, y: 0}
        },
    }
}

export const setDefaultUsedCards = () => {
    const defCards = cards.map((card, index) => {
        return {
            symbol: card.name,
            onStack: 1,
            hasPlayer: null
        }
    })
    return defCards
}