function PlayerCards( props ) {

    const names = props.names;

    return (
  
      <div className="PlayerCards"> 
        <div class="playerContainer">

                {names.map(name => (
                <div class="player">
                  <div class="avatar"></div>
                  <text>{name}</text>
                </div>
                ))}

        </div>
      </div>
    );
  }   

  export default PlayerCards