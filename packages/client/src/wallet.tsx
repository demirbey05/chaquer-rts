import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, } from '@rainbow-me/rainbowkit';
import { QueryClient, } from "@tanstack/react-query";
import {
    arbitrum,
    sepolia
} from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'Chaquer',
    projectId: import.meta.env.VITE_PROJECT_ID,
    chains: [sepolia],
    ssr: true,
});

export const queryClient = new QueryClient();