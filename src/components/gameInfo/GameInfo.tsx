import React from "react";

import useStyles from "./gameInfo.styles";
import TeamEnum from "../../globalTypes/TeamEnum";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { gameSlice } from "../../store/slices/gameSlice";

interface IGameInfo {}
const GameInfo: React.FunctionComponent<IGameInfo> = (props: IGameInfo) => {
  const game = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const styles = useStyles();

  const handlePassTurn = () => {
    dispatch(
      gameSlice.actions.setTurn(
        game.whichSpeciesTurn === TeamEnum.B ? TeamEnum.A : TeamEnum.B
      )
    );
  };

  return (
    <div className={styles.gameInfoContainer}>
      <div className={styles.singleInfo}>
        <span
          className={styles.infoLabel}
          style={{
            color: game.whichSpeciesTurn === TeamEnum.A ? "blue" : "orange",
          }}
        >
          Turn: {game.whichSpeciesTurn.toString()}{" "}
        </span>
        <div
          className={styles.characterTurn}
          style={{
            backgroundColor:
              game.whichSpeciesTurn === TeamEnum.A ? "blue" : "orange",
          }}
        ></div>
      </div>

      <span className={styles.error}>{game.error}</span>

      {game.hoveredCharacter && (
        <div
          className={
            game.hoveredCharacter.species === TeamEnum.B
              ? styles.teamBStats
              : styles.teamAStats
          }
        >
          <div>
            <span className={styles.statTitle}>Name: </span>
            {game.hoveredCharacter.name}
          </div>
          <div>
            <span className={styles.statTitle}>Health: </span>
            {game.hoveredCharacter.health}
          </div>
          <div>
            <span className={styles.statTitle}>Defense: </span>
            {game.hoveredCharacter.defense}
          </div>
          <div>
            <span className={styles.statTitle}>Attack: </span>
            {game.hoveredCharacter.attack}
          </div>
          <div>
            <span className={styles.statTitle}>Agility: </span>
            {game.hoveredCharacter.agility}
          </div>

          <div>
            <span className={styles.statTitle}>Movement: </span>
            {game.hoveredCharacter.movement}
          </div>

          <div>
            <span className={styles.statTitle}>Species: </span>
            {game.hoveredCharacter.species.toString()}
          </div>
        </div>
      )}

      <button
        disabled={game.whichSpeciesTurn === TeamEnum.B}
        onClick={handlePassTurn}
        className={styles.passTurnButton}
      >
        Pass Turn
      </button>
    </div>
  );
};

export default GameInfo;
