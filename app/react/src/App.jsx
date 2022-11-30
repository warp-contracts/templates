import { useState, useEffect } from 'react';
import { WarpFactory } from 'warp-contracts/web';
import './App.css';

function App() {
  const stateArr = [];
  const contractId = 'N4G1F2ftAbArKpS5iHjPSuOY7GMQvyiEIcS-W4CVLbk';
  let warp = '';
  let wallet = '';
  let contract = '';
  let [contractState, setContractState] = useState(stateArr);
  let [name, setName] = useState('');

  useEffect(() => {
    getContract();
  }, []);
 

  const getContract = async () => {
    warp = await WarpFactory.forMainnet();
    contract = await warp.contract(contractId);
    const { cachedValue } = await contract.readState();
    setContractState((oldArray) => [...oldArray, cachedValue.state]);
  };
  const connectWallet = async () => {
    wallet = await warp.arweave.wallets.generate();
    contract.connect(wallet);
  };
  const addContent = async (e) => {
    e.preventDefault();
    if (!name) {
      return;
    } else {
      await connectWallet();
      await contract.writeInteraction({
        function: 'helloWrite',
        name: name,
      });
      getContract();
    }
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  return (
    <div className="App">
      <div className="name-input">
        <form onSubmit={addContent}>
          <label htmlFor="name">Name: </label>
          <input
            placeholder="Type your name.."
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
          />
          <button type="submit">Add</button>
        </form>
      </div>
      <div className="state-content">
        {contractState.length > 0 &&
          contractState.map((obj) => {
            const [key] = Object.keys(obj);
            const [value] = Object.values(obj);

            return (
              <p key={key}>
                {key} said: {value}
              </p>
            );
          })}
      </div>
    </div>
  );
}

export default App;
