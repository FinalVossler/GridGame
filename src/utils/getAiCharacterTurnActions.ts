import _ from "lodash";

import { IGameCharacter } from "../globalTypes/ICharacter";
import getAdjacentCases from "../utils/getAdjacentCases";
import getPossiblePaths from "../utils/getPossiblePaths";
import IPosition from "../globalTypes/IPosition";
import getDistance from "../utils/getDistance";

export interface IUserAiParams {
  teamA: IGameCharacter[];
  teamB: IGameCharacter[];
  totalColumns: number;
  totalRows: number;
}

const getAiCharacterTurnActions = (
  character: IGameCharacter,
  params: IUserAiParams
): { newPosition: IPosition; attackTarget: IPosition | undefined } => {
  let attackTarget: IPosition | undefined = undefined;
  let newPosition: IPosition = character.position;

  const accessibleMovementGrids = _.uniq(
    getPossiblePaths({
      source: character.position,
      totalColumns: params.totalColumns,
      totalRows: params.totalRows,
      blockedGrids: params.teamA.map((el) => el.position),
      range: character.movement,
    }).reduce((positions: IPosition[], path) => {
      return positions.concat(path);
    })
  );

  accessibleMovementGrids.every((grid) => {
    if (attackTarget) {
      return false;
    }

    // If this grid is already occupied by a team mate that's not ourselves, then we ignore it
    if (
      params.teamB.find(
        (el) =>
          el.position.column === grid.column &&
          el.position.row === grid.row &&
          (el.position.column !== character.position.column ||
            el.position.row !== character.position.row)
      )
    ) {
      return true;
    }

    const accessibleAttackGrids = getAdjacentCases({
      column: grid.column,
      row: grid.row,
      range: character.attackRange,
      totalColumns: params.totalColumns,
      totalRows: params.totalRows,
    });

    // Now that we have a given grid's adjacent grids, we check if there is a player character in one of the adjacent grids.
    // If we do, then it's a target to attack
    accessibleAttackGrids.forEach((attackableGrid) => {
      const foundAttackablePlayerCharacter: IPosition | undefined = params.teamA
        .map((el) => el.position)
        .find(
          (pos) =>
            pos.column === attackableGrid.column &&
            pos.row === attackableGrid.row
        );
      if (foundAttackablePlayerCharacter) {
        attackTarget = foundAttackablePlayerCharacter;
        newPosition = grid;
        return false;
      }
    });

    return true;
  });

  // If at this point we stil don't have an attackable player character,
  // Then we need to simply get as close as possible to the closest player character
  if (!attackTarget) {
    const closestPlayerCharacterPosition: IPosition = getClosestGrid(
      character.position,
      params.teamA.map((el) => el.position)
    );

    // Now that we found the closest character, we need to find the closest accessible grid to the closest character
    const closestAccessibleGrid: IPosition = getClosestGrid(
      closestPlayerCharacterPosition,
      accessibleMovementGrids
    );
    newPosition = closestAccessibleGrid;
  }

  return { newPosition, attackTarget };
};

const getClosestGrid = (
  source: IPosition,
  possibilites: IPosition[]
): IPosition => {
  let shortestDistance = getDistance(source, possibilites[0]);
  let closestGrid: IPosition = possibilites[0];

  possibilites.forEach((possibility) => {
    const distance = getDistance(source, possibility);
    if (distance <= shortestDistance) {
      shortestDistance = distance;
      closestGrid = possibility;
    }
  });

  return closestGrid;
};

export default getAiCharacterTurnActions;
