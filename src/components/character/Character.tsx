import React from "react";

import { useAppSelector } from "../../store/hooks";
import { IGameCharacter } from "../../globalTypes/ICharacter";

import useStyles from "./character.styles";
import AnimatedCharacter from "../animatedCharacter/AnimatedCharacter";

interface ICharacterComponent {
  character: IGameCharacter;
}

const Character: React.FunctionComponent<ICharacterComponent> = (
  props: ICharacterComponent
) => {
  const game = useAppSelector((state) => state.game);

  const styles = useStyles();

  return (
    <div
      className={
        game.characterInAction?.position.column ===
          props.character.position.column &&
        game.characterInAction.position.row === props.character.position.row
          ? styles.characterInAction
          : styles.character
      }
    >
      <div className={styles.healthBar}>
        <div
          className={styles.health}
          style={{ width: props.character.health * 10 + "%" }}
        ></div>
      </div>
      <AnimatedCharacter isRunning={false} character={props.character} />
    </div>
  );
};

export default Character;
