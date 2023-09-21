import { useFleet } from "../../context/FleetContext";

export const FleetSettleWarning = () => {
  const { fleetSettleStage } = useFleet();
  if (fleetSettleStage) {
    return (
      <div className='warning-on-top'>
        <h2>
          Click orange tiles to settle fleet
        </h2>
      </div>
    );
  } else {
    return null;
  }
}
