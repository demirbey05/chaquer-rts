import { useCastle } from "../../context/CastleContext"

export const CastleSettleWarning = () => {
  const { isCastleSettled } = useCastle();

  if (!isCastleSettled) {
    return (
      <div className='warning-on-top'>
        <h2>
          Click land tiles to settle your castle
        </h2>
      </div>
    )
  } else {
    return null;
  }
}