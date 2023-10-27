import IPosition from "../globalTypes/IPosition";

const getDistance = (position1: IPosition, position2: IPosition) => {
  const distance =
    Math.abs(position1.row - position2.row) +
    Math.abs(position1.column - position2.column);
  return distance;
};

export default getDistance;
