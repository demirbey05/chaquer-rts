import { Tooltip } from '@chakra-ui/react';
import { useNumberOfDiomand } from '../../../hooks/ResourceHooks/useNumberOfResource';
import diomandIcon from '../../../images/resourceAssets/diomand_icon.png'

export const GoldCount = () => {
    const numberOfDiomand = useNumberOfDiomand()

    return (
        <div className="col-3 mine-progress-bar-col">
            <Tooltip label='Diomand' placement='bottom' >
                <img className='me-2' src={diomandIcon} width={"30px"} height={"30px"} alt="food-icon" />
            </Tooltip>
            : {numberOfDiomand}
        </div>
    )
}