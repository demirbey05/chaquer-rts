export const getOneSquareAwayPositions = (position: {
  x: number;
  y: number;
}) => {
  const positions = [
    { x: position.x + 1, y: position.y },
    { x: position.x - 1, y: position.y },
    { x: position.x, y: position.y + 1 },
    { x: position.x, y: position.y - 1 },
  ];

  return positions;
};
