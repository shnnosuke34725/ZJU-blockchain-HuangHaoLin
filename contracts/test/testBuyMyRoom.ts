import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const BuyMyRoom = await ethers.getContractFactory("BuyMyRoom");
    const buyMyRoom = await BuyMyRoom.deploy();

    return { buyMyRoom, owner, otherAccount };
  }

  // describe("Deployment", function () {
  //   it("Should return hello world", async function () {
  //     const { buyMyRoom } = await loadFixture(deployFixture);
  //     expect(await buyMyRoom.helloworld()).to.equal("hello world");
  //   });
  // });

  describe("BuyMyRoom Contract", function () {
    async function deployFixture() {
      // 使用 JsonRpcProvider 连接到 Ganache
      const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

      // 使用 Ganache 提供的第一个账户私钥创建钱包
      const ownerWallet = new ethers.Wallet("0xce6ceec6fc9bad6a88ab4e3cab01c8f6d6102237b22e1b305fb758c0d9255729", provider);
      const buyerWallet = new ethers.Wallet("0xbe90094c980b68e386af8ef8f0e55e3f41a3054ec098cd3c41aad12ade159ac2", provider);
      const houseWallet = new ethers.Wallet("0x9fac402c732bf8834f2de1fbb65e7665c9baad777e9c2c91b58958b26241c19c", provider);

      // 使用 ownerWallet 部署合约
      const BuyMyRoom = await ethers.getContractFactory("BuyMyRoom", ownerWallet);
      const buyMyRoom = await BuyMyRoom.deploy();
      await buyMyRoom.deployed();

      return { buyMyRoom, ownerWallet, buyerWallet, houseWallet };
    }

    describe("Deployment and Basic Tests", function () {
      it("Should deploy the contract and set the owner", async function () {
        const { buyMyRoom, ownerWallet } = await deployFixture();
        expect(await buyMyRoom.owner()).to.equal(ownerWallet.address);
        console.log("Contract deployed, owner set to:", ownerWallet.address);
      });
    });

    describe("House Minting and Listing", function () {
      it("Should mint a new house NFT and list it for sale", async function () {
        const {buyMyRoom, houseWallet} = await deployFixture();
        const houseURI = "https://example.com/house1";
        // 铸造房屋并设置 houseWallet 作为初始拥有者
        const mintTx = await buyMyRoom.connect(houseWallet).mintHouse(houseURI);
        await mintTx.wait();
        console.log("房屋已铸造，URI 为:", houseURI);

        const houseId = 0; // 假设这是第一个铸造的房屋
        const house = await buyMyRoom.houses(houseId);

        // 验证房屋拥有者是否为 houseWallet
        expect(house.owner).to.equal(houseWallet.address);
        console.log("房屋的初始拥有者为:", houseWallet.address);
      });
    });
    describe("Buying a Listed House", function () {
      it("Should allow another account to buy a listed house", async function () {
        const { buyMyRoom, buyerWallet, houseWallet } = await deployFixture();
        const houseURI = "https://example.com/house1";

        // Owner 铸造并挂单出售房屋
        await buyMyRoom.connect(houseWallet).mintHouse(houseURI);
        const houseId = 0;
        const price = ethers.utils.parseEther("1");
        await buyMyRoom.connect(houseWallet).listHouseForSale(houseId, price);

        // Buyer 购买房屋
        console.log("Initial balance of buyer:", ethers.utils.formatEther(await buyerWallet.getBalance()));
        const buyTx = await buyMyRoom.connect(buyerWallet).buyHouse(houseId, { value: price });
        const receipt = await buyTx.wait();
        console.log("House purchased successfully in transaction:", receipt.transactionHash);

        const newOwner = await buyMyRoom.ownerOf(houseId);
        expect(newOwner).to.equal(buyerWallet.address);
        console.log("New owner of house ID", houseId, "is:", newOwner);
      });
    });
  });
});