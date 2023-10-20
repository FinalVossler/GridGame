import { createUseStyles } from "react-jss";

interface IBoardStylesParams {
  rows: number;
  columns: number;
}

const useStyles = createUseStyles((theme: IBoardStylesParams) => ({
  character: {
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    position: "relative",
    justifyContent: "center",
  },
  characterInAction: {
    extend: "character",

    background: "linear-gradient(to right, red, lightblue)",
    width: 60,
    borderRadius: "50%",
    height: 60,
  },

  healthBar: {
    position: "absolute",
    top: -10,
    width: "120%",
    height: 5,
    left: "-10%",
    backgroundColor: "red",
    borderRadius: 10,
    overflow: "hidden",
    zIndex: 11,
  },
  health: {
    backgroundColor: "green",
    borderRadius: 10,
    height: "100%",
  },
  weapon: {
    position: "absolute",
    width: 10,
    left: -20,
  },
}));

export default useStyles;
