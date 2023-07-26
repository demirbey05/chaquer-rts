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
    const numberOfResource = useNumberOfResource(userWallet!.address, 1)?.value;

    useEffect(() => {
        if (numFood && numFood.toString().length === 0) {
            setIsFoodDisabled(true);
        }

        if (numberOfResource && (parseInt(numFood) < numberOfResource!.numOfFood)) {
            setIsFoodDisabled(false);
        } else {
            setIsFoodDisabled(true);
        }
    }, [numFood, numberOfResource]);

    useEffect(() => {
        if (numWood && numWood.toString().length === 0) {
            setIsWoodDisabled(true);
        }

        if (numberOfResource && (parseInt(numWood) < numberOfResource!.numOfWood)) {
            setIsWoodDisabled(false);
        } else {
            setIsWoodDisabled(true);
        }
    }, [numWood, numberOfResource]);

    useEffect(() => {
        if (numGold && numGold.toString().length === 0) {
            setIsGoldDisabled(true);
        }

        if (numberOfResource && (parseInt(numGold) < numberOfResource!.numOfGold)) {
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
        height: "325px",
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
                <div className="offcanvas-header border-bottom" style={{ cursor: "move" }}>
                    <h5 className="offcanvas-title font-extrabold" id="marketDrawerLabel">Market</h5>
                    <button type="button" data-bs-dismiss="offcanvas" aria-label="Close">&#10008;</button>
                </div>
                <div className="offcanvas-body">
                    <Tooltip label="You can make credit by selling the resources!" placement="top-start" bg="green.400" fontSize="md">
                        <h4 className="border-bottom text-center p-2 font-bold">Sell Resource</h4>
                    </Tooltip>
                    <div className="d-flex align-middle justify-center mt-2">
                        <ResourceCard resourceEmoji={"🌽"} resourceName={"Food"} setResourceCount={setNumFood} isDisabled={isFoodDisabled} handleSell={handleFoodSell} />
                        <ResourceCard resourceEmoji={"🪓"} resourceName={"Wood"} setResourceCount={setNumWood} isDisabled={isWoodDisabled} handleSell={handleWoodSell} />
                        <ResourceCard resourceEmoji={"⛏️"} resourceName={"Gold"} setResourceCount={setNumGold} isDisabled={isGoldDisabled} handleSell={handleGoldSell} />
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
            data-bs-dismiss="modal"
            className="w-75"
            mt={4}
            isDisabled={props.isDisabled}
            onClick={() => props.handleSell()}
        >
            Sell {props.resourceName}
        </Button>
    )
}
