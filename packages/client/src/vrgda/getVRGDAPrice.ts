
//@TODO auto system for getting parameters from contract
const basePriceResource = 0.1;
const basePriceArmy = 1;
const decayRatio = 0.00005;
const minePerResource = 1;
const mineRate = 10;
const blockRate = 1;


export function getResourceVRGDAPrice(sold:number, time:number,numberOfPlayers:number):number {
  return basePriceResource * Math.pow(1 + decayRatio, time - getTargetSaleTimeResource(sold,numberOfPlayers)) ;
}
export function getArmyVRGDAPrice(sold:number, time:number,numberOfPlayers:number):number {
  return basePriceArmy * Math.pow(1 - decayRatio, time - getTargetSaleTimeArmy(sold,numberOfPlayers)) ;
}

function getTargetSaleTimeResource(sold:number,numberOfPlayers:number):number {
  return sold / (0.5 * (minePerResource* 3 *mineRate + blockRate * numberOfPlayers))
}
function getTargetSaleTimeArmy(sold:number,numberOfPlayers:number):number {
  return sold / 0.5 * numberOfPlayers * 500;
}