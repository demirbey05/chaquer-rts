import { runQuery, HasValue } from "@latticexyz/recs";
export interface Coord {
  x: string;
  y: string;
}

export const findIDFromPosition = (
  coordinate: Coord,
  posComponent:any,
) => {
  const matchingEntities = runQuery([
    HasValue(posComponent, {x: Number(coordinate.x), y: Number(coordinate.y)})
  ])
  return matchingEntities
};