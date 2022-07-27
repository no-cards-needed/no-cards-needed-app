function PlayerCards( props ) {

    const names = props.names;

    return (
  
      <div className="PlayerCards"> 
        <div class="playerContainer">

                {names.map(name => (
                <div class="player">
                  <div class="avatar"></div>
                  <p>{name}</p>
                </div>
                ))}

        </div>
      </div>
    );
  }   

  export default PlayerCards