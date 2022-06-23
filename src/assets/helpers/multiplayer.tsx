import Peer from "peerjs"

const randomString = (length = 5) => {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
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

export const connectToGame = (peer, sessionId) => {
    const connection = peer.connect(sessionId)

    return connection
}