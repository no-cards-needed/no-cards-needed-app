import hamburger from "../assets/iconsWhite/hamburger.svg";
import close from "../assets/iconsWhite/close.svg";
import showRemovedCards from "../assets/iconsWhite/showRemovedCards.svg";
import leave from "../assets/iconsWhite/leave.svg";

import Button from "./Button";

import { useState } from "react";
import { motion } from "framer-motion";

import { ReactComponent as AVATAR_1 } from "../assets/avatars/avatar-1.svg";
import { ReactComponent as AVATAR_2 } from "../assets/avatars/avatar-2.svg";
import { ReactComponent as AVATAR_3 } from "../assets/avatars/avatar-3.svg";
import { ReactComponent as AVATAR_4 } from "../assets/avatars/avatar-4.svg";
import { ReactComponent as AVATAR_5 } from "../assets/avatars/avatar-5.svg";
import { useNavigate } from "react-router-dom";

function GameHeader({
  players,
  gameStatus,
  avatars,
}: {
  players: ListOfPlayers;
  gameStatus: GameStatus;
  avatars: {
    src: string;
  }[];
}) {
  const [display, setDisplay] = useState("none");
  const [lastAction, setLastAction] = useState("none");

  const name = ["Mila", "Jako", "Sibylle"];

  const cardNames = {
    color: ["Clubs", "Spades", "Hearts", "Diamonds", ""],
    number: [
      "Ace",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Jack",
      "Queen",
      "King",
      "Joker",
    ],
  };

  const [displayModal, setDisplayModal] = useState("none");

  const actions = [
    "played",
    "removed a pile",
    "took a card",
    "took a trick",
    "shuffled a pile",
    "dealt all cards",
    "folded all cards",
  ];

  function toggleDisplay() {
    if (display === "none") {
      setDisplay("block");
    } else {
      setDisplay("none");
    }
  }

  function toggleModal() {
    if (displayModal === "none") {
      setDisplayModal("flex");
    } else {
      setDisplayModal("none");
    }
  }

  const navigate = useNavigate();

  return (
    <div className="gameHeader criticalMaxWidth" id="basicDrop">
      <div className="gameHeaderContent">
        <div className="avatarContainer" style={{ width: "48px" }}>
          {/* {Array.from(players).map(([playerId, player]) => (
					<div key={playerId} className={`avatar ${gameStatus && player.id === gameStatus?.host ? 'avatarHost' : null} `}>
					{
					player.avatar === 1 ? <AVATAR_1 />
					: player.avatar === 2 ? <AVATAR_2 />
					: player.avatar === 3 ? <AVATAR_3 />
					: player.avatar === 4 ? <AVATAR_4 />
					: <AVATAR_5 />
					}
					</div>
				)) */}

          <div
            className={"avatar"}
            style={{ height: "32px", width: "32px", borderRadius: "9px" }}
          >
            <AVATAR_1 style={{ scale: "112.5%" }} />
          </div>
          <label className="cardCount">5</label>
        </div>
        <label>{lastAction}</label>
      </div>
      <Button
        iconLeading={hamburger}
        btn={"btn"}
        size={"medium"}
        type={"Primary"}
        drop={"dropSmall"}
        style={{ width: "48px" }}
        click={toggleDisplay}
      />

      <motion.div
        animate={{ opacity: 1 }}
        transition={{
          opacity: { ease: "linear" },
          layout: { duration: 0.0 },
        }}
        className="hamburger noselect"
        id="basicDrop"
        style={{ color: "#fff", display: display }}
      >
        <div
          className="hamburgerClose"
          style={{ cursor: "pointer" }}
          onClick={toggleDisplay}
        >
          <img src={close} className="iconContainer" alt=""></img>
        </div>
        {/* <div className="hamburgerItem">
				<img src={settings} className="iconContainer"></img>
				<p>Settings</p>
				</div> */}
        {/* <div className="hamburgerItem">
				<img src={showRemovedCards} className="iconContainer" alt=""></img>
				<p>Show Removed <br/> Cards</p>
				</div> */}
        {/* <div className="hamburgerItem">
				<img src={foldAllCards} className="iconContainer"></img>
				<p>Fold all Cards</p>
				</div> */}
        <div className="hamburgerItem" onClick={toggleModal}>
          <img src={leave} className="iconContainer" alt=""></img>
          <p>Leave Game</p>
        </div>
      </motion.div>

      <div
        className="modalBackground"
        style={{ display: displayModal, position: "relative", zIndex: "9999" }}
      >
        <div className="modal" id="basicDrop">
          <p style={{ textAlign: "center", letterSpacing: "0.01em" }}>
            {" "}
            Do You Really Want to <br /> Leave This Game?{" "}
          </p>
          <div className="buttonContainer">
            <Button
              label={"No"}
              btn={"btn"}
              size={"medium"}
              type={"Secondary"}
              drop={"dropSmall"}
              style={{ width: "100%" }}
              click={toggleModal}
            />
            <Button
              label={"Yes"}
              btn={"btn"}
              size={"medium"}
              type={"Primary"}
              drop={"dropSmall"}
              style={{ width: "100%" }}
              click={() => {
                navigate("/");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameHeader;
