import { useState, useEffect } from "react";
import { useGame } from "../../context/GameContext";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Tooltip, Text } from "@chakra-ui/react";
import { ArmyPrices } from "./ArmyPrices";
import { ResourcePrices } from "./ResourcePrices";
import { FleetPrices } from "./FleetPrices";
import { ResourceBuyPrices } from "./ResourceBuyPrices";
import { AiOutlineStock } from 'react-icons/ai'

export const PriceListDrawer = ({ isSpectator }: { isSpectator: boolean }) => {
    const [isOpen, setIsOpen] = useState(true);
    const { isInputFocused } = useGame()

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
        <>
            <Tooltip label='Prices' placement='top'>
                <button
                    className={"price-list-button"}
                    style={isSpectator ? { left: "48%" } : {}}
                    onClick={toggleDrawer}
                >
                    <AiOutlineStock />
                </button>
            </Tooltip>
            <div id="prices-drawer-body" className={`prices-drawer ${isOpen ? "open" : ""}`} style={isSpectator ? { marginTop: "95px" } : {}}>
                <div className='d-flex justify-between align-items-center border-bottom mb-2 p-2'>
                    <Text fontSize={"20px"}>
                        Current Prices
                    </Text>
                    <button type="button" onClick={toggleDrawer}>&#10008;</button>
                </div>
                <Tabs isFitted variant='enclosed'>
                    <TabList>
                        <Tab _selected={{ color: 'white', bg: 'red.500' }}>Buy Prices</Tab>
                        <Tab _selected={{ color: 'white', bg: 'green.500' }}>Sell Prices</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <h6 className="text-center p-2 mb-2 border-bottom">Resource Prices/per</h6>
                            <ResourceBuyPrices />
                            <h6 className="text-center p-2 border-bottom">Army Prices/per</h6>
                            <ArmyPrices />
                            <h6 className="text-center p-2 mt-2 border-bottom">Fleet Prices/per</h6>
                            <FleetPrices />
                        </TabPanel>
                        <TabPanel>
                            <h6 className="text-center p-2 mb-2 border-bottom">Resource Prices/per</h6>
                            <ResourcePrices />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </>
    )
}