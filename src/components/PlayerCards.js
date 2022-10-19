function PlayerCards( props ) {

    const names = props.names;

    return (
  
      <div className="PlayerCards"> 
        <div className="playerContainer">

                {Object.values(names).map((player, index) => (
                <div className="player" key={index}>
                  <div className="avatar" style={{display: player.host ? 'block' : 'none' }}></div>
                  <p>{player.name}</p>
                </div>
                ))}

        </div>
      </div>
    );
  }   

  export default PlayerCards