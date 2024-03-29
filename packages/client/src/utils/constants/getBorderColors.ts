export const getBorderColor = (colorIndex: number) => {
  let mod = colorIndex % 9;

  if (mod === 0) {
    mod = 9;
  }
  const colorPath = [
    "#ffffff", // beyaz
    "#F21E13", // kırmızı
    "#35F213", // yeşil
    "#132BF2", // koyu mavi
    "#FFA500", // turuncu
    "#F2EF13", // sarı
    "#48a0db", // açık mavi
    "#9B59B6", // mor
    "#34495E", // siyah
    "#EF13F2", // pembe
  ];

  return colorPath[mod];
};
