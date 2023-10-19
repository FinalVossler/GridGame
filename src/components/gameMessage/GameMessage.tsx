import React from "react";

import useStyles from "./gameMessage.styles";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { gameSlice } from "../../store/slices/gameSlice";

interface IGameMessage {}
const GameMessage: React.FunctionComponent<IGameMessage> = (
  props: IGameMessage
) => {
  const game = useAppSelector((state) => state.game);

  const styles = useStyles();
  const timeout = React.useRef<NodeJS.Timeout | undefined>();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const removeMessage = () => {
      dispatch(gameSlice.actions.setMessage(""));
    };

    if (game.message) {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(removeMessage, 2000);
    }
  }, [game.message]);

  if (!game.message) {
    return null;
  }

  return <div className={styles.gameMessage}>{game.message}</div>;
};

export default GameMessage;
