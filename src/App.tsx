import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import AudioPlayer from "react-h5-audio-player";

import Board from "./components/board/Board";
import TeamEnum from "./globalTypes/TeamEnum";
import { store } from "./store/store";

import useStyles from "./app.styles";
import GameInfo from "./components/gameInfo/GameInfo";
import GameMessage from "./components/gameMessage/GameMessage";

import "./index.css";
import ICharacter from "./globalTypes/ICharacter";

const NUMBER_OF_SKINS = 7;
const NUMBER_OF_FACIAL_HAIRS = 29;
const NUMBER_OF_HAIRS = 30;
const HAIR_COLORS = [
  "black",
  "blonde",
  "blue",
  "brown",
  "green",
  "pink",
  "red",
  "white",
];
const MELEE_WEAPON_TYPES = {
  axe: 24,
  club: 3,
  dagger: 14,
  mace: 4,
  polearm: 34,
  sword: 33,
};

// From 1 to a
export const getRandom = (a: number) => Math.floor(Math.random() * a) + 1;

const App = () => {
  const styles = useStyles();

  const teamA: ICharacter[] = React.useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => {
        const weaponType =
          Object.keys(MELEE_WEAPON_TYPES)[
            getRandom(Object.keys(MELEE_WEAPON_TYPES).length - 1)
          ];
        //@ts-ignore
        const weapon = getRandom(MELEE_WEAPON_TYPES[weaponType]);
        const hairColor = HAIR_COLORS[getRandom(HAIR_COLORS.length - 1)];
        const facialHair = Math.ceil(Math.random() * NUMBER_OF_FACIAL_HAIRS);
        const hair = Math.ceil(Math.random() * NUMBER_OF_HAIRS);
        const skin = Math.ceil(Math.random() * NUMBER_OF_SKINS);
        const head = Math.ceil(Math.random() * NUMBER_OF_HAIRS);

        const withMetalHat: boolean = Math.random() >= 0.7;
        const withLeatherHat: boolean = Math.random() >= 0.7;
        const withClothHat: boolean = Math.random() >= 0.7;

        const movementHinderanceConf = {
          axe: 5,
          hammer: 5,
          mace: 4,
          polearm: 4,
          sword: 2,
          flail: 3,
          dagger: 1,
          club: 4,
        };
        return {
          name: "Human " + (i + 1),
          movement: Math.max(
            Math.min(
              (withMetalHat ? 5 : withLeatherHat ? 6 : withClothHat ? 7 : 8) -
                //@ts-ignore
                (movementHinderanceConf[weaponType as string] || 0),
              5
            ),
            1
          ),
          attack:
            {
              axe: 8,
              club: 6,
              dagger: 1,
              flail: 3,
              hammer: 8,
              mace: 7,
              polearm: 5,
              sword: 5,
            }[weaponType] || 1,
          defense: withMetalHat ? 8 : withLeatherHat ? 5 : withClothHat ? 3 : 1,
          agility: getRandom(9) + 1,
          species: TeamEnum.A,
          attackRange: 1,
          health: 10,
          //@ts-ignore
          rightArmWeapon:
            "/assets/images/melee weapon/" +
            weaponType +
            "/" +
            weaponType +
            "_" +
            weapon +
            ".png",

          facialHair: withMetalHat
            ? ""
            : Math.random() >= 0.5
            ? "/assets/images/human/hair/facial hair/" +
              hairColor +
              "/facial_hair_" +
              facialHair +
              ".png"
            : "",
          hair:
            withMetalHat || withLeatherHat || withClothHat
              ? ""
              : "/assets/images/human/hair/hairstyle/" +
                hairColor +
                "/hair_" +
                hair +
                ".png",
          hand: "/assets/images/human/hand/skintone_" + skin + ".png",
          head:
            "/assets/images/human/head/tone " + skin + "/head_" + head + ".png",
          metalHat: withMetalHat
            ? "/assets/images/wardrobe/metal/black/hat_" +
              (getRandom(11) + 10) +
              ".png"
            : "",
          leatherHat: withLeatherHat
            ? "/assets/images/wardrobe/leather/hat_" + getRandom(41) + ".png"
            : "",
          clothHat: withClothHat
            ? "/assets/images/wardrobe/cloth/black/hat_" +
              getRandom(49) +
              ".png"
            : "",
        };
      }),
    []
  );

  const teamB: ICharacter[] = React.useMemo(
    () =>
      Array.from({ length: 12 }).map((_) => {
        const weaponType =
          Object.keys(MELEE_WEAPON_TYPES)[
            getRandom(Object.keys(MELEE_WEAPON_TYPES).length - 1)
          ];
        //@ts-ignore
        const weapon = getRandom(MELEE_WEAPON_TYPES[weaponType]);
        const hairColor = HAIR_COLORS[getRandom(HAIR_COLORS.length - 1)];
        const facialHair = Math.ceil(Math.random() * NUMBER_OF_FACIAL_HAIRS);

        const hair = Math.ceil(Math.random() * NUMBER_OF_HAIRS);
        const skin = Math.ceil(Math.random() * NUMBER_OF_SKINS);
        const head = Math.ceil(Math.random() * NUMBER_OF_HAIRS);

        return {
          name: "Orc",
          movement: getRandom(4) + 1,
          attack: getRandom(5) + 1,
          defense: getRandom(7) + 1,
          agility: getRandom(9) + 1,
          species: TeamEnum.A,
          attackRange: 1,
          health: 10,
          //@ts-ignore
          rightArmWeapon:
            "/assets/images/melee weapon/" +
            weaponType +
            "/" +
            weaponType +
            "_" +
            weapon +
            ".png",

          facialHair:
            Math.random() > 0.7
              ? "/assets/images/orc/hair/facial hair/" +
                hairColor +
                "/facial_hair_" +
                facialHair +
                ".png"
              : "",

          hair:
            Math.random() > 0.8
              ? "/assets/images/orc/hair/hairstyle/" +
                hairColor +
                "/hair_" +
                hair +
                ".png"
              : "",
          hand: "/assets/images/orc/hand/skintone_1.png",

          head: "/assets/images/orc/head/skin 1/head_" + head + ".png",
          metalHat: "",
          leatherHat: "",
          clothHat: "",
        };
      }),
    []
  );

  return (
    <Provider store={store}>
      <div className={styles.appContainer}>
        <GameInfo />
        <Board rows={10} columns={6} teamA={teamA} teamB={teamB} />
        <GameMessage />
        <AudioPlayer autoPlay src="/music.mp3" loop />
      </div>
    </Provider>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
