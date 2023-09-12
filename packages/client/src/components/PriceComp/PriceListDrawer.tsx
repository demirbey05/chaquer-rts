import { Button, Tooltip } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useArmyPrices } from "../../hooks/EconomyHooks/useArmyPrices";
import { useResourcePrices } from "../../hooks/EconomyHooks/useResourcePrices";
import { useIsMineInitialized } from '../../hooks/ResourceHooks/useIsMineInitialized';
import { usePlayer } from '../../context/PlayerContext';
import { useMUD } from "../../MUDContext";
import { getNumberFromBigInt } from "../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";
import { useError } from '../../context/ErrorContext';

export const PriceListDrawer = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { isPlayerLost } = usePlayer();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { systemCalls } = useMUD();

    const isMineInited = useIsMineInitialized(1);
    const armyPrices = useArmyPrices(1);
    const resourcePrices = useResourcePrices(1);

    const fleetPrices = {
        smallShipCredit: 10,
        smallShipWood: 100,
        mediumShipCredit: 20,
        mediumShipWood: 200,
        bigShipCredit: 30,
        bigShipWood: 300
    }

    useEffect(() => {
        if (!isPlayerLost && isMineInited) {
            const interval = setInterval(async () => {
                const tx = await systemCalls.updateEconomyData(1);
                if (tx == null) {
                    setErrorMessage("An error occurred during updating army prices.")
                    setErrorTitle("Price Updating Error")
                    setShowError(true)
                }
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [isPlayerLost, isMineInited])

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'p' || event.key === 'P') {
            toggleDrawer();
        } else if (event.key === 'Escape') {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isOpen]);

    const drawerButtonStyles: any = {
        zIndex: 1,
        height: "60px",
        width: "60px",
        position: "absolute",
        right: 0,
        top: 0,
        marginTop: "305px",
        fontSize: "30px"
    }

    return (
        <div>
            <Button colorScheme="yellow" style={drawerButtonStyles} onClick={toggleDrawer}>
                $
            </Button>
            <div id="prices-drawer-body" className={`prices-drawer ${isOpen ? "open" : ""}`}>
                <h4 className="text-center p-2 mb-2 border-bottom font-extrabold">Current Prices</h4>
                <Tooltip label="You can reach the current resource prices from here..." placement="top-start" bg="blue.400" fontSize="md">
                    <h6 className="text-center p-2 mb-2 border-bottom">Resource Prices</h6>
                </Tooltip>
                <div>
                    <PriceListItem name={"Gold/per"} isFleetPrices={false} price={resourcePrices && resourcePrices.priceGold} />
                    <PriceListItem name={"Wood/per"} isFleetPrices={false} price={resourcePrices && resourcePrices.priceWood} />
                    <PriceListItem name={"Food/per"} isFleetPrices={false} price={resourcePrices && resourcePrices.priceFood} />
                </div>
                <Tooltip label="You can reach the current army prices from here..." placement="top-start" bg="blue.400" fontSize="md">
                    <h6 className="text-center p-2 border-bottom">Army Prices</h6>
                </Tooltip>
                <div className="mt-2">
                    <PriceListItem name={"Swordsman/per"} isFleetPrices={false} price={armyPrices && armyPrices.priceSwordsman} />
                    <PriceListItem name={"Archer/per"} isFleetPrices={false} price={armyPrices && armyPrices.priceArcher} />
                    <PriceListItem name={"Cavalry/per"} isFleetPrices={false} price={armyPrices && armyPrices.priceCavalry} />
                </div>
                <Tooltip label="You can reach the fleet prices. They are constant." placement="top-start" bg="blue.400" fontSize="md">
                    <h6 className="text-center p-2 mt-2 border-bottom">Fleet Prices</h6>
                </Tooltip>
                <div className="mt-2">
                    <PriceListItem name={"Baron's Dagger/per"} isFleetPrices={true} price={`${fleetPrices.smallShipCredit} 💰 + ${fleetPrices.smallShipWood} 🪓`} />
                    <PriceListItem name={"Knight's Galley/per"} isFleetPrices={true} price={`${fleetPrices.mediumShipCredit} 💰 + ${fleetPrices.mediumShipWood} 🪓`} />
                    <PriceListItem name={"King's Leviathan/per"} isFleetPrices={true} price={`${fleetPrices.bigShipCredit} 💰 + ${fleetPrices.bigShipWood} 🪓`} />
                </div>
            </div>
        </div>
    )
}

interface PriceListItemPropTypes {
    name: string,
    price: any,
    isFleetPrices: boolean
}

const PriceListItem = (props: PriceListItemPropTypes) => {
    return <p className="border-bottom border-black d-flex justify-between">
        <span className="ms-2">
            {props.name}
        </span>
        {
            !props.isFleetPrices ?
                <span className="me-2">
                    {props.price ? getNumberFromBigInt(props.price).slice(0, 12) : "0.00"} 💰
                </span> :
                <span className="me-2">
                    {props.price ? props.price : "0.00"}
                </span>
        }
    </p>
}