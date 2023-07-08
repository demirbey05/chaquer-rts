import {
  TerrainType,
  Array2D,
  colorInterval,
  IntervalProcessor,
  terrainToColor
} from "./types";
import { makePermutation, noise2d } from "../perlin/perlin2d";
export function generateValues(height: number, width: number) {
  let values: Array<Array<TerrainType>> = [[]];

  for (let i = 0; i < height; i++) {
    let row: Array<TerrainType> = [];
    for (let j = 0; j < width; j++) {
      const terrainIndex = Math.floor(Math.random() * 3) + 1;
      row.push(terrainIndex);
    }
    values.push(row);
  }
  return values;
}

export function generatePerlin(height: number, width: number) {
  const perm:number[] = makePermutation()
  let values: Array2D = new Array2D(height, width);

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const terrainIndex = noise2d(i * 0.01, j * 0.01,perm);
      values.set(i, j, terrainIndex);
    }
  }
  return {values:values,perm:perm};
}

export function generatePerlinValues(
  height: number,
  width: number
) {
  let {values,perm} = generatePerlin(height, width);
  const intervalProcessor = new IntervalProcessor(values);
  intervalProcessor.createIntervals(3);
  intervalProcessor.fillHistogram();
  intervalProcessor.assignTerrain();

  let valuesArray: Array<Array<TerrainType>> = [];
  const intervals: colorInterval[] = intervalProcessor.intervals;

  for (let i = 0; i < height; i++) {
    let row: Array<TerrainType> = [];
    for (let j = 0; j < width; j++) {
      const value = values.get(j, i);

      const TerrainIndex = intervals.forEach((interval) => {
        if (value >= interval.start && value < interval.finish) {
          row.push(interval.class);
        }
      });
    }
    valuesArray.push(row);
  }

  return {valuesArray,perm};
}
