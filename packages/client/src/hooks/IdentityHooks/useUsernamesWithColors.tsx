import { useMUD } from "../../context/MUDContext";
import { useEntityQuery, useObservableValue } from "@latticexyz/react";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { useState, useEffect } from "react";

// Change it when we add multi maps feature
export function useUsernameWithColors() {
    const { components } = useMUD();

    const userEntity = useEntityQuery([Has(components.AddressToUsername)]);
    const value = useObservableValue(components.Position.update$);

    const [userData, setUserData] = useState<any>();

    useEffect(() => {
        const userNames = userEntity.map((entityIndex) => {
            const username = getComponentValueStrict(components.AddressToUsername, entityIndex);
            return username;
        });
        setUserData(userNames)
    }, [userEntity, value]);

    return userData;
}
