import React, { useEffect } from "react";
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";

function App() {
  const dispatch = useDispatch();
  // Grab the state of the current instance of redux
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  // console.log(blockchain);
  // console.log(data);

  const mintNFT = (_account, _name) => {
    blockchain.lipToken.methods
      .createRandomLip(_name)
      .send({from: _account, value: 1000000000000000000})
      .once("error", (err) => {
        console.log(err);
    }).then((receipt) => {
      console.log(receipt);
      dispatch(fetchData(blockchain.account));
    })
  }

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.lipToken != null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.lipToken]);


  return (
    <s.Screen>
      {blockchain.account === "" || blockchain.lipToken == null ? (
      <s.Container flex={1} ai={"center"} jc={"center"}>
        <s.TextTitle>Connect to Card Game</s.TextTitle>
        <s.SpacerMedium />
        <button 
          onClick={(e) => {
            e.preventDefault();
            dispatch(connect())
          }}
          style={{ padding: "10px 50px"}}
        >
            CONNECT
        </button>
      </s.Container>
      ) : (
        <s.Container flex={1} ai={"center"} style={{ padding: "24px" }}>
          <s.TextTitle>Welcome to the game</s.TextTitle>
          <s.SpacerMedium />
          <button 
          onClick={(e) => {
            e.preventDefault();
            mintNFT(blockchain.account, "Unknown");
          }}
          style={{ padding: "10px 50px"}}
        >
            CREATE NFT LIPS
        </button>
        <s.SpacerSmall />
        {data.allLips.map(item => {
          return (
            <s.Container>
              <s.TextSubTitle>NAME: {item.name}</s.TextSubTitle>
              <s.TextSubTitle>ID: {item.id}</s.TextSubTitle>
              <s.TextSubTitle>DNA: {item.dna}</s.TextSubTitle>
              <s.TextSubTitle>LEVEL: {item.level}</s.TextSubTitle>
              <s.TextSubTitle>RARITY: {item.rarity}</s.TextSubTitle>
              <s.SpacerSmall />
            </s.Container>
          )
        })}
        </s.Container>
      )}

      <s.TextDescription>Your address account: {blockchain.account}</s.TextDescription>
    </s.Screen>
  );
}

export default App;
