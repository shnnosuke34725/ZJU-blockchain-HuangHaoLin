import React, { useEffect, useState } from 'react';
import { BuyMyRoomContract, web3 } from "../utils/contracts";
import ListProperty from "./ListProperty";
import houseImage from '../asset/house0.png';

const propertyImages: { [key: number]: string } = {
    0: require('../asset/house0.png'),
    1: require('../asset/house1.png'),
    2: require('../asset/house2.png'),
    3: require('../asset/house3.png'),
    4: require('../asset/house4.png'),
};
const MyProperties: React.FC = () => {
    const [properties, setProperties] = useState<any[]>([]);
    const [account, setAccount] = useState<string>('');

    useEffect(() => {
        async function fetchProperties() {
            const accounts = await web3.eth.requestAccounts();
            setAccount(accounts[0]);

            const balance = await BuyMyRoomContract.methods.balanceOf(accounts[0]).call();
            const ownedProperties = [];
            for (let i = 0; i < balance; i++) {
                // const propertyId = await BuyMyRoomContract.methods.tokenOfOwnerByIndex(accounts[0], i).call();
                const property = await BuyMyRoomContract.methods.getHouseInfo(i).call();
                ownedProperties.push(property);
            }
            setProperties(ownedProperties);
        }
        fetchProperties();
    }, []);

    return (
        <div>
            <h2>我的房产</h2>
            <ul>
                {properties.map((property) => (
                    <li key={property.id}>
                        <img src={propertyImages[property.id]} alt="房产图片" style={{ width: '120px', height: '90px', verticalAlign: 'middle' }} />
                        房产ID: {property.id}, URI: {property.uri}, 价格: {web3.utils.fromWei(property.price, 'ether')}
                        <ListProperty propertyId={property.id} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyProperties;
