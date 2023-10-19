import { createUseStyles } from "react-jss";

interface IBoardStylesParams {
  rows: number;
  columns: number;
}

const useStyles = createUseStyles((theme: IBoardStylesParams) => ({
  boardContainer: {
    display: "grid",
    margin: 20,
    gridTemplate:
      "repeat(" + theme.rows + ", 1fr) / repeat(" + theme.columns + ", 1fr)",
  },
  grid: {
    border: "1px solid black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    width: 80,
    height: 80,
  },
  highlightedGrid: {
    extend: "grid",
    backgroundColor: "#e03f5b",
  },
  actedCharactedGrid: {
    extend: "grid",
    backgroundColor: "#64646466",
  },
}));

export default useStyles;
