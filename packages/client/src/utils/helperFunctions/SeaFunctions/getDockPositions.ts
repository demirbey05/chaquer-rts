import { isPositionNextToSea } from "./isPositionNextToSea";

const rows = Array.from({ length: 50 }, (v, i) => i);
const columns = Array.from({ length: 50 }, (v, i) => i);

export const getDockPositions = (values: number[][]) => {
  const positions: { row: number; column: number }[] = [];

  if (values) {
    rows.forEach((row) => {
      columns.forEach((column) => {
        if (isPositionNextToSea(row, column, values)) {
          positions.push({ row, column });
        }
      });
    });
  }

  return positions;
};
