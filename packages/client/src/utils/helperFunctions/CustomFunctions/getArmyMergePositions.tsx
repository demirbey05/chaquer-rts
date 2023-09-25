export const getArmyMergePositions = (
    fromArmyPosition: any
) => {
    const positions: any[] = [];

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            if (xOffset !== 0 || yOffset !== 0) {
                const newPosition = {
                    x: Number(fromArmyPosition.x) + xOffset,
                    y: Number(fromArmyPosition.y) + yOffset,
                };

                positions.push(newPosition)
            }
        }
    }

    return positions;
};