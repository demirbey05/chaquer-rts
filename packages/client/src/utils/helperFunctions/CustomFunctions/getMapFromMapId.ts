import map1 from "../../../images/maps/map1.jpg";
import map2 from "../../../images/maps/map2.jpg";
import map3 from "../../../images/maps/map3.jpg";

export const getMapFromMapId = (mapID: number) => {
  if (mapID) {
    if (mapID === 1) {
      return map1;
    } else if (mapID === 2) {
      return map2;
    } else {
      return map3;
    }
  }
};
