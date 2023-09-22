import landImg from "../../../images/mapAssets/land.png";
import mountainImg from "../../../images/mapAssets/mountain.png";
import seaImg from "../../../images/mapAssets/sea.png";

export function getTerrainAsset(terrainValue: any) {
  switch (terrainValue) {
    case 1:
      return `url(${landImg})`;
    case 2:
      return `url(${seaImg})`;
    case 3:
      return `url(${mountainImg})`;
  }
}
