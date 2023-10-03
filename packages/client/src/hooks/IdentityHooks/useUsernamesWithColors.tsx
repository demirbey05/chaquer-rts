import { useMUD } from "../../context/MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { HasValue, getComponentValueStrict } from "@latticexyz/recs";
import { useState, useEffect } from "react";

export function useUsernameWithColors(gameID: number) {
    const { components } = useMUD();

    const userEntity = useEntityQuery([
        HasValue(components.AddressToColorIndex, { mirror: BigInt(gameID) }),
    ]);
    const value = useObservableValue(components.AddressToColorIndex.update$);

    const [userData, setUserData] = useState<any>();

    useEffect(() => {
        const userNames = userEntity.map((entityIndex) => {
            const username = getComponentValueStrict(components.AddressToColorIndex, entityIndex);
            return username;
        });
        setUserData(userNames)
    }, [userEntity, value]);

    return userData;
}
