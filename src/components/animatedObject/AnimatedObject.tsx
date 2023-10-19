import React from "react";

import useStyles from "./animatedObject.styles";

interface IAnimatedObject {
  sprites: string[];
  tops: number[];
  style?: React.CSSProperties;
  speed?: number;
}

const AnimatedObject: React.FunctionComponent<IAnimatedObject> = (
  props: IAnimatedObject
) => {
  const [spriteIndex, setSpriteIndex] = React.useState<number>(-1);
  const [topIndex, setTopIndex] = React.useState<number>(-1);

  const styles = useStyles();

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newSpriteIndex =
        spriteIndex + 1 >= props.sprites.length ? 0 : spriteIndex + 1;
      setSpriteIndex(newSpriteIndex);

      const newTopIndex = topIndex + 1 >= props.tops.length ? 0 : topIndex + 1;
      setTopIndex(newTopIndex);
    }, props.speed || 200);

    return () => {
      clearInterval(interval);
    };
  }, [spriteIndex, topIndex]);

  return (
    <img
      style={{ ...(props.style || {}), top: props.tops[topIndex] }}
      className={styles.animatedObject}
      src={props.sprites[spriteIndex] || ""}
    />
  );
};

export default AnimatedObject;
