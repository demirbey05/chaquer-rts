import broadcast from "../../../contracts/broadcast/Deploy.sol/31337/broadcastDeploy-latest.json";

export const getContractAddress = (contractName: string): string => {
  const deployments = broadcast.transactions.filter(
    (transaction) => transaction.contractName == contractName
  );

  if (deployments.length == 1) {
    return (deployments as any).contractAddress;
  } else {
    return (deployments as any)[0].contractAddress;
  }
};
