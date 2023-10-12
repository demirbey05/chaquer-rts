import { useState, useEffect } from "react";
import { createPublicClient, http } from 'viem'
import { foundry } from 'viem/chains'
import { latticeTestnet } from "@latticexyz/common/chains";

export function useCurrentBlockNumber() {
    const isProduction = process.env.NODE_ENV === "production";
    const chain = isProduction ? latticeTestnet : foundry;

    const publicClient = createPublicClient({
        chain: chain,
        transport: http()
    })

    const [currentBlock, setCurrentBlock] = useState<number>(0);

    useEffect(() => {
        const fetchBlockNumber = async () => {
            const blockNumber = await publicClient.getBlockNumber()
            setCurrentBlock(Number(blockNumber))
        }

        const intervalId = setInterval(fetchBlockNumber, 1000);

        return () => clearInterval(intervalId);
    }, [])


    return currentBlock;
}
