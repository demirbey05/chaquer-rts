import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { useMUD } from "../../context/MUDContext";
import { useError } from "../../context/ErrorContext";
import { useNumberOfDiomand, useNumberOfFood, useNumberOfWood } from '../../hooks/ResourceHooks/useNumberOfResource';
import { useGame } from "../../context/GameContext";
import cornIcon from '../../images/resourceAssets/corn_icon.png'
import woodIcon from '../../images/resourceAssets/wood_icon.png'
import diomandIcon from '../../images/resourceAssets/diomand_icon.png'

interface SellResourcesPropTypes {
    setIsLoading: (value: boolean) => void,
    isLoading: boolean
}

export const SellResources = (props: SellResourcesPropTypes) => {
    const { systemCalls } = useMUD();
    const { gameID } = useGame();
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

    const numberOfFood = useNumberOfFood()
    const numberOfWood = useNumberOfWood()
    const numberOfDiomand = useNumberOfDiomand()

    useEffect(() => {
        if (numberOfFood >= 30) {
            setIs30FoodDisabled(false);
        }
        else {
            setIs30FoodDisabled(true);
        }

        if (numberOfFood >= 100) {
            setIs100FoodDisabled(false);
        }
        else {
            setIs100FoodDisabled(true);
        }

        if (numberOfFood >= 500) {
            setIs500FoodDisabled(false);
        }
        else {
            setIs500FoodDisabled(true);
        }
    }, [numberOfFood])

    useEffect(() => {
        if (numberOfWood >= 30) {
            setIs30WoodDisabled(false);
        }
        else {
            setIs30WoodDisabled(true);
        }

        if (numberOfWood >= 100) {
            setIs100WoodDisabled(false);
        }
        else {
            setIs100WoodDisabled(true);
        }

        if (numberOfWood >= 500) {
            setIs500WoodDisabled(false);
        }
        else {
            setIs500WoodDisabled(true);
        }
    }, [numberOfWood])

    useEffect(() => {
        if (numberOfDiomand >= 30) {
            setIs30GoldDisabled(false);
        }
        else {
            setIs30GoldDisabled(true);
        }

        if (numberOfDiomand >= 100) {
            setIs100GoldDisabled(false);
        }
        else {
            setIs100GoldDisabled(true);
        }

        if (numberOfDiomand >= 500) {
            setIs500GoldDisabled(false);
        }
        else {
            setIs500GoldDisabled(true);
        }

    }, [numberOfDiomand])

    useEffect(() => {
        if (numFood && numFood.toString().length === 0) {
            setIsFoodDisabled(true);
        }

        if (parseInt(numFood) <= numberOfFood && parseInt(numFood) > 0) {
            setIsFoodDisabled(false);
        } else {
            setIsFoodDisabled(true);
        }
    }, [numFood, numberOfFood]);

    useEffect(() => {
        if (numWood && numWood.toString().length === 0) {
            setIsWoodDisabled(true);
        }

        if (parseInt(numWood) <= numberOfWood && parseInt(numWood) > 0) {
            setIsWoodDisabled(false);
        } else {
            setIsWoodDisabled(true);
        }
    }, [numWood, numberOfWood]);

    useEffect(() => {
        if (numGold && numGold.toString().length === 0) {
            setIsGoldDisabled(true);
        }

        if (parseInt(numGold) <= numberOfDiomand && parseInt(numGold) > 0) {
            setIsGoldDisabled(false);
        } else {
            setIsGoldDisabled(true);
        }
    }, [numGold, numberOfDiomand]);

    const handleFoodSell = async () => {
        props.setIsLoading(true);
        if (numFood.length > 0) {
            const tx = await systemCalls.sellResource(gameID, parseInt(numFood), 0);
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
            const tx = await systemCalls.sellResource(gameID, parseInt(numWood), 1);
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
            const tx = await systemCalls.sellResource(gameID, parseInt(numGold), 2);
            if (tx) {
                setNumGold('');
                (document.getElementById('Diomand') as HTMLInputElement).value = '';
            } else {
                setErrorMessage("You have no enough diomand!");
                setErrorTitle("Diomand Selling Error");
                setShowError(true);
            }
        }
        props.setIsLoading(false);
    }


    const handle30ResourceSell = async ({ resourceType }: any) => {
        if (resourceType !== undefined) {
            props.setIsLoading(true)
            const tx = await systemCalls.sellResource(gameID, 30, resourceType);
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
            const tx = await systemCalls.sellResource(gameID, 100, resourceType);
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
            const tx = await systemCalls.sellResource(gameID, 500, resourceType);
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
            <ResourceCard resourceEmoji={cornIcon}
                resourceName={"Food"}
                setResourceCount={setNumFood}
                resourceType={0}
                isDisabled={isFoodDisabled}
                isLoading={props.isLoading}
                is30Disabled={is30FoodDisabled}
                is100Disabled={is100FoodDisabled}
                is500Disabled={is500FoodDisabled}
                handle30ResourceSell={handle30ResourceSell}
                handle100ResourceSell={handle100ResourceSell}
                handle500ResourceSell={handle500ResourceSell}
                handleSell={handleFoodSell} />
            <ResourceCard resourceEmoji={woodIcon}
                resourceName={"Wood"}
                setResourceCount={setNumWood}
                resourceType={1}
                isDisabled={isWoodDisabled}
                isLoading={props.isLoading}
                is30Disabled={is30WoodDisabled}
                is100Disabled={is100WoodDisabled}
                is500Disabled={is500WoodDisabled}
                handle30ResourceSell={handle30ResourceSell}
                handle100ResourceSell={handle100ResourceSell}
                handle500ResourceSell={handle500ResourceSell}
                handleSell={handleWoodSell} />
            <ResourceCard resourceEmoji={diomandIcon}
                resourceName={"Diomand"}
                setResourceCount={setNumGold}
                resourceType={2}
                isDisabled={isGoldDisabled}
                isLoading={props.isLoading}
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
    isLoading: boolean,
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
        <div className="col align-items-center ps-2">
            <div className="row w-100">
                <div className="d-flex justify-content-center">
                    <img src={props.resourceEmoji} width={"30px"} height={"30px"} alt={props.resourceName} />
                </div>
            </div>
            <div className="row justify-content-center text-center border-1 mt-2 w-100">
                {props.resourceName}
            </div>
            <div className="row mt-2 w-100">
                <input
                    className="form-control dark-input bg-dark text-white"
                    placeholder={`# of ${props.resourceName}`}
                    type="number"
                    id={props.resourceName}
                    onChange={(e: any) => props.setResourceCount(e.target.value)}
                    onClick={(e: any) => e.target.select()} />
            </div>
            <ManualButton
                isLoading={props.isLoading}
                isDisabled={props.isDisabled}
                handleSell={props.handleSell}
                numOfResource={""}
                resourceEmoji={props.resourceEmoji} />
            <AutoButton
                isLoading={props.isLoading}
                isDisabled={props.is30Disabled}
                resourceType={props.resourceType}
                handleSell={props.handle30ResourceSell}
                numOfResource={"30"}
                resourceEmoji={props.resourceEmoji} />
            <AutoButton
                isLoading={props.isLoading}
                isDisabled={props.is100Disabled}
                resourceType={props.resourceType}
                handleSell={props.handle100ResourceSell}
                numOfResource={"100"}
                resourceEmoji={props.resourceEmoji} />
            <AutoButton
                isLoading={props.isLoading}
                isDisabled={props.is500Disabled}
                resourceType={props.resourceType}
                handleSell={props.handle500ResourceSell}
                numOfResource={"500"}
                resourceEmoji={props.resourceEmoji} />
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
            borderRadius={"15px"}
            boxShadow={"0px 5px 0px 0px #33550F"}
            mt={3}
            isDisabled={props.isDisabled || props.isLoading}
            onClick={() => props.handleSell()}
        >
            Sell {props.numOfResource}
            <img className="ms-1" src={props.resourceEmoji} width={"20px"} height={"20px"} alt="icon" />
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
            colorScheme="orange"
            borderRadius={"15px"}
            boxShadow={"0px 5px 0px 0px #AC5E00"}
            fontSize="13px"
            mt={3}
            isDisabled={props.isDisabled || props.isLoading}
            onClick={() => props.handleSell({ resourceType: props.resourceType })}
        >
            Sell {props.numOfResource}
            <img className="ms-1" src={props.resourceEmoji} width={"20px"} height={"20px"} alt="icon" />
        </Button>
    )
}
