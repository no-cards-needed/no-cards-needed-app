import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { setItem, getItem } from "../helpers/localStorageHelper"
import { generateLobbyString } from "../helpers/words"
import Button from "./Button"

function ModaleEnter({
	processCreate,
	setProcessCreate,
	processJoin,
	setProcessJoin,
	gameId,
	setGameId,
	setLoading,
	setName,
}: {
	processCreate: boolean
	setProcessCreate: (processCreate: boolean) => void
	processJoin: boolean
	setProcessJoin: (processJoin: boolean) => void
	gameId: string
	setGameId: (newID: string) => void
	setLoading?: (loading: boolean) => void
	setName?: (name: string) => void
}) {
	const navigate = useNavigate()
	const [localName, setLocalName] = useState(localStorage.getItem("name"))
	const [localGameId, setLocalGameId] = useState(gameId || "")
	useEffect(() => {
		// Convert to lowercase and spaces to dashes
		setLocalGameId(localGameId.toUpperCase().replace(/ /g, "-"))
	}, [localGameId])

	const [displayName, setDisplayName] = useState(true)
	const [displayKey, setDisplayKey] = useState(false)

	function discardName() {
		navigate("/")

		if (processCreate) {
			setProcessCreate(false)
			setDisplayName(false)
			setDisplayName(true)
		} else if (processJoin) {
			setDisplayName(false)
			setProcessJoin(false)
		}
	}

	function nextName() {
		if (processCreate) {
			setProcessCreate(false)
			setDisplayName(false)
			if (typeof setLoading === "function") {
				setName(localName)
				setLoading(false)
			} else {
				gameId = gameId || generateLobbyString()
				navigate(`/${gameId}`, { state: { name: localName } })
			}
		} else if (processJoin) {
			setDisplayKey(true)
			setDisplayName(false)
		}
	}

	function discardKey() {
		setDisplayKey(false)
		setDisplayName(true)
	}

	function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			if (displayKey) nextKey()
			if (displayName) nextName()
		} else {
		}
	}

	function nextKey() {
		setProcessJoin(false)
		setDisplayKey(false)
		navigate(`/${localGameId.toLowerCase()}`, {
			state: { name: localName, gameId: localGameId },
		})
	}

	const inputElement = useRef(null)

	useEffect(() => {
		inputElement ?? inputElement.current.focus()
		// const timeout = setTimeout(() => {
		//   clearTimeout(timeout);
		// }, 1);
	}, [])

	return (
		<div className="modalBackground">
			{displayName ? (
				<div
					className="modal"
					id="basicDrop"
					style={{ display: "flex" }}>
					<div
						className="headline"
						style={{
							textAlign: "center",
							letterSpacing: "0.01em",
						}}>
						{" "}
						Choose your Nickname!{" "}
					</div>

					<input
						ref={inputElement}
						type="text"
						id="name"
						required
						minLength={3}
						maxLength={20}
						placeholder="Enter Your Name"
						onChange={(e) => {
							setItem("name", `${e.target.value}`)
							setLocalName(e.target.value)
						}}
						value={localName}
						onKeyDown={(e) =>
							localName !== "" ? handleKey(e) : null
						}
					/>

					<div className="buttonContainer">
						<Button
							label={"Discard"}
							btn={"btn"}
							size={"medium"}
							type={"Secondary"}
							drop={"dropSmall"}
							style={{ width: "100%" }}
							click={discardName}
						/>
						<Button
							label={"Next"}
							btn={"btn"}
							size={"medium"}
							type={"Primary"}
							drop={"dropSmall"}
							style={{ width: "100%" }}
							click={() => (localName !== "" ? nextName() : null)}
						/>
					</div>
				</div>
			) : null}

			{displayKey ? (
				<div
					className="modal"
					id="basicDrop"
					style={{ display: "flex" }}>
					<div
						className="headline"
						style={{
							textAlign: "center",
							letterSpacing: "0.01em",
						}}>
						{" "}
						Which Lobby do you <br />
						want to Join?{" "}
					</div>

					<input
						type="text"
						id="key"
						required
						minLength={3}
						maxLength={20}
						placeholder="Enter Access Code"
						onChange={(e) => setLocalGameId(e.target.value)}
						value={localGameId}
					/>

					<div className="buttonContainer">
						<Button
							label={"Back"}
							btn={"btn"}
							size={"medium"}
							type={"Secondary"}
							drop={"dropSmall"}
							style={{ width: "100%" }}
							click={discardKey}
						/>
						<Button
							label={"Next"}
							btn={"btn"}
							size={"medium"}
							type={"Primary"}
							drop={"dropSmall"}
							style={{ width: "100%" }}
							click={() =>
								localGameId !== "" ? nextKey() : null
							}
						/>
					</div>
				</div>
			) : null}
		</div>
	)
}

export default ModaleEnter
