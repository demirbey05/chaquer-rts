export const isUserClickedMine = (x: any, y: any, resources: any) => {
  const isValid = resources.some(
    (item: any) =>
      item.positions.x.toString() === x && item.positions.y.toString() === y
  );
  return isValid;
};
