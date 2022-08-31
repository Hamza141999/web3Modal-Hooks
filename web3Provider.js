//This file contains actions and reducers for Web3Modal wallet changes

export const Web3ProviderState = {
  provider: null,
  web3Provider: null,
  address: null,
  network: null,
  isActive: null,
};

export const Web3InitialState = {
  provider: null,
  web3Provider: null,
  address: null,
  network: null,
  isActive: false,
};

export const Web3Action = {
  type: "SET_WEB3_PROVIDER",
  provider: Web3ProviderState["provider"],
  web3Provider: Web3ProviderState["web3Provider"],
  address: Web3ProviderState["address"],
  network: Web3ProviderState["network"],
  isActive: true,
} || {
    type: "UPDATE_WEB3_PROVIDER",
    provider: Web3ProviderState["provider"],
    web3Provider: Web3ProviderState["web3Provider"],
    address: Web3ProviderState["address"],
    network: Web3ProviderState["network"],
    isActive: true,
  } || {
    type: "SET_ADDRESS",
    address: Web3ProviderState["address"],
  } || {
    type: "SET_NETWORK",
    network: Web3ProviderState["network"],
  } || {
    type: "RESET_WEB3_PROVIDER",
    isActive: false,
  };

export function web3Reducer(state, action) {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        network: action.network,
        isActive: true,
      };

    case "UPDATE_WEB3_PROVIDER":
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        network: action.network,
        isActive: true,
      };

    case "SET_ADDRESS":
      return {
        ...state,
        address: action.address,
      };
    case "SET_NETWORK":
      return {
        ...state,
        network: action.network,
      };
    case "RESET_WEB3_PROVIDER":
      return Web3InitialState;
    default:
      throw new Error();
  }
}
