export const getNumberFromBigInt = (number: any) => {
    return (Number(number) / Number("1000000000000000000")).toString();
}