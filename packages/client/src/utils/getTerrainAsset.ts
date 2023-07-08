import grassImg from "../images/grass.png";
import mountainImg from "../images/mountain.png";
import seaImg from "../images/sea.png";

export const getTerrainAsset = (data: any) => {
  if (data === 1) {
    return `url(${grassImg})`;
  } else if (data === 2) {
    return `url(${seaImg})`;
  } else {
    return `url(${mountainImg})`;
  }
};
