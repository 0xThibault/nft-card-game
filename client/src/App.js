import React, { useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";

function App() {
  const dispatch = useDispatch();
  // Grab the state of the current instance of redux
  const blockchain = useSelector((state) => state.blockchain);

  console.table(blockchain);

  useEffect(() => {
    dispatch(connect());
  }, [dispatch]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Account: {blockchain.account} 
        </p>
      </header>
    </div>
  );
}

export default App;
