import Peer from "peerjs"

import {cards} from "./Cards";
import {generateLobbyString} from "./words";
import toast from "react-hot-toast";

const randomString = (length = 5) => {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const createPeer = (peerId) => {

    return new Peer(peerId)
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
    gameId: string
) => {

    let peerId
    if(gameId === "new") {
        peerId = generateLobbyString()
        dataRecievedCallback({type: "lobby", data: {lobbyString: peerId}})
    } else {
        peerId = randomString()
    }
    const tempPeerInstance = createPeer(peerId)


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
            console.log("Someone Connected: "+id)
            handleConnectionInstance(tempPeerInstance, connections, id, dataRecievedCallback)
            // New Client connects to the server
            //Sending Cards and Stacks
            conn.send({
                type: "cards",
                data: {
                    cards: setDefaultUsedCards()
                }
            })
            conn.send({
                type: "stacks",
                data: {
                    stacks: setDefaultStacks()
                }
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
    console.log("Handling Connection Instance; Connecting to: "+peerId, peerInstance, connections)
    if (connections.current.find((connection) => connection.peerId === peerId)) {
        return
    }

/*
    // Filter out previous failed connection attempts where the peerId in the connections array is "undefined"
    connections.current = connections.current.filter((connection) => connection.peerId !== undefined)
*/
    console.log(peerId, peerInstance.id)
    if (peerId && peerInstance.id) {
        console.log("Connecting to: "+peerId)

        const connectionIndex = connections.current.push({connection: connectToPeer(peerInstance, peerId), peerId}) - 1;
        const connection = connections.current[connectionIndex].connection;

        // handle peer errors
        const FATAL_ERRORS = ['invalid-id', 'invalid-key', 'network', 'ssl-unavailable', 'server-error', 'socket-error', 'socket-closed', 'unavailable-id', 'webrtc'];
        connection.on('error', (e) => {
            toast.error(e)
            if (FATAL_ERRORS.includes(e.type)) {
                console.log(e)
                /*tempPeerInstance.reconnect(e); // this function waits then tries the entire connection over again*/
            } else {
                console.log('Non fatal error: ',  e.type);
            }
        })

        connection.on("open", () => {
            toast.success("Connected")
            console.log("connected")
            connection.send({
                type: "newConnection",
                data: {
                    id: peerInstance.id
                }
            })
        });

        connection.on("data", async (data) => {
            dataRecieveCallback(data)
        })
    }
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