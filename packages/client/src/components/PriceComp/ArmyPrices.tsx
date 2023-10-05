import { useArmyPrices } from "../../hooks/EconomyHooks/useArmyPrices";

export const ArmyPrices = () => {
    const armyPrices = useArmyPrices();

    return (
        <div className="mt-2">
            <PriceListItem name={"Swordsman/per"} isFleetPrices={false} price={armyPrices.swordsmanPrice} />
            <PriceListItem name={"Archer/per"} isFleetPrices={false} price={armyPrices.archerPrice} />
            <PriceListItem name={"Cavalry/per"} isFleetPrices={false} price={armyPrices.cavalryPrice} />
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
                    {props.price && props.price.toString().slice(0, 12)} 💰
                </span> :
                <span className="me-2">
                    {props.price && props.price}
                </span>
        }
    </p>
}