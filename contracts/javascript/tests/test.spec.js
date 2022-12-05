const fs = require('fs');
const path = require('path');
const { default: ArLocal } = require('arlocal');
const { LoggerFactory, WarpFactory } = require('warp-contracts');

describe('Testing Hello contract', () => {
  let arLocal, warp, wallet, contractSrc, initialState, contractId, contract;
  beforeAll(async () => {
    // Set up ArLocal
    arLocal = new ArLocal(1985, false);
    await arLocal.start();

    // Set up Warp client
    LoggerFactory.INST.logLevel('info');
    warp = WarpFactory.forLocal(1985);

    // note: warp.testing.generateWallet() automatically adds funds to the wallet
    ({ jwk: wallet } = await warp.testing.generateWallet());

    // Deploying contract
    contractSrc = fs.readFileSync(path.join(__dirname, '../contract.js'), 'utf8');
    initialState = fs.readFileSync(path.join(__dirname, '../initial-state.json'), 'utf8');
    ({ contractTxId: contractId } = await warp.createContract.deploy({
      wallet,
      initState: JSON.stringify(initialState),
      src: contractSrc,
    }));
    contract = warp.contract(contractId).connect(wallet);
  });

  afterAll(async () => {
    await arLocal.stop();
  });

  it('should properly deploy contract', async () => {
    const contractTx = await warp.arweave.transactions.get(contractId);

    expect(contractTx).not.toBeNull();
  });

  it('should read Hello state', async () => {
    expect((await contract.readState()).cachedValue.state).toEqual(initialState);
  });

  it('should add content', async () => {
    await contract.writeInteraction({
      function: 'helloWrite',
      name: 'function content'
    })
  });

  // it('should read state after interaction', async () => {
  //   const state = await contract.readState(); 
  //   console.dir(state);
  //   // expect((await contract.readState()).cachedValue.state.messages[0]).toEqual('function content');
  // });
});
