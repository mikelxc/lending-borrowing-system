## Lending & Borrowing System

This is a demo contract for the Lending & Borrowing System.

-  LendingBorrowingSystem deployed at: 0x17578B4C4Ee77f2E4D30047f2ECdC1FA38382d33
-  Collateral Token (cETH) deployed at: 0x8C61c72fa6CfA89E3D603248a86Ea80b18c0A5BB 
-  Liability Token (lETH) deployed at: 0xf878444c23a905f4BceaC7Aa14c9aA6e969c8A0B 

## Setup

1. Install Foundry
    ```sh
    curl -L https://foundry.paradigm.xyz | bash
    ```
2. Install dependencies
    ```sh
    forge install
    ```
3. Test With diligence-fuzzing
    ```sh
    pip3 install diligence-fuzzing 
    ```
    ```sh
    echo FUZZ_API_KEY='your api key here' > .env
    ```
    ```sh
    fuzz forge test
    ```
4. Deploy
    ```sh
    PRIVATE_KEY=your_private_key forge script script/Deploy.s.sol:Deploy --rpc-url $RPC_URL --broadcast --verify -vvvv
    ```



