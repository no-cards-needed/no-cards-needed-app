import { ReactComponent as TWO_C } from "../assets/cards/2C.svg";
import { ReactComponent as TWO_D } from "../assets/cards/2D.svg";
import { ReactComponent as TWO_H } from "../assets/cards/2H.svg";
import { ReactComponent as TWO_S } from "../assets/cards/2S.svg";

import {ReactComponent as THREE_C} from "../assets/cards/3C.svg"
import {ReactComponent as THREE_D} from "../assets/cards/3D.svg"
import {ReactComponent as THREE_H} from "../assets/cards/3H.svg"
import {ReactComponent as THREE_S} from "../assets/cards/3S.svg"

import {ReactComponent as FOUR_C} from "../assets/cards/4C.svg"
import {ReactComponent as FOUR_D} from "../assets/cards/4D.svg"
import {ReactComponent as FOUR_H} from "../assets/cards/4H.svg"
import {ReactComponent as FOUR_S} from "../assets/cards/4S.svg"

import {ReactComponent as FIVE_C} from "../assets/cards/5C.svg"
import {ReactComponent as FIVE_D} from "../assets/cards/5D.svg"
import {ReactComponent as FIVE_H} from "../assets/cards/5H.svg"
import {ReactComponent as FIVE_S} from "../assets/cards/5S.svg"

import {ReactComponent as SIX_C} from "../assets/cards/6C.svg"
import {ReactComponent as SIX_D} from "../assets/cards/6D.svg"
import {ReactComponent as SIX_H} from "../assets/cards/6H.svg"
import {ReactComponent as SIX_S} from "../assets/cards/6S.svg"

import {ReactComponent as SEVEN_C} from "../assets/cards/7C.svg"
import {ReactComponent as SEVEN_D} from "../assets/cards/7D.svg"
import {ReactComponent as SEVEN_H} from "../assets/cards/7H.svg"
import {ReactComponent as SEVEN_S} from "../assets/cards/7S.svg"

import {ReactComponent as EIGHT_C} from "../assets/cards/8C.svg"
import {ReactComponent as EIGHT_D} from "../assets/cards/8D.svg"
import {ReactComponent as EIGHT_H} from "../assets/cards/8H.svg"
import {ReactComponent as EIGHT_S} from "../assets/cards/8S.svg"

import {ReactComponent as NINE_C} from "../assets/cards/9C.svg"
import {ReactComponent as NINE_D} from "../assets/cards/9D.svg"
import {ReactComponent as NINE_H} from "../assets/cards/9H.svg"
import {ReactComponent as NINE_S} from "../assets/cards/9S.svg"

import { ReactComponent as TEN_C } from "../assets/cards/10C.svg";
import { ReactComponent as TEN_D } from "../assets/cards/10D.svg";
import { ReactComponent as TEN_H } from "../assets/cards/10H.svg";
import { ReactComponent as TEN_S } from "../assets/cards/10S.svg";

import {ReactComponent as JACK_C} from "../assets/cards/JC.svg"
import {ReactComponent as JACK_D} from "../assets/cards/JD.svg"
import {ReactComponent as JACK_H} from "../assets/cards/JH.svg"
import {ReactComponent as JACK_S} from "../assets/cards/JS.svg"

import {ReactComponent as QUEEN_C} from "../assets/cards/QC.svg"
import {ReactComponent as QUEEN_D} from "../assets/cards/QD.svg"
import {ReactComponent as QUEEN_H} from "../assets/cards/QH.svg"
import {ReactComponent as QUEEN_S} from "../assets/cards/QS.svg"

import {ReactComponent as KING_C} from "../assets/cards/KC.svg"
import {ReactComponent as KING_D} from "../assets/cards/KD.svg"
import {ReactComponent as KING_H} from "../assets/cards/KH.svg"
import {ReactComponent as KING_S} from "../assets/cards/KS.svg"

import {ReactComponent as ACE_C} from "../assets/cards/AC.svg"
import {ReactComponent as ACE_D} from "../assets/cards/AD.svg"
import {ReactComponent as ACE_H} from "../assets/cards/AH.svg"
import {ReactComponent as ACE_S} from "../assets/cards/AS.svg"

import { ReactComponent as BACK } from "../assets/cards/zBack.svg";

//Mini Cards for Settings
import {ReactComponent as MiniD2} from '../assets/cards-small/D2.svg'
import {ReactComponent as MiniD6} from '../assets/cards-small/D6.svg'
import {ReactComponent as MiniD7} from '../assets/cards-small/D7.svg'
import {ReactComponent as MiniD9} from '../assets/cards-small/D9.svg'
import {ReactComponent as MiniBack} from '../assets/cards-small/Back.svg';
import {ReactComponent as MiniCA} from '../assets/cards-small/CA.svg';
import {ReactComponent as MiniJoker} from '../assets/cards-small/Joker.svg';

export const miniCards = {
  d2: <MiniD2 />,
  d6: <MiniD6 />,
  d7: <MiniD7 />,
  d9: <MiniD9 />,
  back: <MiniBack />,
  ca: <MiniCA />,
  joker: <MiniJoker />
}

export const cards = [
  {
    name: "2C",
    value: 2,
    suit: "C",
    icon: <TWO_C />,
  },
  {
    name: "2D",
    value: 2,
    suit: "D",
    icon: <TWO_D />,
  },
  {
    name: "2H",
    value: 2,
    suit: "H",
    icon: <TWO_H />,
  },
  {
    name: "2S",
    value: 2,
    suit: "S",
    icon: <TWO_S />,
  },
  {
    name: "3C",
    value: 3,
    suit: "C",
    icon: <THREE_C />,
  },
  {
    name: "3D",
    value: 3,
    suit: "D",
    icon: <THREE_D />,
  },
  {
    name: "3H",
    value: 3,
    suit: "H",
    icon: <THREE_H />,
  },
  {
    name: "3S",
    value: 3,
    suit: "S",
    icon: <THREE_S />,
  },
  {
    name: "4C",
    value: 4,
    suit: "C",
    icon: <FOUR_C />,
  },
  {
    name: "4D",
    value: 4,
    suit: "D",
    icon: <FOUR_D />,
  },
  {
    name: "4H",
    value: 4,
    suit: "H",
    icon: <FOUR_H />,
  },
  {
    name: "4S",
    value: 4,
    suit: "S",
    icon: <FOUR_S />,
  },
  {
    name: "5C",

    value: 5,
    suit: "C",
    icon: <FIVE_C />,
  },
  {
    name: "5D",
    value: 5,
    suit: "D",
    icon: <FIVE_D />,
  },
  {
    name: "5H",
    value: 5,
    suit: "H",
    icon: <FIVE_H />,
  },
  {
    name: "5S",
    value: 5,
    suit: "S",
    icon: <FIVE_S />,
  },
  {
    name: "6C",
    value: 6,
    suit: "C",
    icon: <SIX_C />,
  },
  {
    name: "6D",
    value: 6,
    suit: "D",
    icon: <SIX_D />,
  },
  {
    name: "6H",
    value: 6,
    suit: "H",
    icon: <SIX_H />,
  },
  {
    name: "6S",
    value: 6,
    suit: "S",
    icon: <SIX_S />,
  },
  {
    name: "7C",
    value: 7,
    suit: "C",
    icon: <SEVEN_C />,
  },
  {
    name: "7D",
    value: 7,
    suit: "D",
    icon: <SEVEN_D />,
  },
  {
    name: "7H",
    value: 7,
    suit: "H",
    icon: <SEVEN_H />,
  },
  {
    name: "7S",
    value: 7,
    suit: "S",
    icon: <SEVEN_S />,
  },
  {
    name: "8C",
    value: 8,
    suit: "C",
    icon: <EIGHT_C />,
  },
  {
    name: "8D",
    value: 8,
    suit: "D",
    icon: <EIGHT_D />,
  },
  {
    name: "8H",
    value: 8,
    suit: "H",
    icon: <EIGHT_H />,
  },
  {
    name: "8S",
    value: 8,
    suit: "S",
    icon: <EIGHT_S />,
  },
  {
    name: "9C",
    value: 9,
    suit: "C",

    icon: <NINE_C />,
  },
  {
    name: "9D",
    value: 9,
    suit: "D",
    icon: <NINE_D />,
  },
  {
    name: "9H",
    value: 9,
    suit: "H",
    icon: <NINE_H />,
  },
  {
    name: "9S",
    value: 9,
    suit: "S",
    icon: <NINE_S />,
  },
  {
    name: "TC",
    value: 10,
    suit: "C",
    icon: <TEN_C />,
  },
  {
    name: "TD",
    value: 10,
    suit: "D",
    icon: <TEN_D />,
  },
  {
    name: "TH",
    value: 10,
    suit: "H",
    icon: <TEN_H />,
  },
  {
    name: "TS",
    value: 10,
    suit: "S",
    icon: <TEN_S />,
  },
  {
    name: "JC",
    value: 11,
    suit: "C",
    icon: <JACK_C />,
  },
  {
    name: "JD",
    value: 11,
    suit: "D",
    icon: <JACK_D />,
  },
  {
    name: "JH",
    value: 11,
    suit: "H",
    icon: <JACK_H />,
  },
  {
    name: "JS",
    value: 11,
    suit: "S",
    icon: <JACK_S />,
  },
  {
    name: "QC",
    value: 12,
    suit: "C",
    icon: <QUEEN_C />,
  },
  {
    name: "QD",
    value: 12,
    suit: "D",
    icon: <QUEEN_D />,
  },
  {
    name: "QH",
    value: 12,
    suit: "H",
    icon: <QUEEN_H />,
  },
  {
    name: "QS",
    value: 12,
    suit: "S",
    icon: <QUEEN_S />,
  },
  {
    name: "KC",
    value: 13,
    suit: "C",
    icon: <KING_C />,
  },
  {
    name: "KD",
    value: 13,
    suit: "D",
    icon: <KING_D />,
  },
  {
    name: "KH",
    value: 13,
    suit: "H",
    icon: <KING_H />,
  },
  {
    name: "KS",
    value: 13,
    suit: "S",
    icon: <KING_S />,
  },
  {
    name: "AC",
    value: 14,
    suit: "C",
    icon: <ACE_C />,
  },
  {
    name: "AD",
    value: 14,
    suit: "D",
    icon: <ACE_D />,
  },
  {
    name: "AH",
    value: 14,
    suit: "H",
    icon: <ACE_H />,
  },
  {
    name: "AS",
    value: 14,
    suit: "S",
    icon: <ACE_S />,
  },
];

export const back = <BACK />