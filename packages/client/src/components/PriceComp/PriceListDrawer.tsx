import { Button, Tooltip } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useArmyPrices } from "../../hooks/useArmyPrices";
import { useResourcePrices } from "../../hooks/useResourcePrices";
import { useIsMineInitialized } from '../../hooks/useIsMineInitialized';
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
    const resourcePrices = useResourcePrices();

    useEffect(() => {
        if (!isPlayerLost && isMineInited) {
            const interval = setInterval(async () => {
                const tx = await systemCalls.updatePrices(1);
                if (tx == null) {
                    setErrorMessage("An error occurred during updating army prices.")
                    setErrorTitle("Price Updating Error")
                    setShowError(true)
                }
            }, 1000);

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
                    <h6 className="text-center p-2 mb-2 border-bottom">Resource Prices / per</h6>
                </Tooltip>
                <div>
                    <PriceListItem name={"Gold/per"} price={resourcePrices && resourcePrices.priceGold} />
                    <PriceListItem name={"Wood/per"} price={resourcePrices && resourcePrices.priceWood} />
                    <PriceListItem name={"Food/per"} price={resourcePrices && resourcePrices.priceFood} />
                </div>
                <Tooltip label="You can react the current army prices from here..." placement="top-start" bg="blue.400" fontSize="md">
                    <h6 className="text-center p-2 mt-2 border-bottom">Army Prices / per</h6>
                </Tooltip>
                <div>
                    <PriceListItem name={"Swordsman/per"} price={armyPrices && armyPrices.priceSwordsman} />
                    <PriceListItem name={"Archer/per"} price={armyPrices && armyPrices.priceArcher} />
                    <PriceListItem name={"Cavalry/per"} price={armyPrices && armyPrices.priceCavalry} />
                </div>
            </div>
        </div>
    )
}

interface PriceListItemPropTypes {
    name: string,
    price: any
}

const PriceListItem = (props: PriceListItemPropTypes) => {
    return <p className="border-bottom border-black d-flex justify-between"><span className="ms-2">{props.name}</span><span className="me-2">{props.price ? getNumberFromBigInt(props.price).slice(0, 14) : "0.00"} 💰</span></p>
}