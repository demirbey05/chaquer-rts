cd packages/contracts
pnpm mud deploy --profile=alt-layer
cd ../..
export VITE_CHAIN_ID=1400601
export CHAIN=A
cd packages/client
pnpm vite
cd ../..
