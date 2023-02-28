import close from '../assets/iconsBlack/close.svg';
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button"

function MenuHeader() {

	const navigate = useNavigate()

	return (
	<div className="menuHeader maxWidth" id="basicDrop">
			<Button iconLeading={close} btn={"btn"} size={"medium"} type={"Secondary"} drop={"dropSmall"} style={{position: "absolute", left: "28px", width: "48px", gap: "0"}} click={() => {navigate('/')}} />
			<div className="headline">Create Game</div>
	</div>
	);
}

export default MenuHeader