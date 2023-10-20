import { createUseStyles } from "react-jss";

interface IBoardStylesParams {
  rows: number;
  columns: number;
}

const useStyles = createUseStyles((theme: IBoardStylesParams) => ({
  gameMessage: {
    fontSize: 40,
    color: "white",
    position: "absolute",
    top: 100,
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "red",
    borderRadius: 10,
    padding: 20,
    zIndex: 12,
  },
}));

export default useStyles;
