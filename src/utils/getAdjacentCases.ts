import IPosition from "../globalTypes/IPosition";

interface IGetAdjacentCases {
  row: number;
  column: number;
  totalRows: number;
  totalColumns: number;
  range: number;
}

const getAdjacentCases = ({
  row,
  column,
  totalRows,
  totalColumns,
  range,
}: IGetAdjacentCases): IPosition[] => {
  const adjacentCases: IPosition[] = Array.from({
    length: totalColumns * totalRows,
  })
    .map((_, i) => {
      const row = Math.floor(i / totalColumns) + 1;
      const column = i + 1 - totalColumns * (row - 1);

      return { row, column };
    })
    .filter((el) => {
      const distance = Math.abs(el.row - row) + Math.abs(el.column - column);

      return distance <= range;
    });

  return adjacentCases;
};

export default getAdjacentCases;
