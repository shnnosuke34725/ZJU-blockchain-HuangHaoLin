// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721,ERC20
// You can use this dependency directly because it has been installed by TA already
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MyERC20.sol";


// Uncomment this line to use console.log
import "hardhat/console.sol";

contract BuyMyRoom is ERC721, Ownable {

    uint256 public nextHouseId = 0;
    uint256 public platformFeeRate = 100; // 固定比例1%
    address public platformAccount;
    MyERC20 public myERC20;

    event HouseListed(uint256 tokenId, uint256 price, address owner);

    struct House {
        uint256 id;
        string uri;
        address owner;
        uint256 price;
        uint256 listedTimestamp;
    }

    mapping(uint256 => House) public houses;

    constructor() ERC721("BuyMyRoom", "HSE") Ownable(msg.sender) {
        myERC20 = new MyERC20("ZJUToken", "ZJUSymbol");
        platformAccount = msg.sender;
    }

    function helloworld() pure external returns(string memory) {
        return "hello world";
    }

    function mintHouse(string memory _uri) public {
        uint256 houseId = nextHouseId;
        houses[houseId] = House(houseId, _uri, msg.sender, 0, 0);
        _safeMint(msg.sender, houseId);
        nextHouseId++;
    }

    function listHouseForSale(uint256 _houseId, uint256 _price) public {
        House storage house = houses[_houseId];
        require(house.owner == msg.sender, "Only the owner can list this house for sale");
        house.price = _price;
        house.listedTimestamp = block.timestamp;

        emit HouseListed(_houseId, _price, msg.sender);
    }

    function delistHouse(uint256 _houseId) public {
        House storage house = houses[_houseId];
        require(house.owner == msg.sender, "Only the owner can delist this house");
        house.price = 0;
        house.listedTimestamp = 0;
    }


    function buyHouse(uint256 _houseId) public payable {
        House memory house = houses[_houseId];

        uint256 fee = (block.timestamp - house.listedTimestamp) * platformFeeRate * house.price / 10000;
        uint256 sellerAmount = msg.value - fee;

        payable(house.owner).transfer(sellerAmount);
        payable(platformAccount).transfer(fee);

        // 使用积分购买
        // myERC20.transferFrom(msg.sender, house.owner, sellerAmount);
        // myERC20.transferFrom(msg.sender, platformAccount, fee);

        _transfer(house.owner, msg.sender, _houseId); // 转移房屋所有权
        houses[_houseId].price = 0;
        houses[_houseId].owner = msg.sender;
    }



    function getHouseInfo(uint256 _houseId) public view returns (House memory) {
        return houses[_houseId];
    }
}