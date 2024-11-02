import React, { useState } from 'react';
import { BuyMyRoomContract, web3 } from "../utils/contracts";

const MintHouse: React.FC = () => {
    const [uri, setUri] = useState('');

    const mintNewHouse = async () => {
        const accounts = await web3.eth.requestAccounts();
        try {
            await BuyMyRoomContract.methods.mintHouse(uri).send({ from: accounts[0] });
            alert("房屋铸造成功！");
            window.location.reload();
        } catch (error) {
            console.error("铸造失败：", error);
            alert("铸造失败，请检查输入并重试！");
        }
    };

    return (
        <div>
            <h3>铸造房屋（仅方便测试使用）</h3>
            <input
                type="text"
                placeholder="输入房屋URI"
                value={uri}
                onChange={(e) => setUri(e.target.value)}
            />
            <button onClick={mintNewHouse}>铸造房屋</button>
        </div>
    );
};

export default MintHouse;
