import { createUseStyles } from "react-jss";

interface IBoardStylesParams {
  rows: number;
  columns: number;
}

const useStyles = createUseStyles((theme: IBoardStylesParams) => ({
  gameInfoContainer: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "25%",
    padding: 10,
    position: "relative",
  },
  singleInfo: {
    display: "flex",
    alignItems: "center",
  },
  infoLabel: {
    marginRight: 10,
  },
  characterTurn: {
    width: 50,
    height: 50,
    borderRadius: "50%",
  },

  passTurnButton: {
    cursor: "pointer",
    padding: 10,
    width: "100%",
    boxSizing: "border-box",
    marginTop: 5,
    marginBottom: 5,
  },
  error: {
    color: "red",
  },

  stats: {
    display: "flex",
    marginTop: 10,
    backgroundColor: "#000000d6",
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    alignItems: "flex-start",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
    width: "100%",
    borderRadius: 5,
    zIndex: 1,
    boxSizing: "border-box",
  },
  teamBStats: {
    extend: "stats",
    "& span": {
      color: "orange",
    },
  },
  teamAStats: {
    extend: "stats",
    "& span": {
      color: "#1eceff",
    },
  },
  statTitle: {},
}));

export default useStyles;
