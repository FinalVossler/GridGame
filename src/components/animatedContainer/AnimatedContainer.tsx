import React from "react";

interface IAnimatedContainer {
  tops: number[];
  speed?: number;
}

const AnimatedContainer: React.FunctionComponent<IAnimatedContainer> = (
  props: React.PropsWithChildren<IAnimatedContainer>
) => {
  const [spriteIndex, setSpriteIndex] = React.useState<number>(-1);
  const [topIndex, setTopIndex] = React.useState<number>(-1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newTopIndex = topIndex + 1 >= props.tops.length ? 0 : topIndex + 1;
      setTopIndex(newTopIndex);
    }, props.speed || 200);

    return () => {
      clearInterval(interval);
    };
  }, [spriteIndex, topIndex]);

  return (
    <div style={{ position: "absolute", top: props.tops[topIndex] }}>
      {props.children}
    </div>
  );
};

export default AnimatedContainer;
