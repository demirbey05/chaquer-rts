import { getNumberFromBigInt } from "../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";

export const FleetPrices = () => {
    const fleetPrices = {
        smallShipCredit: 10,
        smallShipWood: 100,
        mediumShipCredit: 20,
        mediumShipWood: 200,
        bigShipCredit: 30,
        bigShipWood: 300
    }

    return (
        <div className="mt-2">
            <PriceListItem name={"Baron's Dagger/per"} isFleetPrices={true} price={`${fleetPrices.smallShipCredit} 💰 + ${fleetPrices.smallShipWood} 🪓`} />
            <PriceListItem name={"Knight's Galley/per"} isFleetPrices={true} price={`${fleetPrices.mediumShipCredit} 💰 + ${fleetPrices.mediumShipWood} 🪓`} />
            <PriceListItem name={"King's Leviathan/per"} isFleetPrices={true} price={`${fleetPrices.bigShipCredit} 💰 + ${fleetPrices.bigShipWood} 🪓`} />
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