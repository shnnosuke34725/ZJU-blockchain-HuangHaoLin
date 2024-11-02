import React, { useEffect, useState } from 'react';
import { BuyMyRoomContract, web3 } from "../utils/contracts";
import BuyProperty from './BuyProperty';
const propertyImages: { [key: number]: string } = {
    0: require('../asset/house0.png'),
    1: require('../asset/house1.png'),
    2: require('../asset/house2.png'),
    3: require('../asset/house3.png'),
    4: require('../asset/house4.png'),
};

const AvailableProperties: React.FC = () => {
    const [properties, setProperties] = useState<any[]>([]);

    useEffect(() => {
        async function fetchAvailableProperties() {
            const totalSupply = await BuyMyRoomContract.methods.nextHouseId().call();
            const forSale = [];
            for (let i = 0; i < totalSupply; i++) {
                const property = await BuyMyRoomContract.methods.getHouseInfo(i).call();
                if (property.price > 0) {
                    forSale.push(property);
                }
            }
            setProperties(forSale);
        }
        fetchAvailableProperties();
    }, []);

    return (
        <div>
            <h2>待售房产</h2>
            <ul>
                {properties.map((property) => (
                    <li key={property.id}>
                        <img src={propertyImages[property.id]} alt="房产图片" style={{ width: '120px', height: '90px', verticalAlign: 'middle' }} />
                        房产ID: {property.id}, 价格: {web3.utils.fromWei(property.price, 'ether')}, 拥有者: {property.owner}
                        <BuyProperty propertyId={property.id} price={property.price} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AvailableProperties;
