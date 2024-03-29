import close from "../assets/iconsBlack/chevron/left.svg"
import { Link, useNavigate } from "react-router-dom"
import Button from "./Button"

function Privacy() {
	const navigate = useNavigate()

	return (
		<div className="maxWidth" style={{ padding: "16px 28px", backgroundColor: "var(--vg-10)", height: "100vh" }}>
			<Button
				iconLeading={close}
				btn={"btn"}
				size={"medium"}
				type={"Secondary"}
				drop={"dropSmall"}
				style={{ width: "48px" }}
				click={() => {
					navigate("/")
				}}
			/>
			<div className="headline" style={{ paddingTop: "24px" }}>
				About
			</div>
			<br />
			<div className="tut" style={{ color: "var(--vg-100)" }}>
				No cards needed is an online playing card simulation. It provides a framework to play any game – that is
				played with standard playing cards. <br />
				That means there are no more rules to follow than the rules you make up yourself.
				<br />
				<br />
				This Game was made <br /> by <a href="https://ericwaetke.com/de/">Eric Wätke</a> &{" "}
				<a href="http://solidjellycube.de">Silas Wolf</a>
			</div>
		</div>
	)
}

export default Privacy
