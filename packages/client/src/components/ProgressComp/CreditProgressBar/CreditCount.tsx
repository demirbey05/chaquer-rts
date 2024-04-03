import { Tooltip, useMediaQuery } from '@chakra-ui/react';
import { useGame } from '../../../context/GameContext';
import { usePlayer } from '../../../context/PlayerContext';
import { useCredit } from '../../../hooks/EconomyHooks/useCredit';
import { getNumberFromBigInt } from "../../../utils/helperFunctions/CustomFunctions/getNumberFromBigInt";
import creaditIcon from '../../../images/resourceAssets/credit_icon.png'

export const CreditCount = () => {
    const { userWallet } = usePlayer();
    const { gameID } = useGame();

    const credit = useCredit(gameID, userWallet);

    const [isSmallerThan900] = useMediaQuery('(max-width: 900px)')
    const [isSmallerThan1200] = useMediaQuery('(max-width: 1200px)')

    return (
        <div className='d-flex align-items-center'>
            <Tooltip label='Credit' placement='bottom' >
                <img className='me-2' src={creaditIcon} width={"15%"} alt='credit-icon' />
            </Tooltip>
            : {Credit(credit, isSmallerThan900, isSmallerThan1200)}
        </div>
    )
}

const Credit = (credit: any, isSmallerThan900: boolean, isSmallerThan1200: boolean) => {
    if (credit) {
        if (isSmallerThan900) {
            return getNumberFromBigInt(credit).slice(0, 4)
        } else if (isSmallerThan1200) {
            return getNumberFromBigInt(credit).slice(0, 6)
        } else {
            return getNumberFromBigInt(credit).slice(0, 12)
        }
    } else {
        return "0"
    }
}