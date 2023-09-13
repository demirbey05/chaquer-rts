import { useState, useEffect } from "react";
import { Button, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { BuyResources } from "./BuyResources";
import { SellResources } from "./SellResources";

export const MarketDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'm' || event.key === 'M') {
                const offcanvasElement = document.getElementById('marketDrawer');
                if (offcanvasElement && !offcanvasElement.classList.contains("show")) {
                    offcanvasElement.classList.add('show');
                }
                else if (offcanvasElement) {
                    offcanvasElement.classList.remove('show');
                }
            } else if (event.key === 'Escape') {
                const offcanvasElement = document.getElementById('marketDrawer');
                if (offcanvasElement) {
                    offcanvasElement.classList.remove('show');
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'm' || event.key === 'M') {
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

    const marketDrawerButtonStyles: any = {
        zIndex: 1,
        height: "60px",
        width: "60px",
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        marginTop: "155px",
        fontSize: "30px"
    }

    return (
        <>
            <Button colorScheme="yellow" style={marketDrawerButtonStyles} onClick={toggleDrawer}>
                🛒
            </Button>
            <div id="market-drawer" className={`market-drawer ${isOpen ? "open" : ""}`}>
                <div className="d-flex justify-between border-bottom mb-2 p-2">
                    <h5 className="font-extrabold">Market</h5>
                    <button type="button" onClick={() => setIsOpen(false)}>&#10008;</button>
                </div>
                <div className='ms-2'>
                    <Tabs isFitted variant='enclosed'>
                        <TabList>
                            <Tab _selected={{ color: 'white', bg: 'green.500' }}>Sell Resources</Tab>
                            <Tab _selected={{ color: 'white', bg: 'red.500' }}>Buy Resources</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <SellResources />
                            </TabPanel>
                            <TabPanel>
                                <BuyResources />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </div>
        </>
    )
}