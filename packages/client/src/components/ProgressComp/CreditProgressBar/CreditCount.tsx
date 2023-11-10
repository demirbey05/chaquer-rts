import { Tooltip } from '@chakra-ui/react';
import { useGame } from '../../../context/GameContext';
import { usePlayer } from '../../../context/PlayerContext';
import { useCredit } from '../../../hooks/EconomyHooks/useCredit';
import { getNumberFromBigInt } from "../../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";
import creaditIcon from '../../../images/resourceAssets/credit_icon.png'

export const CreditCount = () => {
    const { userWallet } = usePlayer();
    const { gameID } = useGame();
    const credit = useCredit(gameID, userWallet);
    return (
        <div className='d-flex'>
            <Tooltip label='Credit' placement='bottom' >
                <img className='me-2' src={creaditIcon} width={"25px"} height={"25px"} alt='credit-icon' />
            </Tooltip>
            : {credit ? getNumberFromBigInt(credit).slice(0, 12) : 0}
        </div>
    )
}