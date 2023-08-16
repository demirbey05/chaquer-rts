import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react"
import { useMUD } from "../../MUDContext";
import { useNumberOfResource } from '../../hooks/useNumberOfResource';
import { usePlayer } from '../../context/PlayerContext';

export const MarketDrawer = () => {
    const { userWallet } = usePlayer();
    const { systemCalls } = useMUD();

    const [numWood, setNumWood] = useState<string>("");
    const [numFood, setNumFood] = useState<string>("");
    const [numGold, setNumGold] = useState<string>("");

    const [isWoodDisabled, setIsWoodDisabled] = useState<boolean>(true);
    const [isFoodDisabled, setIsFoodDisabled] = useState<boolean>(true);
    const [isGoldDisabled, setIsGoldDisabled] = useState<boolean>(true);

    const [is100WoodDisabled, setIs100WoodDisabled] = useState<boolean>(true);
    const [is100FoodDisabled, setIs100FoodDisabled] = useState<boolean>(true);
    const [is100GoldDisabled, setIs100GoldDisabled] = useState<boolean>(true);

    const [is30WoodDisabled, setIs30WoodDisabled] = useState<boolean>(true);
    const [is30FoodDisabled, setIs30FoodDisabled] = useState<boolean>(true);
    const [is30GoldDisabled, setIs30GoldDisabled] = useState<boolean>(true);

    const [is500WoodDisabled, setIs500WoodDisabled] = useState<boolean>(true);
    const [is500FoodDisabled, setIs500FoodDisabled] = useState<boolean>(true);
    const [is500GoldDisabled, setIs500GoldDisabled] = useState<boolean>(true);

    const numberOfResource: any = useNumberOfResource(userWallet!.address, 1)?.value;

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

    useEffect(() => {
        // Food
        if (numberOfResource && numberOfResource!.numOfFood < 30) {
            setIs30FoodDisabled(true);
        }
        else {
            setIs30FoodDisabled(false);
        }

        if (numberOfResource && numberOfResource!.numOfFood < 100) {
            setIs100FoodDisabled(true);
        }
        else {
            setIs100FoodDisabled(false);
        }

        if (numberOfResource && numberOfResource!.numOfFood < 500) {
            setIs500FoodDisabled(true);
        }
        else {
            setIs500FoodDisabled(false);
        }

        // Wood
        if (numberOfResource && numberOfResource!.numOfWood < 30) {
            setIs30WoodDisabled(true);
        }
        else {
            setIs30WoodDisabled(false);
        }

        if (numberOfResource && numberOfResource!.numOfWood < 100) {
            setIs100WoodDisabled(true);
        }
        else {
            setIs100WoodDisabled(false);
        }

        if (numberOfResource && numberOfResource!.numOfWood < 500) {
            setIs500WoodDisabled(true);
        }
        else {
            setIs500WoodDisabled(false);
        }

        // Gold
        if (numberOfResource && numberOfResource!.numOfGold < 30) {
            setIs30GoldDisabled(true);
        }
        else {
            setIs30GoldDisabled(false);
        }

        if (numberOfResource && numberOfResource!.numOfGold < 100) {
            setIs100GoldDisabled(true);
        }
        else {
            setIs100GoldDisabled(false);
        }

        if (numberOfResource && numberOfResource!.numOfGold < 500) {
            setIs500GoldDisabled(true);
        }
        else {
            setIs500GoldDisabled(false);
        }

    }, [numberOfResource])

    useEffect(() => {
        if (numFood && numFood.toString().length === 0) {
            setIsFoodDisabled(true);
        }

        if (numberOfResource && (parseInt(numFood) <= numberOfResource!.numOfFood && parseInt(numFood) > 0)) {
            setIsFoodDisabled(false);
        } else {
            setIsFoodDisabled(true);
        }
    }, [numFood, numberOfResource]);

    useEffect(() => {
        if (numWood && numWood.toString().length === 0) {
            setIsWoodDisabled(true);
        }

        if (numberOfResource && (parseInt(numWood) <= numberOfResource!.numOfWood && parseInt(numWood) > 0)) {
            setIsWoodDisabled(false);
        } else {
            setIsWoodDisabled(true);
        }
    }, [numWood, numberOfResource]);

    useEffect(() => {
        if (numGold && numGold.toString().length === 0) {
            setIsGoldDisabled(true);
        }

        if (numberOfResource && (parseInt(numGold) <= numberOfResource!.numOfGold && parseInt(numGold) > 0)) {
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

    const handle30ResourceSell = async ({ resourceType }: any) => {
        if (resourceType !== undefined) {
            console.log("resource type var")
            const tx = await systemCalls.sellResource(1, 30, resourceType);
            if (tx) {
                console.log("Success sell during 30 resource sell.")
            }
            else {
                console.log("Error occured during 30 resource sell.")
            }
        }
    }

    const handle100ResourceSell = async ({ resourceType }: any) => {
        if (resourceType !== undefined) {
            const tx = await systemCalls.sellResource(1, 100, resourceType);
            if (tx) {
                console.log("Success sell during 100 resource sell.")
            }
            else {
                console.log("Error occured during 100 resource sell.")
            }
        }
    }

    const handle500ResourceSell = async ({ resourceType }: any) => {
        if (resourceType !== undefined) {
            const tx = await systemCalls.sellResource(1, 500, resourceType);
            if (tx) {
                console.log("Success sell during 500 resource sell.")
            }
            else {
                console.log("Error occured during 500 resource sell.")
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
        height: "500px",
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
                        <ResourceCard resourceEmoji={"🌽"}
                            resourceName={"Food"}
                            setResourceCount={setNumFood}
                            resourceType={0}
                            isDisabled={isFoodDisabled}
                            is30Disabled={is30FoodDisabled}
                            is100Disabled={is100FoodDisabled}
                            is500Disabled={is500FoodDisabled}
                            handle30ResourceSell={handle30ResourceSell}
                            handle100ResourceSell={handle100ResourceSell}
                            handle500ResourceSell={handle500ResourceSell}
                            handleSell={handleFoodSell} />
                        <ResourceCard resourceEmoji={"🪓"}
                            resourceName={"Wood"}
                            setResourceCount={setNumWood}
                            resourceType={1}
                            isDisabled={isWoodDisabled}
                            is30Disabled={is30WoodDisabled}
                            is100Disabled={is100WoodDisabled}
                            is500Disabled={is500WoodDisabled}
                            handle30ResourceSell={handle30ResourceSell}
                            handle100ResourceSell={handle100ResourceSell}
                            handle500ResourceSell={handle500ResourceSell}
                            handleSell={handleWoodSell} />
                        <ResourceCard resourceEmoji={"⛏️"}
                            resourceName={"Gold"}
                            setResourceCount={setNumGold}
                            resourceType={2}
                            isDisabled={isGoldDisabled}
                            is30Disabled={is30GoldDisabled}
                            is100Disabled={is100GoldDisabled}
                            is500Disabled={is500GoldDisabled}
                            handle30ResourceSell={handle30ResourceSell}
                            handle100ResourceSell={handle100ResourceSell}
                            handle500ResourceSell={handle500ResourceSell}
                            handleSell={handleGoldSell} />
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
    is100Disabled: boolean,
    is30Disabled: boolean,
    is500Disabled: boolean,
    handle30ResourceSell: any,
    handle100ResourceSell: any,
    handle500ResourceSell: any,
    resourceType: number,
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
                    className="form-control"
                    type="number"
                    id={props.resourceName}
                    onChange={(e: any) => props.setResourceCount(e.target.value)}
                    onClick={(e: any) => e.target.select()} />
            </div>
            <SellButton isDisabled={props.isDisabled} handleSell={props.handleSell} numOfResource={""} resourceEmoji={props.resourceEmoji} />
            <AutoSellButton isDisabled={props.is30Disabled} resourceType={props.resourceType} handleSell={props.handle30ResourceSell} numOfResource={"30"} resourceEmoji={props.resourceEmoji} />
            <AutoSellButton isDisabled={props.is100Disabled} resourceType={props.resourceType} handleSell={props.handle100ResourceSell} numOfResource={"100"} resourceEmoji={props.resourceEmoji} />
            <AutoSellButton isDisabled={props.is500Disabled} resourceType={props.resourceType} handleSell={props.handle500ResourceSell} numOfResource={"500"} resourceEmoji={props.resourceEmoji} />
        </div>
    )
}

interface SellButtonPropTypes {
    isDisabled: boolean,
    handleSell: any,
    resourceEmoji: string,
    numOfResource: string
}

const SellButton = (props: SellButtonPropTypes) => {
    return (
        <Button
            colorScheme="whatsapp"
            border="solid"
            fontSize="13px"
            textColor="dark"
            className="w-75"
            mt={4}
            isDisabled={props.isDisabled}
            onClick={() => props.handleSell()}
        >
            Sell {props.numOfResource} {props.resourceEmoji}
        </Button>
    )
}

interface AutoSellButtonPropTypes {
    isDisabled: boolean,
    handleSell: any,
    resourceEmoji: string,
    numOfResource: string,
    resourceType: number
}

const AutoSellButton = (props: AutoSellButtonPropTypes) => {
    return (
        <Button
            colorScheme="orange"
            border="solid"
            fontSize="13px"
            textColor="dark"
            className="w-75"
            mt={4}
            isDisabled={props.isDisabled}
            onClick={() => props.handleSell({ resourceType: props.resourceType })}
        >
            Sell {props.numOfResource} {props.resourceEmoji}
        </Button>
    )
}