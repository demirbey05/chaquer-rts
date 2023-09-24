import { useState, useEffect } from "react";
import { Button } from '@chakra-ui/react';
import { useError } from "../../context/ErrorContext";
import { useMUD } from "../../context/MUDContext";
import { useResourcesInStoke } from "../../hooks/ResourceHooks/useResourcesInStoke";
import { useResourcePrices } from "../../hooks/EconomyHooks/useResourcePrices";
import { useCredit } from "../../hooks/EconomyHooks/useCredit";
import { usePlayer } from "../../context/PlayerContext";
import { getNumberFromBigInt } from "../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";

interface BuyResourcesPropTypes {
    setIsLoading: (value: boolean) => void,
    isLoading: boolean
}

export const BuyResources = (props: BuyResourcesPropTypes) => {
    const { systemCalls } = useMUD();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();
    const { userWallet } = usePlayer();

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

    const resourceInStock = useResourcesInStoke(1);
    const resourcePrices = useResourcePrices(1);
    const myCredit = useCredit(1, userWallet);

    useEffect(() => {
        if (resourceInStock && resourcePrices && myCredit) {
            // Food
            if (Number(resourceInStock!.foodSold) >= 30 && (Number(getNumberFromBigInt(resourcePrices.priceFood)) * 30) <= Number(getNumberFromBigInt(myCredit))) {
                setIs30FoodDisabled(false);
            }
            else {
                setIs30FoodDisabled(true);
            }

            if (Number(resourceInStock!.foodSold) >= 100 && (Number(getNumberFromBigInt(resourcePrices.priceFood)) * 100) <= Number(getNumberFromBigInt(myCredit))) {
                setIs100FoodDisabled(false);
            }
            else {
                setIs100FoodDisabled(true);
            }

            if (Number(resourceInStock!.foodSold) >= 500 && (Number(getNumberFromBigInt(resourcePrices.priceFood)) * 500) <= Number(getNumberFromBigInt(myCredit))) {
                setIs500FoodDisabled(false);
            }
            else {
                setIs500FoodDisabled(true);
            }

            // Wood
            if (Number(resourceInStock!.woodSold) >= 30 && (Number(getNumberFromBigInt(resourcePrices.priceWood)) * 30) <= Number(getNumberFromBigInt(myCredit))) {
                setIs30WoodDisabled(false);
            }
            else {
                setIs30WoodDisabled(true);
            }

            if (Number(resourceInStock!.woodSold) >= 100 && (Number(getNumberFromBigInt(resourcePrices.priceWood)) * 100) <= Number(getNumberFromBigInt(myCredit))) {
                setIs100WoodDisabled(false);
            }
            else {
                setIs100WoodDisabled(true);
            }

            if (Number(resourceInStock!.woodSold) >= 500 && (Number(getNumberFromBigInt(resourcePrices.priceWood)) * 500) <= Number(getNumberFromBigInt(myCredit))) {
                setIs500WoodDisabled(false);
            }
            else {
                setIs500WoodDisabled(true);
            }

            // Gold
            if (Number(resourceInStock!.goldSold) >= 30 && (Number(getNumberFromBigInt(resourcePrices.priceGold)) * 30) <= Number(getNumberFromBigInt(myCredit))) {
                setIs30GoldDisabled(false);
            }
            else {
                setIs30GoldDisabled(true);
            }

            if (Number(resourceInStock!.goldSold) >= 100 && (Number(getNumberFromBigInt(resourcePrices.priceGold)) * 100) <= Number(getNumberFromBigInt(myCredit))) {
                setIs100GoldDisabled(false);
            }
            else {
                setIs100GoldDisabled(true);
            }

            if (Number(resourceInStock!.goldSold) >= 500 && (Number(getNumberFromBigInt(resourcePrices.priceGold)) * 500) <= Number(getNumberFromBigInt(myCredit))) {
                setIs500GoldDisabled(false);
            }
            else {
                setIs500GoldDisabled(true);
            }
        }
    }, [resourceInStock, myCredit, resourcePrices])

    useEffect(() => {
        if (numFood && numFood.toString().length === 0) {
            setIsFoodDisabled(true);
        }

        if (resourceInStock && (parseInt(numFood) <= Number(resourceInStock!.foodSold) && parseInt(numFood) > 0)) {
            setIsFoodDisabled(false);
        } else {
            setIsFoodDisabled(true);
        }
    }, [numFood, resourceInStock]);

    useEffect(() => {
        if (numWood && numWood.toString().length === 0) {
            setIsWoodDisabled(true);
        }

        if (resourceInStock && (parseInt(numWood) <= Number(resourceInStock!.woodSold) && parseInt(numWood) > 0)) {
            setIsWoodDisabled(false);
        } else {
            setIsWoodDisabled(true);
        }
    }, [numWood, resourceInStock]);

    useEffect(() => {
        if (numGold && numGold.toString().length === 0) {
            setIsGoldDisabled(true);
        }

        if (resourceInStock && (parseInt(numGold) <= Number(resourceInStock!.goldSold) && parseInt(numGold) > 0)) {
            setIsGoldDisabled(false);
        } else {
            setIsGoldDisabled(true);
        }
    }, [numGold, resourceInStock]);

    const handleFoodBuy = async () => {
        if (numFood.length > 0) {
            props.setIsLoading(true)
            const tx = await systemCalls.buyResource(1, parseInt(numFood), 0);
            if (tx) {
                setNumFood('');
                (document.getElementById('BuyFood') as HTMLInputElement).value = '';
            }
            else {
                setErrorMessage("You have no enough wood!")
                setErrorTitle("You have enough credit");
                setShowError(true);
            }
        }
        props.setIsLoading(false)
    }

    const handleWoodBuy = async () => {
        if (numWood.length > 0) {
            props.setIsLoading(true)
            const tx = await systemCalls.buyResource(1, parseInt(numWood), 1);
            if (tx) {
                setNumWood('');
                (document.getElementById('BuyWood') as HTMLInputElement).value = '';
            }
            else {
                setErrorMessage("You have no enough wood!")
                setErrorTitle("You have enough credit");
                setShowError(true);
            }
        }
        props.setIsLoading(false)
    }

    const handleGoldBuy = async () => {
        if (numGold.length > 0) {
            props.setIsLoading(true)
            const tx = await systemCalls.buyResource(1, parseInt(numGold), 2);
            if (tx) {
                setNumGold('');
                (document.getElementById('BuyGold') as HTMLInputElement).value = '';
            }
            else {
                setErrorMessage("You have no enough gold!")
                setErrorTitle("You have enough credit");
                setShowError(true);
            }
        }
        props.setIsLoading(false)
    }

    const handle30ResourceBuy = async ({ resourceType }: any) => {
        if (resourceType !== undefined) {
            props.setIsLoading(true)
            const tx = await systemCalls.buyResource(1, 30, resourceType);
            if (tx === null) {
                setErrorMessage("You have enough credit.")
                setErrorTitle("Resource Buying Error");
                setShowError(true);
            }
        }
        props.setIsLoading(false)
    }

    const handle100ResourceBuy = async ({ resourceType }: any) => {
        if (resourceType !== undefined) {
            props.setIsLoading(true)
            const tx = await systemCalls.buyResource(1, 100, resourceType);
            if (tx === null) {
                setErrorMessage("You have enough credit.")
                setErrorTitle("Resource Buying Error");
                setShowError(true);
            }
        }
        props.setIsLoading(false)
    }

    const handle500ResourceBuy = async ({ resourceType }: any) => {
        if (resourceType !== undefined) {
            props.setIsLoading(true)
            const tx = await systemCalls.buyResource(1, 500, resourceType);
            if (tx === null) {
                setErrorMessage("You have enough credit.")
                setErrorTitle("Resource Buying Error");
                setShowError(true);
            }
        }
        props.setIsLoading(false)
    }

    return (
        <div className="d-flex align-middle justify-center mt-2 mb-2">
            <ResourceCard resourceEmoji={"🌽"}
                resourceName={"Food"}
                setResourceCount={setNumFood}
                resourceType={0}
                isDisabled={isFoodDisabled}
                isLoading={props.isLoading}
                is30Disabled={is30FoodDisabled}
                is100Disabled={is100FoodDisabled}
                is500Disabled={is500FoodDisabled}
                handle30ResourceBuy={handle30ResourceBuy}
                handle100ResourceBuy={handle100ResourceBuy}
                handle500ResourceBuy={handle500ResourceBuy}
                handleBuy={handleFoodBuy} />
            <ResourceCard resourceEmoji={"🪓"}
                resourceName={"Wood"}
                setResourceCount={setNumWood}
                resourceType={1}
                isDisabled={isWoodDisabled}
                isLoading={props.isLoading}
                is30Disabled={is30WoodDisabled}
                is100Disabled={is100WoodDisabled}
                is500Disabled={is500WoodDisabled}
                handle30ResourceBuy={handle30ResourceBuy}
                handle100ResourceBuy={handle100ResourceBuy}
                handle500ResourceBuy={handle500ResourceBuy}
                handleBuy={handleWoodBuy} />
            <ResourceCard resourceEmoji={"⛏️"}
                resourceName={"Gold"}
                setResourceCount={setNumGold}
                resourceType={2}
                isDisabled={isGoldDisabled}
                isLoading={props.isLoading}
                is30Disabled={is30GoldDisabled}
                is100Disabled={is100GoldDisabled}
                is500Disabled={is500GoldDisabled}
                handle30ResourceBuy={handle30ResourceBuy}
                handle100ResourceBuy={handle100ResourceBuy}
                handle500ResourceBuy={handle500ResourceBuy}
                handleBuy={handleGoldBuy} />
        </div>
    )
}

interface ResourceCardPropTypes {
    resourceEmoji: string,
    resourceName: string,
    setResourceCount: React.Dispatch<React.SetStateAction<string>>,
    isDisabled: boolean,
    isLoading: boolean,
    is100Disabled: boolean,
    is30Disabled: boolean,
    is500Disabled: boolean,
    handle30ResourceBuy: any,
    handle100ResourceBuy: any,
    handle500ResourceBuy: any,
    resourceType: number,
    handleBuy: any
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
                    className="form-control dark-input bg-dark text-white"
                    placeholder={`# of ${props.resourceName}`}
                    type="number"
                    id={"Buy" + props.resourceName}
                    onChange={(e: any) => props.setResourceCount(e.target.value)}
                    onClick={(e: any) => e.target.select()} />
            </div>
            <ManualButton isLoading={props.isLoading} isDisabled={props.isDisabled} handleSell={props.handleBuy} numOfResource={""} resourceEmoji={props.resourceEmoji} />
            <AutoButton isLoading={props.isLoading} isDisabled={props.is30Disabled} resourceType={props.resourceType} handleSell={props.handle30ResourceBuy} numOfResource={"30"} resourceEmoji={props.resourceEmoji} />
            <AutoButton isLoading={props.isLoading} isDisabled={props.is100Disabled} resourceType={props.resourceType} handleSell={props.handle100ResourceBuy} numOfResource={"100"} resourceEmoji={props.resourceEmoji} />
            <AutoButton isLoading={props.isLoading} isDisabled={props.is500Disabled} resourceType={props.resourceType} handleSell={props.handle500ResourceBuy} numOfResource={"500"} resourceEmoji={props.resourceEmoji} />
        </div>
    )
}

interface ManualButtonPropTypes {
    isDisabled: boolean,
    isLoading: boolean,
    handleSell: any,
    resourceEmoji: string,
    numOfResource: string
}

const ManualButton = (props: ManualButtonPropTypes) => {
    return (
        <Button
            colorScheme="whatsapp"
            border="solid"
            fontSize="13px"
            textColor="dark"
            className="w-75"
            mt={4}
            isDisabled={props.isDisabled || props.isLoading}
            onClick={() => props.handleSell()}
        >
            Buy {props.numOfResource} {props.resourceEmoji}
        </Button>
    )
}

interface AutoButtonPropTypes {
    isDisabled: boolean,
    isLoading: boolean,
    handleSell: any,
    resourceEmoji: string,
    numOfResource: string,
    resourceType: number
}

const AutoButton = (props: AutoButtonPropTypes) => {
    return (
        <Button
            colorScheme="red"
            border="solid"
            fontSize="13px"
            textColor="dark"
            className="w-75"
            mt={4}
            isDisabled={props.isDisabled || props.isLoading}
            onClick={() => props.handleSell({ resourceType: props.resourceType })}
        >
            Buy {props.numOfResource} {props.resourceEmoji}
        </Button>
    )
}