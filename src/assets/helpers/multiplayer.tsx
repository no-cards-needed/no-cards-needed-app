import Peer from "peerjs"
import { generateLobbyString } from "./words";

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
    const peer = new Peer(randomString())

    return peer
}

const createServer = () => {
    const server = new Peer(generateLobbyString())

    return server
}

export const connectToGame = (peer, sessionId) => {
    const connection = peer.connect(sessionId)

    return connection
}

export const setDefaultStacks = () => {
    return [
        {
            id: 0,
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
            }
        },
        {
            id: 1,
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
            }
        },
        {
            id: 2,
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
            }
        },
        {
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
            }
        },
    ]
}

export const setDefaultUsedCards = () => {
    return [
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
            animation: "none"
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
            animation: "none"
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
            animation: "none"
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
            animation: "none"
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
            animation: "none"
        },
    ]
}