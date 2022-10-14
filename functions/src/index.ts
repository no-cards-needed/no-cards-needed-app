import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const refString = "/games/{gameId}/players/{playerId}";
exports.deleteGame = functions.database.ref(refString)
    .onDelete((snapshot, context) => {
      const gameId = context.params.gameId;
      const playerId = context.params.playerId;
      const gameRef: any = snapshot.ref.root.child("games").child(gameId);
      const playerRef = snapshot.ref.root.child("players").child(playerId);

      if (gameRef.child("players").val().numChildren() === 0) {
        gameRef.remove();
        playerRef.remove();
        return Promise.all([
          gameRef.remove(),
          playerRef.remove(),
        ]);
      } else {
        return null;
      }
    });
