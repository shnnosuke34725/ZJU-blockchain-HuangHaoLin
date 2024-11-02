import React, {useEffect, useState} from 'react';
import { BuyMyRoomContract, web3 } from "../utils/contracts";

interface ListPropertyProps {
    propertyId: number;
}

const ListProperty: React.FC<ListPropertyProps> = ({ propertyId }) => {
    const [price, setPrice] = useState<string>('');
    const [isListed, setIsListed] = useState<boolean>(false);

    // 加载房产的初始状态，判断是否已经上架
    useEffect(() => {
        const fetchHouseInfo = async () => {
            const houseInfo = await BuyMyRoomContract.methods.getHouseInfo(propertyId).call();
            setIsListed(parseInt(houseInfo.price) > 0); // 如果价格大于 0，则已上架
            if (parseInt(houseInfo.price) > 0) {
                setPrice(web3.utils.fromWei(houseInfo.price, 'ether')); // 显示当前上架价格
            }
        };
        fetchHouseInfo();
    }, [propertyId]);

    const listPropertyForSale = async () => {
        const accounts = await web3.eth.requestAccounts();
        const weiPrice = web3.utils.toWei(price, 'ether');
        await BuyMyRoomContract.methods.listHouseForSale(propertyId, weiPrice).send({ from: accounts[0] });
        alert('房产已成功挂单出售！');
        window.location.reload();
    };

    const delistProperty = async () => {
        const accounts = await web3.eth.requestAccounts();
        await BuyMyRoomContract.methods.delistHouse(propertyId).send({ from: accounts[0] });
        alert('房产已下架！');
        window.location.reload();
    };

    return (
        <div>

            {isListed ? (
                    <button onClick={delistProperty}>下架房产</button>
            ) : (
                <div>
                    <input
                        type="number"
                        placeholder="输入价格"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <button onClick={listPropertyForSale} style={{ marginLeft: '10px' }}>出售房产</button>
                </div>
            )}
        </div>
    );
};

export default ListProperty;
