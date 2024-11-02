import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://localhost:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
          // 0 0x26a6Cbe23CD8a668c7aC9a82b876b6a8e8c27Dd
          '0xce6ceec6fc9bad6a88ab4e3cab01c8f6d6102237b22e1b305fb758c0d9255729',
          // 1 0xA0ECa4F81f969B9d969Aab932C821aF792830185
          '0xbe90094c980b68e386af8ef8f0e55e3f41a3054ec098cd3c41aad12ade159ac2',
          // 2 0x6AfC30d58f720eB9C11eb78c5F7b3A9a6FCbEB92
          '0x9fac402c732bf8834f2de1fbb65e7665c9baad777e9c2c91b58958b26241c19c'
      ]
    },
  },
};

export default config;
