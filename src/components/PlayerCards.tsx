import { ReactComponent as AVATAR_1 } from "../assets/avatars/avatar-1.svg";
import { ReactComponent as AVATAR_2 } from "../assets/avatars/avatar-2.svg";
import { ReactComponent as AVATAR_3 } from "../assets/avatars/avatar-3.svg";
import { ReactComponent as AVATAR_4 } from "../assets/avatars/avatar-4.svg";
import { ReactComponent as AVATAR_5 } from "../assets/avatars/avatar-5.svg";


function PlayerCards( 
	{
		players, 
		gameStatus,
		avatars
	}: {
		players: {
			[id: string]: {
				name: string,
				id: string,
				avatar: 1 | 2 | 3 | 4 | 5
			}
		},
		gameStatus: GameStatus,
		avatars: {
			src: string
		}[]
	}) {

	// TODO: Get Host information from GameStatus

	return (
		<div className="PlayerCards"> 
			<div className="playerContainer">
				{Object.values(players).map((player, index) => (
				<div className="player" key={index}>
					<div className={`avatar ${gameStatus && player.id === gameStatus?.host ? 'avatarHost' : null} `}>
					{
						player.avatar === 1 ? <AVATAR_1 />
						: player.avatar === 2 ? <AVATAR_2 />
						: player.avatar === 3 ? <AVATAR_3 />
						: player.avatar === 4 ? <AVATAR_4 />
						: <AVATAR_5 />
					}
					</div>
					<p>{player.name}</p>
				</div>
				))}
			</div>
		</div>
	);
}   

export default PlayerCards