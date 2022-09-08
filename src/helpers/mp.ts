import { cards } from "./Cards"

export const setDefaultStacks = () => {
    return [
        {
            id: 0,
            stackType: "hidden",
            orientation: "back",
            cards: [],
            currentlyNearest: false,
            colliding: false,
            distance: 0,
            height: 200,
            width: 300,
            position: {
                x: 0,
                y: 0
            },
            ref: null
        },
        {
            id: 1,
            stackType: "hand",
            orientation: "front",
            cards: [],
            currentlyNearest: false,
            colliding: false,
            distance: 0,
            height: 144,
            width: 300,
            position: {
                x: 0,
                y: 0
            },
            ref: null
        },
        {
            id: 2,
            stackType: "stack",
            orientation: "back",
            cards: [],
            currentlyNearest: false,
            colliding: false,
            distance: 0,
            height: 112,
            width: 80,
            position: {
                x: 0,
                y: 0
            },
            ref: null
        },
        {
            id: 3,
            stackType: "stack",
            orientation: "front",
            cards: [],
            currentlyNearest: false,
            colliding: false,
            distance: 0,
            height: 112,
            width: 80,
            position: {
                x: 0,
                y: 0
            },
            ref: null
        },
        // {
        //     id: 4,
        //     stackType: "stack",
        //     orientation: "front",
        //     cards: [],
        //     currentlyNearest: false,
        //     colliding: false,
        //     distance: 0,
        //     height: 112,
        //     width: 80,
        //     position: {
        //         x: 0,
        //         y: 0
        //     },
        //     ref: null
        // },
        // {
        //     id: 5,
        //     stackType: "stack",
        //     orientation: "front",
        //     cards: [],
        //     currentlyNearest: false,
        //     colliding: false,
        //     distance: 0,
        //     height: 112,
        //     width: 80,
        //     position: {
        //         x: 0,
        //         y: 0
        //     },
        //     ref: null
        // },
/*        {
            id: 3,
            stackType: "openStack",
            orientation: "front",
            cards: [],
            currentlyNearest: false,
            colliding: false,
            distance: 0,
            height: 200,
            width: 300,
            position: {
                x: 0,
                y: 0
            },
            ref: null
        },*/
    ]
}

export const setDefaultUsedCards = () => {
    const defCards = cards.map((card, index) => {
        return {
            id: index,
            symbol: card.name,
            controlledPosition: {
                x: 0,
                y: 0
            },
            zIndex: 0,
            movedAside: "false",
            onStackType: "none",
            ref: null,
            animation: "none",
            orientation: "front"
        }
    })
    return defCards
    /*return [
        {
            id: 0,
            symbol: "10C",
            controlledPosition: {
                x: 0,
                y: 0
            },
            zIndex: 0,
            movedAside: "false",
            onStackType: "none",
            ref: null,
            animation: "none",
            orientation: "front"
        },
        {
            id: 1,
            symbol: "10D",
            controlledPosition: {
                x: 0,
                y: 0
            },
            zIndex: 0,
            movedAside: "false",
            onStackType: "none",
            ref: null,
            animation: "none",
            orientation: "front"
        },
        {
            id: 2,
            symbol: "10H",
            controlledPosition: {
                x: 0,
                y: 0
            },
            zIndex: 0,
            movedAside: "false",
            onStackType: "none",
            ref: null,
            animation: "none",
            orientation: "front"
        },
        {
            id: 3,
            symbol: "10H",
            controlledPosition: {
                x: 0,
                y: 0
            },
            zIndex: 0,
            movedAside: "false",
            onStackType: "none",
            ref: null,
            animation: "none",
            orientation: "front"
        },
        {
            id: 4,
            symbol: "9H",
            controlledPosition: {
                x: 0,
                y: 0
            },
            zIndex: 0,
            movedAside: "false",
            onStackType: "none",
            ref: null,
            animation: "none",
            orientation: "front"
        },
    ]*/
}