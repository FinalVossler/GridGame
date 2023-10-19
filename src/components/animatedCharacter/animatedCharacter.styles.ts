import { createUseStyles } from "react-jss";

interface IBoardStylesParams {
  rows: number;
  columns: number;
}

const useStyles = createUseStyles((theme: IBoardStylesParams) => ({
  animatedCharacter: {
    width: 50,
    height: 50,
    position: "relative",
  },
}));

export default useStyles;
