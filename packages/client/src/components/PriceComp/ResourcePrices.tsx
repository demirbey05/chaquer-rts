import { useResourcePrices } from "../../hooks/EconomyHooks/useResourcePrices";

export const ResourcePrices = () => {
    const resourcePrices = useResourcePrices();

    return (
        <div>
            <PriceListItem name={"Food/per"} isFleetPrices={false} price={resourcePrices.foodPrice} />
            <PriceListItem name={"Wood/per"} isFleetPrices={false} price={resourcePrices.woodPrice} />
            <PriceListItem name={"Gold/per"} isFleetPrices={false} price={resourcePrices.goldPrice} />
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