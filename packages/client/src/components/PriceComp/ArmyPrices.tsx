import { useArmyPrices } from "../../hooks/EconomyHooks/useArmyPrices";
import creditIcon from '../../images/resourceAssets/credit_icon.png'

export const ArmyPrices = () => {
    const armyPrices = useArmyPrices();

    return (
        <div className="mt-2">
            <PriceListItem
                name={"Swordsman"}
                price={armyPrices.swordsmanPrice} />
            <PriceListItem
                name={"Archer"}
                price={armyPrices.archerPrice} />
            <PriceListItem
                name={"Cavalry"}
                price={armyPrices.cavalryPrice} />
        </div>
    )
}

interface PriceListItemPropTypes {
    name: string,
    price: any,
}

const PriceListItem = (props: PriceListItemPropTypes) => {
    return <p className="d-flex justify-between">
        <span className="ms-2">
            {props.name}
        </span>
        {
            <span className="me-2 d-flex align-items-center">
                {props.price && props.price.toString().slice(0, 12)}
                <img className="ms-2" src={creditIcon} alt="credit-icon" width={"15px"} height={"15px"} />
            </span>
        }
    </p>
}