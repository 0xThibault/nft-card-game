// constants
import Web3 from "web3";
import LipToken from "../../abis/LipToken.json";
// log
// import { fetchData } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    // Check if the window has ethereum capability
    if (window.ethereum) { 
      // Create a new instance of Web3 with metamask as provider
      let web3 = new Web3(window.ethereum);
      try {
        // Get the metamask accounts, returns an array of accounts
        // account[0] is the current connected account
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        console.log("Account: ", accounts[0]);
        const networkId = await window.ethereum.request({
          method: "net_version",
        });
        console.log("NetworkId: " ,networkId);
        const lipTokenNetworkData = await LipToken.networks[networkId];
        // Check if we can pick up the contract from the network
        if (lipTokenNetworkData) {
          // Create an instance of our smart contract  
          const lipToken = new web3.eth.Contract(
            LipToken.abi,
            lipTokenNetworkData.address
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              lipToken: lipToken,
              web3: web3,
            })
          );
          // Add listeners start
          window.ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed("Change network to Polygon."));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    // dispatch(fetchData(account));
  };
};