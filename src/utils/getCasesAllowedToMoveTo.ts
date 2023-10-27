import { IGameCharacter } from "../globalTypes/ICharacter";
import IPosition from "../globalTypes/IPosition";
import TeamEnum from "../globalTypes/TeamEnum";
import getPossiblePaths from "./getPossiblePaths";

interface IGetCasesAllowedToMoveToParams {
  character: IGameCharacter | undefined;
  totalColumns: number;
  totalRows: number;
  teamA: IGameCharacter[];
  teamB: IGameCharacter[];
}

const getCasesAllowedToMoveTo = (params: IGetCasesAllowedToMoveToParams) => {
  if (!params.character) {
    return [];
  }

  const cases: IPosition[] = [];
  const possiblePaths: IPosition[][] = getPossiblePaths({
    blockedGrids: (params.character.species === TeamEnum.A
      ? params.teamB
      : params.teamA
    ).map((enemy) => enemy.position),
    range: params.character.movement,
    source: params.character.position,
    totalColumns: params.totalColumns,
    totalRows: params.totalRows,
  });
  possiblePaths.forEach((path) => {
    path.forEach((block) => {
      if (
        !cases.find((el) => el.column === block.column && el.row === block.row)
      ) {
        cases.push(block);
      }
    });
  });
  return cases;
};

export default getCasesAllowedToMoveTo;
