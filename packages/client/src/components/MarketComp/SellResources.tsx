import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { useMUD } from "../../context/MUDContext";
import { usePlayer } from '../../context/PlayerContext';
import { useError } from "../../context/ErrorContext";
import { useNumberOfResource } from '../../hooks/ResourceHooks/useNumberOfResource';

interface SellResourcesPropTypes {
    setIsLoading: (value: boolean) => void
}

export const SellResources = (props: SellResourcesPropTypes) => {
    const { systemCalls } = useMUD();
    const { userWallet } = usePlayer();
    const { setShowError, setErrorMessage, setErrorTitle } = useError();

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

    const numberOfResource: any = useNumberOfResource(userWallet, 1);

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
        props.setIsLoading(true);
        if (numFood.length > 0) {
            const tx = await systemCalls.sellResource(1, parseInt(numFood), 0);
            if (tx) {
                setNumFood('');
                (document.getElementById('Food') as HTMLInputElement).value = '';
            } else {
                setErrorMessage("You have no enough wood!");
                setErrorTitle("Food Selling Error");
                setShowError(true);
            }
        }
        props.setIsLoading(false);
    }

    const handleWoodSell = async () => {
        props.setIsLoading(true);
        if (numWood.length > 0) {
            const tx = await systemCalls.sellResource(1, parseInt(numWood), 1);
            if (tx) {
                setNumWood('');
                (document.getElementById('Wood') as HTMLInputElement).value = '';
            } else {
                setErrorMessage("You have no enough wood!");
                setErrorTitle("Wood Selling Error");
                setShowError(true);
            }
        }
        props.setIsLoading(false);
    }

    const handleGoldSell = async () => {
        props.setIsLoading(true);
        if (numGold.length > 0) {
            const tx = await systemCalls.sellResource(1, parseInt(numGold), 2);
            if (tx) {
                setNumGold('');
                (document.getElementById('Gold') as HTMLInputElement).value = '';
            } else {
                setErrorMessage("You have no enough gold!");
                setErrorTitle("Gold Selling Error");
                setShowError(true);
            }
        }
        props.setIsLoading(false);
    }


    const handle30ResourceSell = async ({ resourceType }: any) => {
        if (resourceType !== undefined) {
            props.setIsLoading(true)
            const tx = await systemCalls.sellResource(1, 30, resourceType);
            if (tx === null) {
                setErrorMessage("You have no 30 resources.")
                setErrorTitle("Resource Selling Error");
                setShowError(true);
            }
        }
        props.setIsLoading(false)
    }

    const handle100ResourceSell = async ({ resourceType }: any) => {
        if (resourceType !== undefined) {
            props.setIsLoading(true)
            const tx = await systemCalls.sellResource(1, 100, resourceType);
            if (tx === null) {
                setErrorMessage("You have no 100 resources.")
                setErrorTitle("Resource Selling Error");
                setShowError(true);
            }
        }
        props.setIsLoading(false)
    }

    const handle500ResourceSell = async ({ resourceType }: any) => {
        if (resourceType !== undefined) {
            props.setIsLoading(true)
            const tx = await systemCalls.sellResource(1, 500, resourceType);
            if (tx === null) {
                setErrorMessage("You have no 500 resources.")
                setErrorTitle("Resource Selling Error");
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
    handleSell: any
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
                    id={props.resourceName}
                    onChange={(e: any) => props.setResourceCount(e.target.value)}
                    onClick={(e: any) => e.target.select()} />
            </div>
            <ManualButton isDisabled={props.isDisabled} handleSell={props.handleSell} numOfResource={""} resourceEmoji={props.resourceEmoji} />
            <AutoButton isDisabled={props.is30Disabled} resourceType={props.resourceType} handleSell={props.handle30ResourceSell} numOfResource={"30"} resourceEmoji={props.resourceEmoji} />
            <AutoButton isDisabled={props.is100Disabled} resourceType={props.resourceType} handleSell={props.handle100ResourceSell} numOfResource={"100"} resourceEmoji={props.resourceEmoji} />
            <AutoButton isDisabled={props.is500Disabled} resourceType={props.resourceType} handleSell={props.handle500ResourceSell} numOfResource={"500"} resourceEmoji={props.resourceEmoji} />
        </div>
    )
}

interface ManualButtonPropTypes {
    isDisabled: boolean,
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
            isDisabled={props.isDisabled}
            onClick={() => props.handleSell()}
        >
            Sell {props.numOfResource} {props.resourceEmoji}
        </Button>
    )
}

interface AutoButtonPropTypes {
    isDisabled: boolean,
    handleSell: any,
    resourceEmoji: string,
    numOfResource: string,
    resourceType: number
}

const AutoButton = (props: AutoButtonPropTypes) => {
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
