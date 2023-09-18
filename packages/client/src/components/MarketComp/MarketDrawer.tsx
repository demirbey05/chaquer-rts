import { useState, useEffect } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { BuyResources } from "./BuyResources";
import { SellResources } from "./SellResources";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useResourcesInStoke } from "../../hooks/ResourceHooks/useResourcesInStoke";

export const MarketDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [isLoadingSell, setIsLoadingSell] = useState<boolean>(false);
    const [isLoadingBuy, setIsLoadingBuy] = useState<boolean>(false);

    const resourcesInStock = useResourcesInStoke(1);

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

    return (
        <>
            <button className="market-button" onClick={toggleDrawer}>
                🛒
            </button>
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
                                <SellResources setIsLoading={setIsLoadingSell} />
                            </TabPanel>
                            <TabPanel>
                                <BuyResources setIsLoading={setIsLoadingBuy} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                    <h2 className="text-center border-top border-bottom p-2">Stocks</h2>
                    <div className="d-flex align-items-center justify-content-center mt-2">
                        <div className="col align-items-center ms-4">
                            <div className="row justify-content-center w-100">
                                🌽
                            </div>
                            <div className="row justify-content-center text-center w-100 border-1 mt-2">
                                {resourcesInStock && Number(resourcesInStock.foodSold)}
                            </div>
                        </div>
                        <div className="col align-items-center ms-4">
                            <div className="row justify-content-center w-100">
                                🪓
                            </div>
                            <div className="row justify-content-center text-center w-100 border-1 mt-2">
                                {resourcesInStock && Number(resourcesInStock.woodSold)}
                            </div>
                        </div>
                        <div className="col align-items-center ms-4">
                            <div className="row justify-content-center w-100">
                                ⛏️
                            </div>
                            <div className="row justify-content-center text-center w-100 border-1 mt-2">
                                {resourcesInStock && Number(resourcesInStock.goldSold)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoadingSell && <EventProgressBar text={"Selling resources..."} />}
            {isLoadingBuy && <EventProgressBar text={"Buying resources..."} />}
        </>
    )
}