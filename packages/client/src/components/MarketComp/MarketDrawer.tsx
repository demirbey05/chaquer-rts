import { useState, useEffect } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Tooltip } from "@chakra-ui/react";
import { BuyResources } from "./BuyResources";
import { SellResources } from "./SellResources";
import { EventProgressBar } from "../ProgressComp/EventProgressBar";
import { useResourcesInStoke } from "../../hooks/EconomyHooks/useResourcesInStoke";
import { useGame } from "../../context/GameContext";
import { SlBasket } from 'react-icons/sl'
import cornIcon from '../../images/resourceAssets/corn_icon.png'
import woodIcon from '../../images/resourceAssets/wood_icon.png'
import diomandIcon from '../../images/resourceAssets/diomand_icon.png'

export const MarketDrawer = () => {
    const { gameID, isInputFocused } = useGame();
    const [isOpen, setIsOpen] = useState(false);

    const [isLoadingSell, setIsLoadingSell] = useState<boolean>(false);
    const [isLoadingBuy, setIsLoadingBuy] = useState<boolean>(false);

    const resourcesInStock = useResourcesInStoke(gameID);

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
        if (!isInputFocused) {
            window.addEventListener('keydown', handleKeyPress);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isOpen, isInputFocused]);

    return (
        <>
            {isLoadingSell && <EventProgressBar text={"Selling resources..."} />}
            {isLoadingBuy && <EventProgressBar text={"Buying resources..."} />}
            <Tooltip label='Market' placement='top'>
                <button className="market-button" onClick={toggleDrawer}>
                    <SlBasket />
                </button>
            </Tooltip>
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
                                <SellResources setIsLoading={setIsLoadingSell} isLoading={isLoadingSell} />
                            </TabPanel>
                            <TabPanel>
                                <BuyResources setIsLoading={setIsLoadingBuy} isLoading={isLoadingBuy} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                    <h2 className="text-center border-top border-bottom p-2">Market Stocks</h2>
                    <div className="d-flex align-items-center justify-content-center mt-2">
                        <div className="col align-items-center ms-4">
                            <div className="row w-100">
                                <div className="d-flex justify-content-center">
                                    <img src={cornIcon} width={"25px"} height={"25px"} alt="food-count" />
                                </div>
                            </div>
                            <div className="row justify-content-center text-center w-100 border-1 mt-2">
                                {resourcesInStock && Number(resourcesInStock.foodSold)}
                            </div>
                        </div>
                        <div className="col align-items-center ms-4">
                            <div className="row w-100">
                                <div className="d-flex justify-content-center">
                                    <img src={woodIcon} width={"25px"} height={"25px"} alt="wood-count" />
                                </div>
                            </div>
                            <div className="row justify-content-center text-center w-100 border-1 mt-2">
                                {resourcesInStock && Number(resourcesInStock.woodSold)}
                            </div>
                        </div>
                        <div className="col align-items-center ms-4">
                            <div className="row w-100">
                                <div className="d-flex justify-content-center">
                                    <img src={diomandIcon} width={"25px"} height={"25px"} alt="diomand-count" />
                                </div>
                            </div>
                            <div className="row justify-content-center text-center w-100 border-1 mt-2">
                                {resourcesInStock && Number(resourcesInStock.goldSold)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}