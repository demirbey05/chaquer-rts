import { useArmy } from "../../context/ArmyContext";

export const ArmySettleWarning = () => {
  const { isArmySettleStage } = useArmy();

  if (isArmySettleStage) {
    return (
      <div className='warning-on-top'>
        <h2>
          Click orange tiles to settle army
        </h2>
      </div>
    );
  } else {
    return null;
  }
}
