import React from 'react';
import { myERC20Contract, BuyMyRoomContract, web3 } from "../utils/contracts";

interface BuyPropertyProps {
    propertyId: number;
    price: string;
}

const BuyProperty: React.FC<BuyPropertyProps> = ({ propertyId, price }) => {
    const buyProperty = async () => {
        const accounts = await web3.eth.requestAccounts();
        // await myERC20Contract.methods.approve(BuyMyRoomContract.options.address, price).send({ from: accounts[0] });
        await BuyMyRoomContract.methods.buyHouse(propertyId).send({ from: accounts[0], value: price });
        alert('房产购买成功！');
        window.location.reload();
    };

    return (
        <button onClick={buyProperty}>购买房产</button>
    );
};

export default BuyProperty;
