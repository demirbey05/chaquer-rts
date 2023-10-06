import { runQuery, HasValue } from "@latticexyz/recs";
export interface Coord {
  x: string;
  y: string;
}

export const findIDFromPosition = (coordinate: Coord, posComponent: any,gameID:number) => {
  const matchingEntities = runQuery([
    HasValue(posComponent, {
      x: Number(coordinate.x),
      y: Number(coordinate.y),
      gameID
    }),
  ]);
  return matchingEntities;
};
