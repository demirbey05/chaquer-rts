export const flatten2D = (values: number[][]): number[] => {
  return values.reduce(
    (accumulator, currentValue) => accumulator.concat(currentValue),
    []
  );
};
