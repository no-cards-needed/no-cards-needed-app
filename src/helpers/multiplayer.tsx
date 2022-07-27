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

export const connectToPeer = (peer, sessionId) => {
    return peer.connect(sessionId)
}

export const setupPeerInstance = (
    dataRecievedCallback: (data: any) => void,
    connections: React.MutableRefObject<any[]>, 

) => {
    const tempPeerInstance = createPeer()
    let peerId

    const FATAL_ERRORS = ['invalid-id', 'invalid-key', 'network', 'ssl-unavailable', 'server-error', 'socket-error', 'socket-closed', 'unavailable-id', 'webrtc'];
    tempPeerInstance.on('error', (e: any) => {
        if (FATAL_ERRORS.includes(e.type)) {
            console.log(e)
            tempPeerInstance.reconnect(); // this function waits then tries the entire connection over again
        } else {
            console.log('Non fatal error: ',  e);
        }
    })

    tempPeerInstance.on("open", (id) => {
        console.log("Peer created with id: "+id)
        peerId = id
    })

    tempPeerInstance.on("connection", (conn) => {
        conn.on("data", (data) => {
            dataRecievedCallback(data)
        });
          // @ts-ignore: ID maybe not there
        conn.on("open", (id: string) => {
            console.log(id)
            handleConnectionInstance(tempPeerInstance, connections, id, dataRecievedCallback)
            // New Client connects to the server
            //Sending Cards and Stacks
            conn.send({
                type: "cards",
                data: setDefaultUsedCards()
            })
            conn.send({
                type: "stacks",
                data: setDefaultStacks()
            })
        });
    })

    return tempPeerInstance
}

export const handleConnectionInstance = (
    peerInstance: Peer, 
    connections: React.MutableRefObject<any[]>, 
    peerId: string,
    dataRecieveCallback: (data: any) => void
    ) => {
    
    const connectionIndex = connections.current.push(connectToPeer(peerInstance, peerId)) - 1;
    const connection = connections.current[connectionIndex];

    // handle peer errors
    const FATAL_ERRORS = ['invalid-id', 'invalid-key', 'network', 'ssl-unavailable', 'server-error', 'socket-error', 'socket-closed', 'unavailable-id', 'webrtc'];
    connection.on('error', (e) => {
        if (FATAL_ERRORS.includes(e.type)) {
            console.log(e)
            /*tempPeerInstance.reconnect(e); // this function waits then tries the entire connection over again*/
        } else {
            console.log('Non fatal error: ',  e.type);
        }
    })

    connection.on("open", () => {
        console.log("connected")
        console.log(peerInstance.connections)
    });

    connection.on("data", async (data) => {
        dataRecieveCallback(data)
    })
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