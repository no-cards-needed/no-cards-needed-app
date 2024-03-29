import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Rive from "@rive-app/react-canvas";

import MenuHeader from "./MenuHeader";
import Counter from "./Counter";
import Dropdown from "./Dropdown";
import Toggle from "./Toggle";
import PlayerCards from "./PlayerCards";
import Button from "./Button";
import Help from "./Help";

import chevronDown from "../assets/iconsBlack/chevron/down.svg";
import chevronUp from "../assets/iconsBlack/chevron/up.svg";
import jokerIcon from "../assets/iconsBlack/joker.svg";
import cardIcon from "../assets/iconsBlack/card.svg";
import deckIcon from "../assets/iconsBlack/deck.svg";
import handIcon from "../assets/iconsBlack/hand.svg";
import share from "../assets/iconsWhite/share.svg";
import copy from "../assets/iconsBlack/copy.svg";

import { miniCards } from "../helpers/Cards";

type Props = {
  deckCards: DropdownContent;

  setDeckCards: (deckCards: DropdownContent) => void;

  joker: number;
  setJoker: (joker: number) => void;

  decks: number;
  setDecks: (decks: number) => void;

  hand: number;
  setHand: (hand: number) => void;

  pile: boolean;
  setPile: (pile: boolean) => void;

  players: ListOfPlayers;

  startGame: boolean;
  setStartGame: () => void;

  gameId: string;
  dropdownContent: DropdownContent[];
  gameStatus: GameStatus;
  userId: string;
  avatars: {
    src: string;
  }[];
};

function Menu({
  deckCards,
  setDeckCards,
  joker,
  setJoker,
  decks,
  setDecks,
  hand,
  setHand,
  pile,
  setPile,
  players,
  startGame,
  setStartGame,
  gameId,
  dropdownContent,
  gameStatus,
  userId,
  avatars,
}: Props) {
  const [active, setActive] = useState(true);
  const [displaySettings, setDisplaySettings] = useState("none");
  const [isHost, setIsHost] = useState(true);

  function toggleDisplay() {
    if (active) {
      setActive(false);
      setDisplaySettings("flex");
    } else {
      setActive(true);
      setDisplaySettings("none");
    }
  }

  const [split, setSplit] = useState(false);

  const [totalCards, setTotalCards] = useState(24);
  const [cardsInDrawPile, setCardsInDrawPile] = useState(19);
  const [maxValue, setMaxValue] = useState(totalCards / players.size);

  const URL = window.location.href;

  const shareId = async () => {
    navigator
      .share({ title: "ncn game", text: "Share link to your game!", url: URL })
      .then(() => {})
      .catch((e) => {
        console.log("User didn't share: " + e);
      });
  };

  const copyId = async () => {
    navigator.clipboard.writeText(URL);
  };

  useEffect(() => {
    setTotalCards((deckCards.count + joker) * decks);

    setCardsInDrawPile(totalCards - players.size * hand);

    if (split) {
      setHand(totalCards / players.size);
    } else if (!split && hand > totalCards) {
      setHand(totalCards / players.size);
    }

    totalCards % players.size !== 0
      ? setMaxValue(totalCards / players.size - 1)
      : setMaxValue(totalCards / players.size);
  }, [deckCards, totalCards, joker, decks, hand, players, split, pile]);

  return (
    <div
      className="Menu maxWidth"
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      <MenuHeader />

      <div
        className="settingsContainer"
        style={{ marginTop: "104px", gap: "32px" }}
        id="basicDrop"
      >
        <div
          style={{ alignItems: "center", height: "32px", marginLeft: "-10px" }}
          className="labelIconCombo"
        >
          <Rive
            style={{ width: "40px", height: "40px", overflow: "visible" }}
            src="/anim/shufflecards.riv"
          />
          <label style={{ marginLeft: "-4px" }}>Wating for players</label>
        </div>
        <div className="labelItemGroup">
          <div className="helpContainer">
            <label>Players</label>
            <Help explanation="That’s the place where your friends appear." />
          </div>
          <PlayerCards
            players={players}
            gameStatus={gameStatus}
            avatars={avatars}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: "16px",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <div className="labelItemGroup">
            <div className="helpContainer">
              <label>access code</label>
              <Help explanation="Your friends will need this code to join the game." />
            </div>
            <div className="infoTag" onClick={copyId}>
              <label onClick={copyId}>{gameId}</label>
            </div>
          </div>

          <div className="labelItemGroup">
            <label>share access</label>
            <div className="labelIconCombo" style={{ gap: "8px" }}>
              <Button
                btn={"quadBtnSmall"}
                iconLeading={share}
                size={"small"}
                type={"Primary"}
                drop={"dropSmall"}
                click={shareId}
              />
              <Button
                btn={"quadBtnSmall"}
                iconLeading={copy}
                size={"small"}
                type={"Secondary"}
                drop={"dropSmall"}
                click={copyId}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="settingsContainer noselect"
        id="basicDrop"
        style={{
          display: gameStatus && userId === gameStatus?.host ? "none" : "flex",
        }}
      >
        <div className="settingsLabel">
          <p>Used Cards</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px",
            flexWrap: "wrap",
            width: "100%",
            maxWidth: "668px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              flexWrap: "wrap",
              rowGap: "16px",
            }}
          >
            <div className="labelItemGroup" style={{ width: "60%" }}>
              <div className="helpContainer">
                <img src={cardIcon} className="iconContainer" alt=""></img>
                <label>cards in deck</label>
              </div>
              <div className="multiCardBox">
                <div className="cardRow">
                  <div
                    className="miniCards"
                    id="basicDrop"
                    style={{ zIndex: 0 }}
                  >
                    {deckCards.src}
                  </div>
                  <div className="miniCards" id="basicDrop"></div>
                  <p style={{ marginLeft: "40px" }}>...</p>
                </div>

                <div className="cardRow">
                  <div className="miniCards" id="basicDrop"></div>
                  <div className="miniCards" id="basicDrop">
                    {miniCards.ca}
                  </div>
                  <div className="countTag">
                    <p>{decks}×</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="labelItemGroup"
              style={{ minWidth: "120px", width: "40%" }}
            >
              <div className="labelIconCombo">
                <img src={jokerIcon} className="iconContainer" alt=""></img>
                <label>Jokers</label>
              </div>
              <div className="cardRow">
                <AnimatePresence>
                  {[...Array(joker).keys()].map((_, i) => {
                    return i < 3 ? (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                        className="miniCards"
                        id="basicDrop"
                      >
                        {miniCards.joker}
                      </motion.div>
                    ) : null;
                  })}
                  <motion.div
                    transition={{ duration: 0.2 }}
                    layout
                    className="countTag"
                  >
                    <p>{joker}×</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              rowGap: "16px",
              justifyItems: "stretch",
            }}
          >
            <div className="labelItemGroup" style={{ width: "60%" }}>
              <div className="labelIconCombo">
                <img src={handIcon} className="iconContainer" alt=""></img>
                <label>Cards on Hand</label>
              </div>
              <div className="cardRow">
                <AnimatePresence>
                  {[...Array(hand).keys()].map((_, i) => {
                    return i < 5 ? (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                        className="miniCards"
                        id="basicDrop"
                      >
                        {miniCards.back}
                      </motion.div>
                    ) : null;
                  })}
                  <motion.div
                    transition={{ duration: 0.2 }}
                    layout
                    className="countTag"
                  >
                    <p>{hand}×</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div
              className="labelItemGroup"
              style={{
                minWidth: "120px",
                width: "40%",
                display: pile ? "flex" : "none",
              }}
            >
              <div className="labelIconCombo">
                <img src={cardIcon} className="iconContainer" alt=""></img>
                <label>Draw Pile</label>
              </div>
              <div className="cardRow">
                <div className="miniCards" id="basicDrop">
                  {miniCards.back}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="settingsContainer noselect"
        id="basicDrop"
        style={{
          display: gameStatus && userId === gameStatus?.host ? "flex" : "none",
        }}
      >
        <div className="settingsLabel" onClick={toggleDisplay}>
          <p>Game Settings</p>
          <img
            src={active ? chevronDown : chevronUp}
            className="iconContainer"
            style={{
              margin: "16px",
              transform: "translateX(16px)",
              cursor: "pointer",
            }}
            alt=""
          ></img>
        </div>
        <motion.div
          layout
          animate={{ opacity: 1 }}
          transition={{
            opacity: { ease: "linear" },
            layout: { duration: 0.0 },
          }}
          className="settingsContent"
          style={{
            display: displaySettings,
            flexDirection: "column",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              flexWrap: "wrap",
              rowGap: "16px",
              alignItems: "end",
            }}
          >
            <div
              className="labelItemGroup"
              style={{ width: "50%", minWidth: "150px" }}
            >
              <div className="labelIconCombo">
                <img src={cardIcon} className="iconContainer" alt=""></img>
                <div className="helpContainer">
                  <label>cards per deck</label>
                  <Help explanation="Here you can choose what kind of deck you want to use for your game." />
                </div>
              </div>
              <Dropdown
                options={dropdownContent}
                setSelection={setDeckCards}
                deckCards={deckCards}
              />
            </div>

            <div className="labelItemGroup" style={{ width: "50%" }}>
              <div className="multiCardBox">
                <div className="cardRow">
                  <div
                    className="miniCards"
                    id="basicDrop"
                    style={{ zIndex: 0 }}
                  >
                    {deckCards.src}
                  </div>
                  <div className="miniCards" id="basicDrop"></div>
                  <p style={{ marginLeft: "40px" }}>...</p>
                </div>

                <div className="cardRow">
                  <div className="miniCards" id="basicDrop"></div>
                  <div className="miniCards" id="basicDrop">
                    {miniCards.ca}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              flexWrap: "wrap",
              rowGap: "16px",
              alignItems: "end",
            }}
          >
            <div
              className="labelItemGroup"
              style={{ minWidth: "130px", width: "50%" }}
            >
              <div className="labelIconCombo">
                <img src={jokerIcon} className="iconContainer" alt=""></img>
                <label>jokers per deck</label>
                <Help explanation="How many Jokers do you want?" />
              </div>
              <Counter
                value={joker}
                setValue={setJoker}
                minValue={0}
                maxValue={10}
                disabled={false}
              />
            </div>

            <div className="labelItemGroup" style={{ width: "50%" }}>
              <div className="cardRow">
                <AnimatePresence>
                  {[...Array(joker).keys()].map((_, i) => {
                    return i < 3 ? (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                        className="miniCards"
                        id="basicDrop"
                      >
                        {miniCards.joker}
                      </motion.div>
                    ) : null;
                  })}
                  <motion.div
                    transition={{ duration: 0.2 }}
                    layout
                    className="countTag"
                  >
                    <p>{joker}×</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              flexWrap: "wrap",
              rowGap: "16px",
              alignItems: "end",
            }}
          >
            <div
              className="labelItemGroup"
              style={{ minWidth: "130px", width: "50%" }}
            >
              <div className="labelIconCombo">
                <img src={deckIcon} className="iconContainer" alt=""></img>
                <label>number of decks</label>
                <Help explanation="Do you need more than one deck to play your game?" />
              </div>
              <Counter
                value={decks}
                setValue={setDecks}
                minValue={1}
                maxValue={10}
                disabled={false}
              />
            </div>

            <div
              className="labelItemGroup"
              style={{ width: "50%", display: pile ? "flex" : "none" }}
            >
              <div className="cardRow">
                <AnimatePresence>
                  {[...Array(decks).keys()].map((_, i) => {
                    return i < 3 ? (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                        className="miniCards"
                        id="basicDrop"
                      >
                        {miniCards.back}
                      </motion.div>
                    ) : null;
                  })}
                  <motion.div
                    transition={{ duration: 0.2 }}
                    layout
                    className="countTag"
                  >
                    <p>{decks}×</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="hairline"></div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              flexWrap: "wrap",
              rowGap: "16px",
              alignItems: "end",
            }}
          >
            <div
              className="labelItemGroup"
              style={{ minWidth: "130px", width: "50%" }}
            >
              <div className="labelIconCombo">
                <img src={handIcon} className="iconContainer" alt=""></img>
                <label>Cards on Hand</label>
                <Help explanation="Amount of cards you will have at the beginning of the game." />
              </div>
              <div style={{ opacity: split ? "0.7" : "1" }}>
                <Counter
                  value={hand}
                  setValue={setHand}
                  minValue={0}
                  maxValue={maxValue}
                  disabled={split ? true : false}
                />
              </div>
            </div>

            <div className="labelItemGroup" style={{ width: "50%" }}>
              <div className="cardRow">
                <AnimatePresence>
                  {[...Array(hand).keys()].map((_, i) => {
                    return i < 5 ? (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                        className="miniCards"
                        id="basicDrop"
                      >
                        {miniCards.back}
                      </motion.div>
                    ) : null;
                  })}
                  <motion.div
                    transition={{ duration: 0.2 }}
                    layout
                    className="countTag"
                  >
                    <p>{hand}×</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="labelItemGroupContainer">
            <div className="helpContainer">
              <p>Split All Cards Equally</p>
              <Help explanation="You can turn this on, if everyone should get the same amount of cards." />
            </div>
            <Toggle toggleOn={split} setToggleOn={setSplit} />
          </div>

          <div className="hairline"></div>

          <div className="labelItemGroupContainer">
            <div className="helpContainer">
              <p>Show Draw Pile</p>
              <Help explanation="Turn this on, if you want your game to have a drawing pile." />
            </div>
            <Toggle toggleOn={pile} setToggleOn={setPile} />
          </div>

          <div className="hairline"></div>

          <div className="playerContainer">
            <div className="infoTag">
              <label>{totalCards} cards in total</label>
            </div>
            <div className="infoTag">
              <label>{hand} cards on hand</label>
            </div>
            <div
              className="infoTag"
              style={{ display: pile ? "flex" : "none" }}
            >
              <label>{cardsInDrawPile} cards in draw pile</label>
            </div>
          </div>
        </motion.div>
      </div>
      <Button
        label={"Start Game"}
        btn={"btnBig"}
        size={""}
        type={"Primary"}
        drop={"basicDrop"}
        click={() => setStartGame()}
        style={{
          display: gameStatus && userId === gameStatus?.host ? "flex" : "none",
        }}
      />
    </div>
  );
}

export default Menu;
