import creditIcon from '../../images/resourceAssets/credit_icon.png'
import woodIcon from '../../images/resourceAssets/wood_icon.png'

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
            <PriceListItem
                name={"Baron's Dagger"}
                creditPrice={`${fleetPrices.smallShipCredit}`}
                woodPrice={`${fleetPrices.smallShipWood}`} />
            <PriceListItem
                name={"Knight's Galley"}
                creditPrice={`${fleetPrices.mediumShipCredit}`}
                woodPrice={`${fleetPrices.mediumShipWood}`} />
            <PriceListItem
                name={"King's Leviathan"}
                creditPrice={`${fleetPrices.bigShipCredit}`}
                woodPrice={`${fleetPrices.bigShipWood}`} />
        </div>
    )
}

interface PriceListItemPropTypes {
    name: string,
    creditPrice: any,
    woodPrice: any
}

const PriceListItem = (props: PriceListItemPropTypes) => {
    return <p className="d-flex justify-between">
        <span className="ms-2">
            {props.name}
        </span>
        {
            <span className="me-2 d-flex">
                {props.creditPrice && props.creditPrice}
                <img className="ms-2" src={creditIcon} alt="credit-icon" width={"15px"} height={"15px"} />
                <span className='ms-2 me-2'>+</span>
                {props.woodPrice && props.woodPrice}
                <img className="ms-2" src={woodIcon} alt="credit-icon" width={"15px"} height={"15px"} />
            </span>
        }
    </p>
}