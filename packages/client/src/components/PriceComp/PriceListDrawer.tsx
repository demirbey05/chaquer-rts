import { Tooltip } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useMUD } from "../../context/MUDContext";
import { useError } from '../../context/ErrorContext';
import { ArmyPrices } from "./ArmyPrices";
import { ResourcePrices } from "./ResourcePrices";
import { FleetPrices } from "./FleetPrices";
import { useGameState } from "../../hooks/useGameState";

export const PriceListDrawer = () => {
    const [isOpen, setIsOpen] = useState(true);

    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { systemCalls } = useMUD();

    const gameState = useGameState(1);

    useEffect(() => {
        if (gameState === 3) {
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
    }, [gameState])

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

    return (
        <div>
            <button className={"price-list-button"} onClick={toggleDrawer}>
                $
            </button>
            <div id="prices-drawer-body" className={`prices-drawer ${isOpen ? "open" : ""}`}>
                <h4 className="text-center p-2 mb-2 border-bottom font-extrabold">Current Prices</h4>
                <Tooltip label="You can reach the current resource prices from here..." placement="top-start" bg="blue.400" fontSize="md">
                    <h6 className="text-center p-2 mb-2 border-bottom">Resource Prices</h6>
                </Tooltip>
                <ResourcePrices />
                <Tooltip label="You can reach the current army prices from here..." placement="top-start" bg="blue.400" fontSize="md">
                    <h6 className="text-center p-2 border-bottom">Army Prices</h6>
                </Tooltip>
                <ArmyPrices />
                <FleetPrices />
            </div>
        </div>
    )
}