import Peer from "peerjs"

import {cards} from "./Cards";

const randomString = (length = 5) => {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const createPeer = () => {
    return new Peer(randomString())
}

export const createServer = (gameId: string) => {
    return new Peer(gameId)
}

export const connectToGame = (peer, sessionId) => {
    return peer.connect(sessionId)
}

export const handleConnectionInstance = () => {


}

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
            height: 200,
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
            height: 200,
            width: 300,
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
            height: 200,
            width: 300,
            position: {
                x: 0,
                y: 0
            },
            ref: null
        },
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