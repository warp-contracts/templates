export async function handle(state, action) {
  switch (action.input.function) {
    case 'helloWrite': {
      const name = action.input.data.name;
      const caller = action.input.data.caller;
      if (!name) {
        throw new ContractError(`Creator must provide a name.`);
      }
      if (state[caller]) {
        throw new ContractError(`Creator already added.`);
      }
      state[caller] = name;

      return { state };
    }

    default: {
      throw new ContractError(`Unsupported contract function: ${functionName}`);
    }
  }
}
