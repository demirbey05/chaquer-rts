import archerImg from "../../images/archer.png";
import cavalryImg from "../../images/cavalry.png";
import swordsmanImg from "../../images/swordsman.png";
import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react"
import { useMUD } from "../../MUDContext";
import { useNumberOfResource } from '../../hooks/useNumberOfResource';
import { usePlayer } from '../../context/PlayerContext';
import { useIsMineInitialized } from '../../hooks/useIsMineInitialized';
import { useArmyPrices } from "../../hooks/useArmyPrices";

interface ArmyPrices {
    priceSwordsman: number | undefined,
    priceArcher: number | undefined,
    priceCavalry: number | undefined
}

export const MarketDrawer = () => {
    const { userWallet, isPlayerLost } = usePlayer();
    const { systemCalls }: any = useMUD();

    const [numWood, setNumWood] = useState<string>("");
    const [numFood, setNumFood] = useState<string>("");
    const [numGold, setNumGold] = useState<string>("");

    const [isWoodDisabled, setIsWoodDisabled] = useState<boolean>(true);
    const [isFoodDisabled, setIsFoodDisabled] = useState<boolean>(true);
    const [isGoldDisabled, setIsGoldDisabled] = useState<boolean>(true);

    const numberOfResource: any = useNumberOfResource(userWallet!.address, 1)?.value;
    const isMineInited: any = useIsMineInitialized(1)?.value.isInited;
    const armyPrices: ArmyPrices | undefined | any = useArmyPrices(1)?.value;

    useEffect(() => {
        if (!isPlayerLost && isMineInited) {
            const interval = setInterval(async () => {
                const tx = await systemCalls.updatePrices(1);
                if (tx == null) {
                    console.log("Error occurred during updating army prices.");
                    return;
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isPlayerLost, isMineInited])

    useEffect(() => {
        // Add keyboard event listener to the document
        const handleKeyPress = (event: any) => {
            if (event.key === 'm' || event.key === 'M') {
                // Toggle the offcanvas when "S" key is pressed
                const offcanvasElement = document.getElementById('armyInfoDrawer');
                if (offcanvasElement) {
                    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
                    offcanvas.toggle();
                }
            } else if (event.key === 'Escape') {
                // Close the offcanvas when "Escape" key is pressed
                const offcanvasElement = document.getElementById('armyInfoDrawer');
                if (offcanvasElement) {
                    offcanvasElement.classList.remove('show'); // Manually remove the 'show' class
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    useEffect(() => {
        if (numFood && numFood.toString().length === 0) {
            setIsFoodDisabled(true);
        }

        if (numberOfResource && (parseInt(numFood) <= numberOfResource!.numOfFood)) {
            setIsFoodDisabled(false);
        } else {
            setIsFoodDisabled(true);
        }
    }, [numFood, numberOfResource]);

    useEffect(() => {
        if (numWood && numWood.toString().length === 0) {
            setIsWoodDisabled(true);
        }

        if (numberOfResource && (parseInt(numWood) <= numberOfResource!.numOfWood)) {
            setIsWoodDisabled(false);
        } else {
            setIsWoodDisabled(true);
        }
    }, [numWood, numberOfResource]);

    useEffect(() => {
        if (numGold && numGold.toString().length === 0) {
            setIsGoldDisabled(true);
        }

        if (numberOfResource && (parseInt(numGold) <= numberOfResource!.numOfGold)) {
            setIsGoldDisabled(false);
        } else {
            setIsGoldDisabled(true);
        }
    }, [numGold, numberOfResource]);

    const handleFoodSell = async () => {
        if (numFood.length > 0) {
            const tx = await systemCalls.sellResource(1, parseInt(numFood), 0);
            if (tx) {
                setNumFood('');
                (document.getElementById('Food') as HTMLInputElement).value = '';
            }
        }
    }

    const handleWoodSell = async () => {
        if (numWood.length > 0) {
            const tx = await systemCalls.sellResource(1, parseInt(numWood), 1);
            if (tx) {
                setNumWood('');
                (document.getElementById('Wood') as HTMLInputElement).value = '';
            }
        }
    }

    const handleGoldSell = async () => {
        if (numGold.length > 0) {
            const tx = await systemCalls.sellResource(1, parseInt(numGold), 2);
            if (tx) {
                setNumGold('');
                (document.getElementById('Gold') as HTMLInputElement).value = '';
            }
        }
    }

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

    const marketDrawerDivStyles = {
        height: "525px",
        width: "425px",
        marginTop: "90px",
        padding: "10px"
    }

    return (
        <>
            <Button style={marketDrawerButtonStyles}
                type="button"
                colorScheme="yellow"
                data-bs-toggle="offcanvas"
                data-bs-target="#marketDrawer"
                aria-controls="marketDrawer">
                🛒
            </Button>

            <div style={marketDrawerDivStyles}
                className="offcanvas offcanvas-start"
                data-bs-keyboard="false"
                data-bs-backdrop="false"
                data-bs-config="true"
                id="marketDrawer"
                aria-labelledby="marketDrawerLabel">
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title font-extrabold" id="marketDrawerLabel">Market</h5>
                    <button type="button" data-bs-dismiss="offcanvas" aria-label="Close">&#10008;</button>
                </div>
                <div className="offcanvas-body">
                    <Tooltip label="You can make credit by selling the resources!" placement="top-start" bg="green.400" fontSize="md">
                        <h4 className="border-bottom text-center p-2 font-bold">Sell Resource</h4>
                    </Tooltip>
                    <div className="d-flex align-middle justify-center mt-2 mb-2">
                        <ResourceCard resourceEmoji={"🌽"} resourceName={"Food"} setResourceCount={setNumFood} isDisabled={isFoodDisabled} handleSell={handleFoodSell} />
                        <ResourceCard resourceEmoji={"🪓"} resourceName={"Wood"} setResourceCount={setNumWood} isDisabled={isWoodDisabled} handleSell={handleWoodSell} />
                        <ResourceCard resourceEmoji={"⛏️"} resourceName={"Gold"} setResourceCount={setNumGold} isDisabled={isGoldDisabled} handleSell={handleGoldSell} />
                    </div>
                    <Tooltip label="You can reach the current army prices from here!" placement="top-start" bg="blue.400" fontSize="md">
                        <h4 className="border-bottom text-center p-2 font-bold">Army Prices</h4>
                    </Tooltip>
                    <div className="d-flex align-middle justify-center mt-2">
                        <ArmyCard imageSource={swordsmanImg} imageHeight={"75px"} imageWidth={"65px"} soldierName={"Swordsman"} soldierPrice={armyPrices && armyPrices.priceSwordsman} />
                        <ArmyCard imageSource={archerImg} imageHeight={"75px"} imageWidth={"65px"} soldierName={"Archer"} soldierPrice={armyPrices && armyPrices.priceArcher} />
                        <ArmyCard imageSource={cavalryImg} imageHeight={"75px"} imageWidth={"100px"} soldierName={"Cavalry"} soldierPrice={armyPrices && armyPrices.priceCavalry} />
                    </div>
                </div>
            </div>
        </>
    )
}

interface ResourceCardPropTypes {
    resourceEmoji: string,
    resourceName: string,
    setResourceCount: React.Dispatch<React.SetStateAction<string>>,
    isDisabled: boolean,
    handleSell: any,
}

const ResourceCard = (props: ResourceCardPropTypes) => {
    return (
        <div className="col align-items-center ms-4">
            <div className="row justify-content-center w-100">
                {props.resourceEmoji}
            </div>
            <div className="row justify-content-center text-center w-100 border-1 mt-2">
                {props.resourceName}
            </div>
            <div className="row justify-content-center mt-2 w-100">
                <input
                    className="form-control w-100"
                    type="number"
                    id={props.resourceName}
                    onChange={(e: any) => props.setResourceCount(e.target.value)}
                    onClick={(e: any) => e.target.select()} />
            </div>
            <SellButton isDisabled={props.isDisabled} handleSell={props.handleSell} resourceName={props.resourceName} />
        </div>
    )
}

interface ArmyCardPropTypes {
    imageSource: string,
    imageHeight: string,
    imageWidth: string,
    soldierName: string,
    soldierPrice: number | undefined
}

const ArmyCard = (props: ArmyCardPropTypes) => {
    return (
        <div className="col align-items-center">
            <div className="row justify-content-center">
                <img
                    src={props.imageSource}
                    style={{ height: props.imageHeight, width: props.imageWidth }}
                />
            </div>
            <div className="row justify-content-center text-center mt-2">
                <SoliderInfo soliderName={props.soldierName} soldierPrice={props.soldierPrice} />
                <p>💰</p>
            </div>
        </div>
    )
}

interface SoliderPricePropTypes {
    soliderName: string,
    soldierPrice: number | undefined
}

const SoliderInfo = (props: SoliderPricePropTypes) => {
    return <p style={{ fontSize: "12px" }}>{props.soliderName}: {props.soldierPrice ? Number(props.soldierPrice).toString().slice(0, 6) : 0}</p>
}

interface SellButtonPropTypes {
    isDisabled: boolean,
    handleSell: any,
    resourceName: string
}

const SellButton = (props: SellButtonPropTypes) => {
    return (
        <Button
            colorScheme="whatsapp"
            border="solid"
            textColor="dark"
            className="w-75"
            mt={4}
            isDisabled={props.isDisabled}
            onClick={() => props.handleSell()}
        >
            Sell {props.resourceName}
        </Button>
    )
}
