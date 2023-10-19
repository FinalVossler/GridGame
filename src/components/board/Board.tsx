import React from "react";

import useStyles from "./board.styles";
import ICharacter, { IGameCharacter } from "../../globalTypes/ICharacter";
import TeamEnum from "../../globalTypes/TeamEnum";
import IPosition from "../../globalTypes/IPosition";
import getPossiblePaths from "../../utils/getPossiblePaths";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { gameSlice } from "../../store/slices/gameSlice";
import getAdjacentCases from "../../utils/getAdjacentCases";
import Character from "../character/Character";

interface IBoard {
  teamA: ICharacter[];
  teamB: ICharacter[];
  rows: number;
  columns: number;
}
const Board: React.FunctionComponent<IBoard> = (props: IBoard) => {
  const game = useAppSelector((state) => state.game);

  const [teamA, setTeamA] = React.useState<IGameCharacter[]>([]);
  const [teamB, setTeamB] = React.useState<IGameCharacter[]>([]);

  const styles = useStyles({
    theme: { columns: props.columns, rows: props.rows },
  });
  const dispatch = useAppDispatch();

  // When the turn changes, we need to reset all the actedInTurn property
  React.useEffect(() => {
    setTeamB(
      teamB.map((el) => ({
        ...el,
        actedInTurn: false,
      }))
    );
    setTeamA(teamA.map((el) => ({ ...el, actedInTurn: false })));
  }, [game.whichSpeciesTurn]);

  React.useEffect(() => {
    setTeamA([
      ...props.teamA.map((teamBMember, i) => ({
        ...teamBMember,
        species: TeamEnum.A,
        position: {
          row: i < props.columns ? props.rows - 1 : props.rows,
          column: i < props.columns ? i + 1 : i - props.columns + 1,
        },
        actedInTurn: false,
      })),
    ]);
    setTeamB([
      ...props.teamB.map((teamBMember, i) => ({
        ...teamBMember,
        species: TeamEnum.B,
        position: {
          row: i < props.columns ? 1 : 2,
          column: i < props.columns ? i + 1 : i - props.columns + 1,
        },
        actedInTurn: false,
      })),
    ]);
  }, [props.teamA, props.teamB]);

  const handleClickGrid =
    ({
      grid,
      characterInPosition,
    }: {
      grid: IPosition;
      characterInPosition: IGameCharacter | undefined;
    }) =>
    () => {
      // If we have a character in action, then we need to prioritize him
      if (game.characterInAction) {
        // During action, we have 3 possibilities: (1) clicking on oneself (2) clicking on an empty accessible case
        // (3) clicking on an accessible enemy (4) clicking on an inacessible case (enemy or empty)
        if (
          grid.column === game.characterInAction.position.column &&
          grid.row === game.characterInAction.position.row
        ) {
          dispatch(gameSlice.actions.setCharacterInAction(undefined));
        }
        // If the case is inaccessible
        if (
          !actingCases.find(
            (el) => el.column === grid.column && el.row === grid.row
          )
        ) {
          dispatch(gameSlice.actions.setMessage("Inaccessible case"));
        }
        // If we click on an enemy
        const clickedEnemy = (
          game.characterInAction.species === TeamEnum.A ? teamB : teamA
        ).find(
          (enemy) =>
            enemy.position.column === grid.column &&
            enemy.position.row === grid.row
        );
        if (
          clickedEnemy &&
          actingCases.find(
            (c) =>
              c.column === clickedEnemy.position.column &&
              c.row === clickedEnemy.position.row
          )
        ) {
          const damage =
            Math.max(game.characterInAction.attack - clickedEnemy.defense, 0) +
            1;

          // Damage infliction message
          dispatch(
            gameSlice.actions.setMessage(
              "Inflicted " + damage + " damage to " + clickedEnemy.name
            )
          );

          const isDead: boolean = damage >= clickedEnemy.health;

          // If the clicked enemy dies after the attack, we remove him from the list
          if (isDead) {
            (clickedEnemy?.species === TeamEnum.B ? setTeamB : setTeamA)(
              (clickedEnemy?.species === TeamEnum.B ? teamB : teamA).filter(
                (character) =>
                  character.position.column !== clickedEnemy.position.column ||
                  character.position.row !== clickedEnemy.position.row
              )
            );
          } else {
            // We inflict damage in case the enemy isn't dead yet.
            console.log("clicked enemy pos", clickedEnemy.position);

            console.log("damage", damage);
            (clickedEnemy?.species === TeamEnum.B ? setTeamB : setTeamA)(
              (clickedEnemy?.species === TeamEnum.B ? teamB : teamA).map(
                (character) => ({
                  ...character,
                  health:
                    character.position.column ===
                      clickedEnemy.position.column &&
                    character.position.row === clickedEnemy.position.row
                      ? character.health - damage
                      : character.health,
                })
              )
            );
            // setTeamB(teamB.map((pok) => ({ ...pok, health: 1 })));
          }

          dispatch(gameSlice.actions.setCharacterInAction(undefined));
        }
      } else {
        dispatch(gameSlice.actions.setError(""));
        // When we click on the same clicked character that already acted in this turn, we unclick him
        if (
          characterInPosition &&
          characterInPosition === game.clickedCharacter &&
          characterInPosition.actedInTurn
        ) {
          dispatch(gameSlice.actions.setClickedCharacter(undefined));
        }
        // When we click on a different character than the already clicked one, then we select the new character
        if (
          characterInPosition &&
          characterInPosition !== game.clickedCharacter
        ) {
          dispatch(gameSlice.actions.setClickedCharacter(characterInPosition));
        }
        // If it's the clicked character's team turn, and the character didn't act yet, and we clicked an accessible grid, then we are about to move to the grid
        else if (
          game.clickedCharacter &&
          !game.clickedCharacter.actedInTurn &&
          game.clickedCharacter.species === game.whichSpeciesTurn &&
          casesAllowedToMoveTo.find(
            (el) => el.row === grid.row && el.column === grid.column
          )
        ) {
          let newTeamA: IGameCharacter[] = [...teamA];
          let newTeamB: IGameCharacter[] = [...teamB];
          // Move the character here
          if (game.whichSpeciesTurn === TeamEnum.B) {
            newTeamB = teamB.map((character) =>
              character === game.clickedCharacter
                ? {
                    ...character,
                    position: { row: grid.row, column: grid.column },
                    actedInTurn: true,
                  }
                : character
            );
          }
          if (game.whichSpeciesTurn === TeamEnum.A) {
            newTeamA = teamA.map((character) =>
              character === game.clickedCharacter
                ? {
                    ...character,
                    position: { row: grid.row, column: grid.column },
                    actedInTurn: true,
                  }
                : character
            );
          }

          // If all team members already acted in the current turn, then we switch the turn
          if (
            !(game.whichSpeciesTurn === TeamEnum.A ? newTeamA : newTeamB).find(
              (el) => !el.actedInTurn
            )
          ) {
            dispatch(
              gameSlice.actions.setTurn(
                game.whichSpeciesTurn === TeamEnum.B ? TeamEnum.A : TeamEnum.B
              )
            );
          }

          setTeamA(newTeamA);
          setTeamB(newTeamB);

          dispatch(gameSlice.actions.setClickedCharacter(undefined));
          // After the character has finished moving, then is the time for him to act (attack, cast a spell, heal, etc...)
          dispatch(
            gameSlice.actions.setCharacterInAction(
              newTeamA
                .concat(newTeamB)
                .find(
                  (el) =>
                    el.position.row === grid.row &&
                    el.position.column === grid.column
                )
            )
          );
        }
      }
    };

  const casesAllowedToMoveTo: IPosition[] = React.useMemo(() => {
    const cases: IPosition[] = [];
    if (game.clickedCharacter) {
      const possiblePaths: IPosition[][] = getPossiblePaths({
        blockedGrids: (game.clickedCharacter.species === TeamEnum.A
          ? teamB
          : teamA
        ).map((enemy) => enemy.position),
        range: game.clickedCharacter.movement,
        source: game.clickedCharacter.position,
        totalColumns: props.columns,
        totalRows: props.rows,
      });
      possiblePaths.forEach((path) => {
        path.forEach((block) => {
          if (
            !cases.find(
              (el) => el.column === block.column && el.row === block.row
            )
          ) {
            cases.push(block);
          }
        });
      });
    }
    return cases;
  }, [game.clickedCharacter, props.columns, props.rows]);

  const actingCases: IPosition[] = React.useMemo(() => {
    if (!game.characterInAction) {
      return [];
    } else {
      return getAdjacentCases({
        row: game.characterInAction.position.row,
        column: game.characterInAction.position.column,
        range: game.characterInAction.attackRange,
        totalColumns: props.columns,
        totalRows: props.rows,
      });
    }
  }, [game.characterInAction, teamA, teamB]);

  return (
    <div className={styles.boardContainer}>
      {Array.from({ length: props.columns * props.rows }).map((el, i) => {
        const row = Math.floor(i / props.columns) + 1;
        const column = i + 1 - props.columns * (row - 1);

        const characterInPosition: IGameCharacter | undefined = teamA
          .concat(teamB)
          .find(
            (el) => el.position?.column === column && el.position.row === row
          );

        return (
          <div
            key={i}
            onMouseEnter={() => {
              if (characterInPosition) {
                dispatch(
                  gameSlice.actions.setHoveredCharacter(characterInPosition)
                );
              }
            }}
            onClick={handleClickGrid({
              grid: { row, column },
              characterInPosition,
            })}
            className={
              // The case is highlited when we have a clicked character, and we can we can move or act upon it.
              (game.clickedCharacter === characterInPosition &&
                game.clickedCharacter) ||
              (casesAllowedToMoveTo.find(
                (c) => c.column === column && c.row === row
              ) &&
                !characterInPosition) ||
              (game.characterInAction &&
                actingCases.find(
                  (el) => el.column === column && el.row === row
                ))
                ? styles.highlightedGrid
                : characterInPosition && characterInPosition.actedInTurn
                ? styles.actedCharactedGrid
                : styles.grid
            }
          >
            {characterInPosition && (
              <Character character={characterInPosition} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
