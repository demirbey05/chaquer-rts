const mineRate = 10;
const blockRate = 1;
export const calculateResource = (chainResource:number, blockNumberDifference:number, numberOfMine:number) :number => {
    return chainResource + (blockNumberDifference * blockRate) + (numberOfMine * mineRate * blockNumberDifference);
}
