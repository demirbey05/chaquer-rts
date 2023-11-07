import landImg from "../../../images/mapAssets/land.png";
import mountainImg from "../../../images/mapAssets/mountain.png";
import seaImg from "../../../images/mapAssets/sea.png";
import landImg2 from "../../../images/mapAssets/land.jpeg";
import seaImg2 from "../../../images/mapAssets/sea.jpeg";

export function getTerrainAsset(terrainValue: any) {
  switch (terrainValue) {
    case 1:
      return `url(${landImg2})`;
    case 2:
      return `url(${seaImg2})`;
    case 3:
      return `url(${mountainImg})`;
  }
}
