import grassImg from "../images/grass.png";
import mountainImg from "../images/mountain.png";
import seaImg from "../images/sea.png";

export function getTerrainAsset(terrainValue: any) {
  switch (terrainValue) {
    case 1:
      return `url(${grassImg})`;
    case 2:
      return `url(${seaImg})`;
    case 3:
      return `url(${mountainImg})`;
  }
}
