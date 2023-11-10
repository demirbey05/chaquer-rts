export const getDataAtrX = (event: any) => {
  const id = event.target.dataset.row;
  if (id) {
    return id.toString();
  } else {
    return "-1";
  }
};

export const getDataAtrY = (event: any) => {
  const id = event.target.dataset.column;
  if (id) {
    return id.toString();
  } else {
    return "-1";
  }
};
