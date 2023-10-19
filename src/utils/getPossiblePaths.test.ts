import { describe, expect, test } from "@jest/globals";
import getPossiblePaths from "./getPossiblePaths";
import IPosition from "../globalTypes/IPosition";

describe("get possible paths to target", () => {
  test("small grid", () => {
    const target = { row: 2, column: 2 };
    const paths: IPosition[][] = getPossiblePaths({
      source: { row: 1, column: 1 },
      blockedGrids: [{ column: 1, row: 2 }],
      range: 2,
      totalColumns: 6,
      totalRows: 10,
    });

    expect(
      paths.filter((path) =>
        path.find(
          (position) =>
            position.column === target.column && position.row === target.row
        )
      ).length > 0
    ).toBeTruthy();
  });

  test("bigger movement", () => {
    const target = { row: 2, column: 2 };
    const paths: IPosition[][] = getPossiblePaths({
      source: { row: 1, column: 1 },
      blockedGrids: [{ column: 1, row: 2 }],
      range: 3,
      totalColumns: 6,
      totalRows: 10,
    });

    expect(
      paths.filter((path) =>
        path.find(
          (position) =>
            position.column === target.column && position.row === target.row
        )
      ).length > 0
    ).toBeTruthy();
  });

  test("big grid", () => {
    const target = { row: 6, column: 2 };
    const paths: IPosition[][] = getPossiblePaths({
      source: { row: 4, column: 3 },
      blockedGrids: [
        { row: 5, column: 2 },
        { row: 6, column: 3 },
        { row: 6, column: 4 },
        { row: 5, column: 4 },
      ],
      range: 5,
      totalColumns: 6,
      totalRows: 10,
    });

    expect(
      paths.filter((path) =>
        path.find(
          (position) =>
            position.column === target.column && position.row === target.row
        )
      ).length > 0
    ).toBeTruthy();
  });
});
