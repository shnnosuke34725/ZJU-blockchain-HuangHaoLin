import React, { useState } from 'react';
import { myERC20Contract, web3 } from "../utils/contracts";

const ExchangePoints = () => {
    const [etherAmount, setEtherAmount] = useState('');

    // 兑换积分函数
    const depositEtherForPoints = async () => {
        const weiAmount = web3.utils.toWei(etherAmount, 'ether');
        const accounts = await web3.eth.getAccounts();
        await myERC20Contract.methods.exchangeEtherForPoints().send({ from: accounts[0], value: weiAmount });
        alert(`成功兑换 ${etherAmount} ETH 为积分！`);
    };

    return (
        <div>
            <h2>积分兑换</h2>
            <div>
                <input
                    type="number"
                    placeholder="输入ETH数量"
                    value={etherAmount}
                    onChange={(e) => setEtherAmount(e.target.value)}
                />
                <button onClick={depositEtherForPoints}>兑换ZJU积分(1 ETH = 1000 ZJU积分)</button>
            </div>
        </div>
    );
};

export default ExchangePoints;
