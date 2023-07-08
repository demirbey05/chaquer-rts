export const getDataAtrX = (event: any) => {
  const id = event.target.dataset.row;
  return id.toString();
};

export const getDataAtrY = (event: any) => {
  const id = event.target.dataset.column;
  return id.toString();
};
