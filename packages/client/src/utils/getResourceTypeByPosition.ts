export const getResourceTypeByPosition = (resource: any[], position: any) => {
  if (resource && position) {
    const foundResource = resource.find((data: any) => {
      return (
        data.positions.x.toString() === position.x &&
        data.positions.y.toString() === position.y
      );
    });

    if (foundResource) {
      return foundResource.resource.sourceType;
    } else {
      return null; // or any other default value if resource not found
    }
  }
};
