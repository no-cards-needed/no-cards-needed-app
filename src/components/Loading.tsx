import ModalEnter from "./ModalEnter"


function Loading( {
  processCreate,
  setProcessCreate,
  processJoin,
  setProcessJoin,
  gameId,
  setGameId,
  setLoading,
  setName
} : {
  processCreate: boolean,
  setProcessCreate: (processCreate: boolean) => void,
  processJoin: boolean,
  setProcessJoin: (processJoin: boolean) => void,
  gameId: string,
  setGameId: (newID: string) => void,
  setLoading: (loading: boolean) => void
  setName: (name: string) => void,
  
  } ) {

    return (
      <div className="maxWidth">
        <ModalEnter 
          processCreate={processCreate}
          setProcessCreate={setProcessCreate}
          processJoin={processJoin}
          setProcessJoin={setProcessJoin}
          gameId={gameId}
          setGameId={setGameId}
          setLoading={setLoading}
          setName={setName}
        />
      </div>
    );
  }

export default Loading