import React from "react";

import useStyles from "./gameInfo.styles";
import SpeciesEnum from "../../globalTypes/TeamEnum";
import { useAppSelector } from "../../store/hooks";

interface IGameInfo {}
const GameInfo: React.FunctionComponent<IGameInfo> = (props: IGameInfo) => {
  const game = useAppSelector((state) => state.game);

  const styles = useStyles();

  return (
    <div className={styles.gameInfoContainer}>
      <div className={styles.singleInfo}>
        <span
          className={styles.infoLabel}
          style={{
            color: game.whichSpeciesTurn === SpeciesEnum.A ? "blue" : "orange",
          }}
        >
          Turn: {game.whichSpeciesTurn.toString()}{" "}
        </span>
        <div
          className={styles.characterTurn}
          style={{
            backgroundColor:
              game.whichSpeciesTurn === SpeciesEnum.A ? "blue" : "orange",
          }}
        ></div>
      </div>

      <span>{game.error}</span>
    </div>
  );
};

export default GameInfo;
