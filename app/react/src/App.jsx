import { useState, useEffect } from 'react';
import { WarpFactory } from 'warp-contracts/web';
import './App.css';

function App() {
  const contractId = 'N4G1F2ftAbArKpS5iHjPSuOY7GMQvyiEIcS-W4CVLbk';
  let [contractState, setContractState] = useState([]);
  let [warp, setWarp] = useState(null);
  let [wallet, setWallet] = useState(null);
  let [contract, setContract] = useState(null);

  useEffect(() => {
    getContract();
  });

  const getContract = async () => {
    warp = await WarpFactory.forMainnet();
    contract = await warp.contract(contractId);
    const { cachedValue } = await contract.readState();
    contractState = cachedValue.state;
    console.log(contractState);
  };
  return (
    <div className="App">
      <div className="card">
      </div>
    </div>
  );
}

export default App;
