import { Tooltip } from '@chakra-ui/react';
import { useNumberOfWood } from '../../../hooks/ResourceHooks/useNumberOfResource';
import woodIcon from '../../../images/resourceAssets/wood_icon.png'

export const WoodCount = () => {
    const numberOfWood = useNumberOfWood()

    return (
        <div className="col-3 mine-progress-bar-col">
            <Tooltip label='Wood' placement='bottom' >
                <img className='me-2' src={woodIcon} width={"30px"} height={"30px"} alt="food-icon" />
            </Tooltip>
            : {numberOfWood}
        </div>
    )
}