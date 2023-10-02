import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useMUD } from "../../context/MUDContext";
import { useError } from '../../context/ErrorContext';
import { ArmyPrices } from "./ArmyPrices";
import { ResourcePrices } from "./ResourcePrices";
import { FleetPrices } from "./FleetPrices";
import { useGameState } from "../../hooks/useGameState";
import { ResourceBuyPrices } from "./ResourceBuyPrices";

export const PriceListDrawer = ({ isInputFocused }: { isInputFocused: boolean }) => {
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
        if (!isInputFocused) {
            window.addEventListener('keydown', handleKeyPress);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isOpen, isInputFocused]);

    return (
        <div>
            <button className={"price-list-button"} onClick={toggleDrawer}>
                $
            </button>
            <div id="prices-drawer-body" className={`prices-drawer ${isOpen ? "open" : ""}`}>
                <h4 className="text-center p-2 mb-2 mt-2 border-bottom font-extrabold">Current Prices</h4>
                <Tabs isFitted variant='enclosed'>
                    <TabList>
                        <Tab _selected={{ color: 'white', bg: 'red.500' }}>Buy Prices</Tab>
                        <Tab _selected={{ color: 'white', bg: 'green.500' }}>Sell Prices</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <h6 className="text-center p-2 mb-2 border-bottom">Resource Prices</h6>
                            <ResourceBuyPrices />
                            <h6 className="text-center p-2 border-bottom">Army Prices</h6>
                            <ArmyPrices />
                            <h6 className="text-center p-2 mt-2 border-bottom">Fleet Prices</h6>
                            <FleetPrices />
                        </TabPanel>
                        <TabPanel>
                            <h6 className="text-center p-2 mb-2 border-bottom">Resource Prices</h6>
                            <ResourcePrices />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </div>
    )
}