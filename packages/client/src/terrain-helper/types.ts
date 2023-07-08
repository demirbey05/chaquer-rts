//Point's belonging
export enum TerrainType {
  Land = 1,
  Sea,
  Mount,
  None,
}

//Coordiante type
export type Coord = {
  x: number;
  y: number;
};

const TerrainPrecedence: TerrainType[] = [
  TerrainType.Land,
  TerrainType.Sea,
  TerrainType.Mount,
];

// Tailwind class name mapping
export const terrainToColor = {
  [TerrainType.Sea]: "bg-[#0366a4]",
  [TerrainType.Mount]: "bg-[#beb89f]",
  [TerrainType.Land]: "bg-[#547315]",
  [TerrainType.None]: null,
};

export class Array2D {
  private data: Array<number>;
  readonly height: number;
  readonly width: number;

  constructor(height: number, width: number) {
    this.data = [];
    this.height = height;
    this.width = width;
  }

  get(x: number, y: number): number {
    const index = y * this.width + x;
    return this.data[index];
  }
  set(x: number, y: number, value: number) {
    const index = y * this.width + x;
    this.data[index] = value;
  }
  getMax() {
    const maxValue = Math.max(...this.data);
    return maxValue;
  }
  getMin() {
    const minValue = Math.min(...this.data);
    return minValue;
  }
}

export type colorInterval = {
  start: number;
  finish: number;
  numberOfElements: number;
  class: TerrainType;
};

export class IntervalProcessor {
  public data: Array2D;
  public intervals: colorInterval[];
  private controls;

  constructor(data: Array2D) {
    this.data = data;
    this.intervals = [];
    this.controls = { intervalCreated: false, filledHistogram: false };
  }

  createIntervals(intervalNumber: number) {
    if (this.controls.intervalCreated) {
      throw new Error("Interval is already created");
    }
    const minValue = this.data.getMin();
    const maxValue = this.data.getMax() + 0.001;

    const intervalIncrement = (maxValue - minValue) / intervalNumber;

    for (let i = 0; i < intervalNumber; i++) {
      const interval: colorInterval = {
        start: minValue + i * intervalIncrement,
        finish: minValue + (i + 1) * intervalIncrement,
        numberOfElements: 0,
        class: TerrainType.None,
      };
      this.intervals.push(interval);
    }
    this.controls.intervalCreated = true;
  }

  fillHistogram() {
    if (this.controls.filledHistogram) {
      throw new Error("Histogram is already filled");
    }
    for (let i = 0; i < this.data.height; i++) {
      for (let j = 0; j < this.data.width; j++) {
        const data = this.data.get(j, i);
        this.intervals.forEach((interval) => {
          if (data >= interval.start && data < interval.finish) {
            interval.numberOfElements = interval.numberOfElements + 1;
          }
        });
      }
    }
    this.controls.filledHistogram = true;
  }

  assignTerrain() {
    if (!this.controls.filledHistogram) {
      this.fillHistogram();
    }
    let numberOfUsers: number[] = [];
    for (let interval of this.intervals) {
      numberOfUsers.push(interval.numberOfElements);
    }

    let sortedNumberOfUsers = [...numberOfUsers].sort(function (a, b) {
      return b - a;
    });
    let indexSorted = sortedNumberOfUsers.map((element) => {
      return numberOfUsers.indexOf(element);
    });

    indexSorted.forEach((value, index) => {
      this.intervals[value].class = TerrainPrecedence[index];
    });
  }
}
