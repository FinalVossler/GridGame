import React from "react";

import useStyles from "./board.styles";
import ICharacter, { IGameCharacter } from "../../globalTypes/ICharacter";
import TeamEnum from "../../globalTypes/TeamEnum";
import IPosition from "../../globalTypes/IPosition";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { gameSlice } from "../../store/slices/gameSlice";
import getAdjacentCases from "../../utils/getAdjacentCases";
import Character from "../character/Character";
import getAiCharacterTurnActions from "../../utils/getAiCharacterTurnActions";
import _ from "lodash";
import getCasesAllowedToMoveTo from "../../utils/getCasesAllowedToMoveTo";
import doNothing from "../../utils/doNothing";

interface IBoard {
  teamA: ICharacter[];
  teamB: ICharacter[];
  rows: number;
  columns: number;
}
const Board: React.FunctionComponent<IBoard> = (props: IBoard) => {
  //#region central state
  const game = useAppSelector((state) => state.game);
  //#endregion central state

  //#region local state
  const [teamA, setTeamA] = React.useState<IGameCharacter[]>([]);
  const [teamB, setTeamB] = React.useState<IGameCharacter[]>([]);
  const [aiActions, setAiActions] = React.useState<{
    aiCharactersToAct: IGameCharacter[];
    chainOfPositionsToClick: IPosition[];
  }>({ aiCharactersToAct: [], chainOfPositionsToClick: [] });
  //#endregion local state

  const styles = useStyles({
    theme: { columns: props.columns, rows: props.rows },
  });
  const dispatch = useAppDispatch();
  // This ref is used to keep track of the last changes of Ai characters' positions during the AI turn.
  const teamBForAi = React.useRef<IGameCharacter[]>([]);

  //#region hooks
  // When the turn changes, we need to reset all the actedInTurn property
  // And if it's the AI turn, then we proceed to moving the AI
  React.useEffect(() => {
    setTeamB(
      teamB.map((el) => ({
        ...el,
        actedInTurn: false,
      }))
    );
    setTeamA(teamA.map((el) => ({ ...el, actedInTurn: false })));

    if (game.whichSpeciesTurn === TeamEnum.B) {
      const aiCharactersToAct = _.shuffle(teamB.map((el) => el));
      setAiActions({
        chainOfPositionsToClick: [],
        aiCharactersToAct: aiCharactersToAct,
      });
    }
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
    const teamB = [
      ...props.teamB.map((teamBMember, i) => ({
        ...teamBMember,
        species: TeamEnum.B,
        position: {
          row: i < props.columns ? 1 : 2,
          column: i < props.columns ? i + 1 : i - props.columns + 1,
        },
        actedInTurn: false,
      })),
    ];
    setTeamB(teamB);
  }, [props.teamA, props.teamB]);

  React.useEffect(() => {
    teamBForAi.current = teamB;
  }, [teamB]);

  // AI turn
  React.useEffect(() => {
    // Executing current ai character actions
    if (aiActions.chainOfPositionsToClick.length > 0) {
      const newChainOfPositionsToClick = [...aiActions.chainOfPositionsToClick];
      let newAiCharactersToAct = [...aiActions.aiCharactersToAct];
      const positionToClick = newChainOfPositionsToClick.shift() as IPosition;

      handleClickGrid({ grid: positionToClick })();

      setTimeout(() => {
        if (newChainOfPositionsToClick.length === 0) {
          newAiCharactersToAct.shift();
        }

        setAiActions({
          aiCharactersToAct: newAiCharactersToAct,
          chainOfPositionsToClick: newChainOfPositionsToClick,
        });

        // If we just finished all actions, then we change the turn to the player
        if (
          newAiCharactersToAct.length === 0 &&
          newChainOfPositionsToClick.length === 0
        ) {
          dispatch(gameSlice.actions.setTurn(TeamEnum.A));
          dispatch(gameSlice.actions.setClickedCharacter(undefined));
        }
      }, 500);
    }

    // Moving to the next ai character
    if (
      aiActions.chainOfPositionsToClick.length === 0 &&
      aiActions.aiCharactersToAct.length > 0
    ) {
      const character = aiActions.aiCharactersToAct[0];

      let chainOfPositionsToClick: IPosition[] = [];
      const actions = getAiCharacterTurnActions(character, {
        totalColumns: props.columns,
        totalRows: props.rows,
        teamA,
        teamB: teamBForAi.current,
      });
      chainOfPositionsToClick.push(
        character.position,
        actions.newPosition,
        actions.attackTarget || actions.newPosition
      );

      setAiActions({
        aiCharactersToAct: aiActions.aiCharactersToAct,
        chainOfPositionsToClick,
      });
    }
  }, [aiActions, game.whichSpeciesTurn]);
  //#endregion hooks

  //#region event listeners
  const handleClickGrid =
    ({ grid }: { grid: IPosition }) =>
    () => {
      const characterInPosition: IGameCharacter | undefined = teamA
        .concat(teamB)
        .find(
          (el) =>
            el.position?.column === grid.column && el.position.row === grid.row
        );

      // if it's not a selected character turn, and we click on an empty grid, then we show an error message
      if (
        game.clickedCharacter &&
        !characterInPosition &&
        game.whichSpeciesTurn !== game.clickedCharacter.species
      ) {
        dispatch(gameSlice.actions.setMessage("Not the team's turn!"));
      }
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
          inflictDamage(clickedEnemy);
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
          getCasesAllowedToMoveTo({
            character: game.clickedCharacter,
            totalColumns: props.columns,
            totalRows: props.rows,
            teamA,
            teamB,
          }).find((el) => el.row === grid.row && el.column === grid.column)
        ) {
          let newTeamA: IGameCharacter[] = [...teamA];
          let newTeamB: IGameCharacter[] = [...teamB];
          // Move the character here
          if (game.whichSpeciesTurn === TeamEnum.B) {
            newTeamB = teamB.map((character) =>
              character.position.column ===
                game.clickedCharacter?.position.column &&
              character.position.row === game.clickedCharacter.position.row
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

  const inflictDamage = (clickedEnemy: IGameCharacter) => {
    if (!game.characterInAction) {
      return;
    }
    const damage =
      Math.max(game.characterInAction.attack - clickedEnemy.defense, 0) + 1;

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
      (clickedEnemy?.species === TeamEnum.B ? setTeamB : setTeamA)(
        (clickedEnemy?.species === TeamEnum.B ? teamB : teamA).map(
          (character) => ({
            ...character,
            health:
              character.position.column === clickedEnemy.position.column &&
              character.position.row === clickedEnemy.position.row
                ? character.health - damage
                : character.health,
          })
        )
      );
    }

    dispatch(gameSlice.actions.setCharacterInAction(undefined));
  };

  //#endregion event listeners

  //#region UI
  const casesAllowedToMoveTo: IPosition[] = React.useMemo(() => {
    return getCasesAllowedToMoveTo({
      character: game.clickedCharacter,
      totalColumns: props.columns,
      totalRows: props.rows,
      teamA,
      teamB,
    });
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
            onClick={
              game.whichSpeciesTurn === TeamEnum.B
                ? doNothing
                : handleClickGrid({
                    grid: { row, column },
                  })
            }
            className={
              // The case is highlighted when we have a clicked character, and we can move or act upon it.
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
  //#endregion UI
};

export default Board;
