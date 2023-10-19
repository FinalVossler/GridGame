import React from "react";

import AnimatedObject from "../animatedObject/AnimatedObject";
import AnimatedContainer from "../animatedContainer/AnimatedContainer";
import { IGameCharacter } from "../../globalTypes/ICharacter";

import useStyles from "./animatedCharacter.styles";

interface ICharacterComponent {
  isRunning: boolean;

  character: IGameCharacter;
}

const AnimatedCharacter: React.FunctionComponent<ICharacterComponent> = (
  props: ICharacterComponent
) => {
  const styles = useStyles();

  return (
    <div className={styles.animatedCharacter}>
      <AnimatedContainer tops={[0, 1, 2, 0]} speed={150}>
        <img
          style={{
            height: 60,
            width: 60,
            top: -10,
            zIndex: 2,
            position: "absolute",
          }}
          src={props.character.head}
        />

        {props.character.metalHat && (
          <img
            style={{
              height: 60,
              top: -19,
              left: 1.5,
              zIndex: 2,
              position: "absolute",
            }}
            src={props.character.metalHat}
          />
        )}

        {!props.character.metalHat && props.character.leatherHat && (
          <img
            style={{
              height: 60,
              top:
                parseInt(
                  props.character.leatherHat
                    .split("/")[5]
                    .split("_")[1]
                    .split(".")[0]
                ) <= 30 &&
                parseInt(
                  props.character.leatherHat
                    .split("/")[5]
                    .split("_")[1]
                    .split(".")[0]
                ) >= 17
                  ? -25
                  : -16,
              left:
                parseInt(
                  props.character.leatherHat
                    .split("/")[5]
                    .split("_")[1]
                    .split(".")[0]
                ) >= 20
                  ? -1
                  : 0,
              zIndex: 2,
              position: "absolute",
            }}
            src={props.character.leatherHat}
          />
        )}

        {!props.character.metalHat &&
          !props.character.leatherHat &&
          props.character.clothHat && (
            <img
              style={{
                height: 60,
                top:
                  parseInt(
                    props.character.clothHat
                      .split("/")[6]
                      .split("_")[1]
                      .split(".")[0]
                  ) <= 28
                    ? -25
                    : parseInt(
                        props.character.clothHat
                          .split("/")[6]
                          .split("_")[1]
                          .split(".")[0]
                      ) >= 38
                    ? -12
                    : -17,
                left:
                  parseInt(
                    props.character.clothHat
                      .split("/")[6]
                      .split("_")[1]
                      .split(".")[0]
                  ) >= 20
                    ? 0
                    : parseInt(
                        props.character.clothHat
                          .split("/")[6]
                          .split("_")[1]
                          .split(".")[0]
                      ) >= 20
                    ? -1
                    : 0,

                zIndex: 2,
                position: "absolute",
              }}
              src={props.character.clothHat}
            />
          )}

        {props.character.hair && (
          <img
            style={{
              height: 60,
              width: 60,
              top: -10,
              zIndex: 2,
              position: "absolute",
            }}
            src={props.character.hair}
          />
        )}
        {props.character.facialHair && (
          <img
            style={{
              height: 60,
              width: 60,
              top: -10,
              zIndex: 2,
              left: 0,
              position: "absolute",
            }}
            src={props.character.facialHair}
          />
        )}
        <img
          style={{
            height: 26,
            width: 26,
            top: 22,
            zIndex: 3,
            left: -8,
            position: "absolute",
          }}
          src={props.character.hand}
        />
        <img
          style={{
            height: 60,
            width: 60,
            top: -10,
            zIndex: 2,
            left: -25,
            position: "absolute",
          }}
          src={props.character.rightArmWeapon}
        />
        <img
          style={{
            height: 60,
            width: 60,
            top: -10,
            zIndex: 2,
            left: -25,
            position: "absolute",
          }}
          src={props.character.rightArmWeapon}
        />
      </AnimatedContainer>
      {!props.isRunning && (
        <AnimatedObject
          style={{
            position: "absolute",
            zIndex: 1,
            height: 70,
            width: 70,
            left: -4,
          }}
          tops={[-20]}
          speed={150}
          sprites={[
            "/assets/images/body/black/idle/body_idle1.png",
            "/assets/images/body/black/idle/body_idle2.png",
            "/assets/images/body/black/idle/body_idle3.png",
            "/assets/images/body/black/idle/body_idle4.png",
          ]}
        />
      )}

      {props.isRunning && (
        <AnimatedObject
          style={{
            position: "absolute",
            zIndex: 1,
            height: 70,
            width: 70,
            left: -4,
          }}
          tops={[-20]}
          speed={150}
          sprites={[
            "/assets/images/body/black/run/body_run1.png",
            "/assets/images/body/black/run/body_run2.png",
            "/assets/images/body/black/run/body_run3.png",
            "/assets/images/body/black/run/body_run4.png",
            "/assets/images/body/black/run/body_run5.png",
            "/assets/images/body/black/run/body_run6.png",
            "/assets/images/body/black/run/body_run7.png",
            "/assets/images/body/black/run/body_run8.png",
          ]}
        />
      )}
    </div>
  );
};

export default AnimatedCharacter;
