import { useContext, createContext } from "react";
import Web3Modal, { local } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useEffect, useReducer, useCallback, useState } from "react";
import { web3Reducer, Web3InitialState } from "../reducers/web3Provider";
import { parse, stringify, toJSON, fromJSON } from "flatted";
import { providers } from "ethers";

//Creating Context for prop drilling throughout the application
export const WalletContext = createContext();

//Returning the context for components to access
function useWalletContext() {
  return useContext(WalletContext);
}

//Options for wallet connect provider
const walletConnectOptions = new WalletConnectProvider({
  rpc: {
    80001: process.env.INFURA_RPC_MUMBAI,
    137: process.env.INFURA_RPC_POLYGON,
  },
  infuraId: process.env.INFURA_RPC_MUMBAI.split("/")[4],
  supportedChainIds: [80001, 137],
});

//Add providers for wallets here
const providerOptions = {
  walletconnect: {
    display: {
      name: "Wallet Connect",
    },
    package: WalletConnectProvider,
    options: walletConnectOptions,
  },
};

//Context Provider with connect, disconnect methods
const UseWeb3Provider = ({ children }) => {
  const [web3Modal, setWeb3Modal] = useState();
  const [web3modalContext, dispatch] = useReducer(
    web3Reducer,
    Web3InitialState
  );

  const { provider, web3Provider, address, network, isActive } =
    web3modalContext;

  // Mimicking global storage by hyderating connect credentials on page refreshes
  useEffect(() => {
    if (web3Modal) {
      // Only call connect() when clicks on the connect button, if the wallet is already connected, then call it anyways whenever page refreshes
      if (typeof window !== undefined) {
        const data = window?.localStorage?.getItem("isWalletConnected");
        if (data === "true") {
          connect();
        }
      }
    }
  }, [web3Modal]);

  useEffect(() => {
    if (typeof window !== undefined) {
      const data = window?.localStorage?.getItem("isWalletConnected");
    }
  }, []);

  useEffect(() => {
    const web3Modal = new Web3Modal({
      //cacheProvider when set to true, stores the provider in cache so we don't need to connect again and again on page refresh
      cacheProvider: true,
      providerOptions,
    });
    setWeb3Modal(web3Modal);
  }, []);

  useEffect(() => {
    if (typeof window !== undefined) {
      if (window.localStorage.getItem("hasStoredLocalStorage") === "true") {
        setPersistentWalletState(
          parse(window.localStorage.getItem("walletLocalStorage"))
        );
      }
    }
  }, []);

  const connect = async () => {
    if (web3Modal) {
      try {
        const provider = await web3Modal.connect();
        const web3Provider = new providers.Web3Provider(provider);
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
        const network = "mumbai";
        dispatch({
          type: "SET_WEB3_PROVIDER",
          provider,
          web3Provider,
          address,
          network,
        });

        localStorage.setItem("isWalletConnected", true);
      } catch (e) {
        console.log("connect error", e);
      }
    } else {
      console.error("No Web3Modal found");
    }
  };

  const disconnect = useCallback(async () => {
    if (web3Modal) {
      // Clearing cache so that it asks for a new provider after every disconnect
      web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      localStorage.setItem("isWalletConnected", false);
      dispatch({
        type: "RESET_WEB3_PROVIDER",
      });
    } else {
      console.error("No Web3Modal");
    }
  }, [provider]);

  // On account/chain change disconnect functions
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        dispatch({
          type: "SET_ADDRESS",
          address: accounts[0],
        });
      };

      const handleChainChanged = (_hexChainId) => {
        if (typeof window !== "undefined") {
          window.location.reload();
        } else {
        }
      };

      const handleDisconnect = (error) => {
        // eslint-disable-next-line no-console
        console.log("disconnect", error);
        disconnect();
        localStorage.setItem("walletLocalStorage", stringify(persistentState));
        localStorage.setItem("hasStoredLocalStorage", false);
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      // Subscription Cleanup for the listeners, warnings occur if not removed
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  const value = {
    web3modalContext,
    connect,
    disconnect,
  };

  //This will be used in _app.js as a Context Provider throughout the application
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export { UseWeb3Provider, useWalletContext };
