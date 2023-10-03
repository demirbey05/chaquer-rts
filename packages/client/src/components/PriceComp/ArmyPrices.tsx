import { useGame } from "../../context/GameContext";
import { useArmyPrices } from "../../hooks/EconomyHooks/useArmyPrices";
import { getNumberFromBigInt } from "../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";

export const ArmyPrices = () => {
    const { gameID } = useGame();
    const armyPrices = useArmyPrices(gameID);

    return (
        <div className="mt-2">
            <PriceListItem name={"Swordsman/per"} isFleetPrices={false} price={armyPrices && armyPrices.priceSwordsman} />
            <PriceListItem name={"Archer/per"} isFleetPrices={false} price={armyPrices && armyPrices.priceArcher} />
            <PriceListItem name={"Cavalry/per"} isFleetPrices={false} price={armyPrices && armyPrices.priceCavalry} />
        </div>
    )
}

interface PriceListItemPropTypes {
    name: string,
    price: any,
    isFleetPrices: boolean
}

const PriceListItem = (props: PriceListItemPropTypes) => {
    return <p className="d-flex justify-between">
        <span className="ms-2">
            {props.name}
        </span>
        {
            !props.isFleetPrices ?
                <span className="me-2">
                    {props.price && getNumberFromBigInt(props.price).slice(0, 12)} 💰
                </span> :
                <span className="me-2">
                    {props.price && props.price}
                </span>
        }
    </p>
}