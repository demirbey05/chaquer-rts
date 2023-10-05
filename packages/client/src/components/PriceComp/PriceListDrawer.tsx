import { useState, useEffect } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { ArmyPrices } from "./ArmyPrices";
import { ResourcePrices } from "./ResourcePrices";
import { FleetPrices } from "./FleetPrices";
import { ResourceBuyPrices } from "./ResourceBuyPrices";

export const PriceListDrawer = ({ isInputFocused, isSpectator }: { isInputFocused: boolean, isSpectator: boolean }) => {
    const [isOpen, setIsOpen] = useState(true);

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
            <button className={"price-list-button"} style={isSpectator ? { marginTop: "25px" } : {}} onClick={toggleDrawer}>
                $
            </button>
            <div id="prices-drawer-body" className={`prices-drawer ${isOpen ? "open" : ""}`} style={isSpectator ? { marginTop: "95px" } : {}}>
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