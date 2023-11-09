import { useResourcePrices } from "../../hooks/EconomyHooks/useResourcePrices";
import creditIcon from '../../images/resourceAssets/credit_icon.png'
import cornIcon from '../../images/resourceAssets/corn_icon.png'
import woodIcon from '../../images/resourceAssets/wood_icon.png'
import diomand from '../../images/resourceAssets/diomand_icon.png'

export const ResourceBuyPrices = () => {
    const resourcePrices = useResourcePrices();

    return (
        <div>
            <PriceListItem
                name={cornIcon}
                price={resourcePrices.foodPrice} />
            <PriceListItem
                name={woodIcon}
                price={resourcePrices.woodPrice} />
            <PriceListItem
                name={diomand}
                price={resourcePrices.goldPrice} />
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
            <img className="ms-2" src={props.name} alt="icon" width={"20px"} height={"20px"} />
        </span>
        <span className="me-2 d-flex align-items-center">
            {props.price && (props.price * 1.5).toString().slice(0, 12)}
            <img className="ms-2" src={creditIcon} alt="credit-icon" width={"15px"} height={"15px"} />
        </span>
    </p>
}