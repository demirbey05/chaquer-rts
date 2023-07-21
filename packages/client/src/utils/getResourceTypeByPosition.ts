export const getResourceTypeByPosition = ({ resource, position }: any) => {
  if (resource && position) {
    const foundResource = resource.find((data: any) => {
      return data.positions.x === position.x && data.positions.y === position.y;
    });

    if (foundResource) {
      return foundResource.resource.sourceType;
    } else {
      return null; // or any other default value if resource not found
    }
  }
};
