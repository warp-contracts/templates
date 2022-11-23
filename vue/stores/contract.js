import { defineStore } from 'pinia';
import { WarpFactory } from 'warp-contracts/web';


export const useContractStore = defineStore('contract', {
  state: () => {
    return {
      contractState: [],
      contractId: 'N4G1F2ftAbArKpS5iHjPSuOY7GMQvyiEIcS-W4CVLbk',
      warp: null,
      contract: null,
      wallet: null,
      connectingError: false,
    };
  },
  actions: {
    async getContract() {
      this.warp = await WarpFactory.forMainnet();
      this.contract = await this.warp.contract(this.contractId);
      const { cachedValue } = await this.contract.readState();
      this.contractState = cachedValue.state;
    },

    async connectWallet() {
      this.wallet = await this.warp.arweave.wallets.generate();
      this.contract.connect(this.wallet);
    },

    async addContent(payload) {
      await this.connectWallet();
      await this.contract.writeInteraction({
        function: 'helloWrite',
        name: payload,
      });
    },
  },
});
