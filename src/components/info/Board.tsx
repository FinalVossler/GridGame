import React from "react";

import useStyles from "./board.styles";
import ICharacter, { IGameCharacter } from "../../globalTypes/ICharacter";
import SpeciesEnum from "../../globalTypes/TeamEnum";
import IPosition from "../../globalTypes/IPosition";
import getPossiblePaths from "../../utils/getPossiblePaths";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { gameSlice } from "../../store/slices/gameSlice";

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

  React.useEffect(() => {
    setTeamA([
      ...props.teamA.map((teamBMember, i) => ({
        ...teamBMember,
        species: SpeciesEnum.A,
        position: {
          row: i < props.columns ? props.rows - 1 : props.rows,
          column: i < props.columns ? i + 1 : i - props.columns,
        },
        actedInTurn: false,
      })),
    ]);
    setTeamB([
      ...props.teamB.map((teamBMember, i) => ({
        ...teamBMember,
        species: SpeciesEnum.B,
        position: {
          row: i < props.columns ? 1 : 2,
          column: i < props.columns ? i + 1 : i - props.columns,
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
      if (characterInPosition) {
        if (game.clickedCharacter === characterInPosition) {
          dispatch(gameSlice.actions.setClickedCharacter(undefined));
        } else {
          dispatch(gameSlice.actions.setClickedCharacter(characterInPosition));
        }
      } else {
        if (
          game.clickedCharacter &&
          game.clickedCharacter.species === game.whichSpeciesTurn &&
          movementCases.find(
            (el) => el.row === grid.row && el.column === grid.column
          )
        ) {
          // Move the character here
          if (game.whichSpeciesTurn === SpeciesEnum.B) {
            setTeamB(
              teamB.map((character) =>
                character === game.clickedCharacter
                  ? {
                      ...character,
                      position: { row: grid.row, column: grid.column },
                    }
                  : character
              )
            );
          }
          if (game.whichSpeciesTurn === SpeciesEnum.A) {
            setTeamA(
              teamA.map((character) =>
                character === game.clickedCharacter
                  ? {
                      ...character,
                      position: { row: grid.row, column: grid.column },
                    }
                  : character
              )
            );
          }
          dispatch(
            gameSlice.actions.setTurn(
              game.whichSpeciesTurn === SpeciesEnum.B
                ? SpeciesEnum.A
                : SpeciesEnum.B
            )
          );

          dispatch(gameSlice.actions.setClickedCharacter(undefined));
        }
      }
    };

  const movementCases: IPosition[] = React.useMemo(() => {
    const cases: IPosition[] = [];
    if (game.clickedCharacter) {
      const possiblePaths: IPosition[][] = getPossiblePaths({
        blockedGrids: (game.clickedCharacter.species === SpeciesEnum.A
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
            onClick={handleClickGrid({
              grid: { row, column },
              characterInPosition,
            })}
            className={
              // The case is highlited when it's a clicked character, are a case we can move to or act upon.
              (game.clickedCharacter === characterInPosition &&
                game.clickedCharacter) ||
              (movementCases.find(
                (c) => c.column === column && c.row === row
              ) &&
                !characterInPosition)
                ? styles.highlightedGrid
                : styles.grid
            }
          >
            {characterInPosition && (
              <div
                className={
                  characterInPosition.species === SpeciesEnum.B
                    ? styles.teamBMember
                    : styles.teamBMember
                }
              >
                <div className={styles.stats}>
                  <span>Movement: {characterInPosition.movement}</span>
                  <span>Attack: {characterInPosition.attack}</span>
                  <span>Defense: {characterInPosition.defense}</span>
                  <span>Agility: {characterInPosition.agility}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
