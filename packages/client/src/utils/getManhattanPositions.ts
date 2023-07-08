export const getManhattanPositions = (position: { x: number; y: number }) => {
  const positions = [
    { x: position.x + 1, y: position.y },
    { x: position.x + 1, y: position.y + 1 },
    { x: position.x + 1, y: position.y + 2 },
    { x: position.x + 1, y: position.y - 1 },
    { x: position.x + 1, y: position.y - 2 },
    { x: position.x + 2, y: position.y },
    { x: position.x + 2, y: position.y + 1 },
    { x: position.x + 2, y: position.y - 1 },
    { x: position.x + 3, y: position.y },
    { x: position.x - 1, y: position.y },
    { x: position.x - 1, y: position.y + 1 },
    { x: position.x - 1, y: position.y + 2 },
    { x: position.x - 1, y: position.y - 2 },
    { x: position.x - 1, y: position.y - 1 },
    { x: position.x - 2, y: position.y },
    { x: position.x - 2, y: position.y + 1 },
    { x: position.x - 2, y: position.y - 1 },
    { x: position.x - 3, y: position.y },
    { x: position.x, y: position.y + 1 },
    { x: position.x, y: position.y + 2 },
    { x: position.x, y: position.y + 3 },
    { x: position.x, y: position.y - 3 },
    { x: position.x, y: position.y - 2 },
    { x: position.x, y: position.y - 1 },
  ];

  return positions;
};
