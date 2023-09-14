cd packages/contracts
pnpm deploy:testnet
cd ../..
export VITE_CHAIN_ID=4242
cd packages/client
pnpm vite
cd ../..
