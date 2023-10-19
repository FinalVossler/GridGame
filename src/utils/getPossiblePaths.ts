import IPosition from "../globalTypes/IPosition";

interface IGetPossiblePathsToTarget {
  source: IPosition;
  range: number;
  blockedGrids: IPosition[];
  totalRows: number;
  totalColumns: number;
  accumulatorPaths?: IPosition[][];
  currentPathIndex?: number;
}

const getPossiblePaths = ({
  source,
  range,
  blockedGrids,
  totalColumns,
  totalRows,
  accumulatorPaths,
  currentPathIndex,
}: IGetPossiblePathsToTarget): IPosition[][] => {
  let paths: IPosition[][] = [...(accumulatorPaths || [[source]])];
  const pathIndex: number = currentPathIndex ?? 0;

  if (range === 0) return paths;

  const neighbors: IPosition[] = [
    { row: source.row - 1, column: source.column },
    { row: source.row, column: source.column - 1 },
    { row: source.row, column: source.column + 1 },
    { row: source.row + 1, column: source.column },
  ].filter(
    (neighbor) =>
      neighbor.row >= 1 &&
      neighbor.column >= 1 &&
      neighbor.row <= totalRows &&
      neighbor.column <= totalColumns &&
      !blockedGrids.some(
        (blockedGrid) =>
          blockedGrid.row === neighbor.row &&
          blockedGrid.column === neighbor.column
      ) &&
      !paths[0].some(
        (visitedGrid) =>
          visitedGrid.row === neighbor.row &&
          visitedGrid.column === neighbor.column
      )
  );

  neighbors.forEach((neighbor, i) => {
    if (i === 0) {
      paths[pathIndex].push(neighbor);

      paths = getPossiblePaths({
        source: neighbor,
        range: range - 1,
        blockedGrids,
        totalColumns,
        totalRows,
        accumulatorPaths: paths,
        currentPathIndex: pathIndex,
      });
    } else {
      paths.push([
        ...paths[paths.length - 1].slice(
          0,
          paths[paths.length - 1].indexOf(neighbors[0])
        ),
        neighbor,
      ]);

      paths = getPossiblePaths({
        source: neighbor,
        range: range - 1,
        blockedGrids,
        totalColumns,
        totalRows,
        accumulatorPaths: paths,
        currentPathIndex: paths.length - 1,
      });
    }
  });

  return paths;
};

export default getPossiblePaths;
