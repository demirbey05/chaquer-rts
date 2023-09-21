import { getNumberFromBigInt } from "../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";
import { useResourcePrices } from "../../hooks/EconomyHooks/useResourcePrices";

export const ResourcePrices = () => {
    const resourcePrices = useResourcePrices(1);

    return (
        <div>
            <PriceListItem name={"Gold/per"} isFleetPrices={false} price={resourcePrices && resourcePrices.priceGold} />
            <PriceListItem name={"Wood/per"} isFleetPrices={false} price={resourcePrices && resourcePrices.priceWood} />
            <PriceListItem name={"Food/per"} isFleetPrices={false} price={resourcePrices && resourcePrices.priceFood} />
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