import { Tooltip } from '@chakra-ui/react';
import { useNumberOfFood } from '../../../hooks/ResourceHooks/useNumberOfResource';
import foodIcon from '../../../images/resourceAssets/corn_icon.png'

export const FoodCount = () => {
    const numberOfFood = useNumberOfFood()

    return (
        <div className="col-3 mine-progress-bar-col">
            <Tooltip label='Food' placement='bottom' >
                <img className='me-2' src={foodIcon} width={"30px"} height={"30px"} alt="food-icon" />
            </Tooltip>
            : {numberOfFood}
        </div>
    )
}