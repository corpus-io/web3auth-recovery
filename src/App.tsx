import { useEffect } from "react";
import { useState } from "react";
import {
  Box,
  Heading,
  Button,
  UnorderedList,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { Collapse } from "@chakra-ui/transition";
import "./App.css";
import BN from "bn.js";
import { lagrangeInterpolation } from "./recover";
import { ethers } from "ethers";

function App() {
  const [keyShare, setKeyShare] = useState("");
  const [index, setIndex] = useState("");
  const [keyShares, setKeyShares] = useState<BN[]>([]);
  const [indexes, setIndexes] = useState<BN[]>([]);
  const [privateKey, setPrivateKey] = useState<BN>();
  const [ethAddress, setEthAddress] = useState("");
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);

  function handleSubmit(event: any) {
    event.preventDefault();
    const _index = event.target.index.value;
    const _keyShare = event.target.secret.value;
    console.log("secret: ", _keyShare);
    setKeyShares([...keyShares, new BN(_keyShare, "hex")]);
    setIndexes([...indexes, new BN(_index, "hex")]);
    setKeyShare("");
    setIndex("");
    console.log("keyShares: ", keyShares);
  }

  function reset() {
    setKeyShares([]);
    setIndexes([]);
    setKeyShare("");
    setIndex("");
    setPrivateKey(undefined);
  }

  /**
   * Reconstructs private key from shares and indexes
   * @param shares y-coordinates of the points on the polynomial
   * @param indexes x-coordinates of the points on the polynomial
   * @param setPrivateKey callback to set the private key
   */
  function getPrivateKey(shares: BN[], indexes: BN[], setPrivateKey: any) {
    const calculatedPrivateKey = lagrangeInterpolation(shares, indexes);
    setPrivateKey(calculatedPrivateKey);
    console.log("calculatedPrivateKey: ", calculatedPrivateKey.toString("hex"));
  }

  useEffect(() => {
    if (!privateKey) {
      return;
    }
    try {
      const address = ethers.computeAddress("0x" + privateKey.toString("hex"));
      setEthAddress(address);
    } catch (e) {
      console.log(e);
    }
  }, [privateKey]);

  return (
    <div className="App">
      <header className="App-header">
        <Box>
          <Heading>Shamir's Secret Sharing Scheme recovery</Heading>
          <h3>
            {" "}
            as implemented by <a href="https://web3auth.io/tech">web3auth.io</a>
          </h3>
          <Text>
            Input the number of shares needed for recovery, along with their
            index.{" "}
          </Text>
          <UnorderedList>
            <ListItem>
              share refers to the y coordinate of the point on the polynomial
            </ListItem>
            <ListItem>
              index refers to the x coordinate of the point on the polynomial
            </ListItem>
            <UnorderedList>
              <ListItem>
                index of the device social recovery share is always 1
              </ListItem>
              <ListItem>
                index of the other shares are random and too big to guess
              </ListItem>
            </UnorderedList>
            <ListItem>
              device share and index can be extracted from browser storage
            </ListItem>
            <ListItem>
              using shares that do not belong to the same polynomial will not
              fail, but definitely yield a wrong result
            </ListItem>
            <ListItem>
              <Button onClick={handleToggle}>show example</Button>
            </ListItem>
            <Collapse in={show}>
              <UnorderedList>
                <ListItem>
                  deviceShare
                  <UnorderedList>
                    <ListItem>
                      share:
                      "b6dac735ebfa40ef58031382071ae60c738ac693e0f2c542e3b4f5e7d9e367a4"
                    </ListItem>
                    <ListItem>
                      index:
                      "6def503eea5d321c285abdcd385c0451f2b6acd0d05c522c7e3c032e0de9fb4b"
                    </ListItem>
                  </UnorderedList>
                </ListItem>
                <ListItem>
                  providerShare
                  <UnorderedList>
                    <ListItem>
                      share:
                      "dd819ae466a9a6e3e297aa629caa405af31f7806c8a48677ed6c55c0c8e64e34"
                    </ListItem>
                    <ListItem>index: "1"</ListItem>
                  </UnorderedList>
                </ListItem>
                <ListItem>
                  privateKey:
                  "dc146f1a3f4ae942d14ce82676c30b8cc933f0149e807e802b6f2039452083a9"
                </ListItem>
                <ListItem>
                  Ethereum Address: 0x97dA24fF2a92C94Db0535cf8D20FcA0Ab6dB9876
                </ListItem>
              </UnorderedList>
            </Collapse>
          </UnorderedList>
        </Box>
        <form onSubmit={handleSubmit}>
          <p>
            <label>
              Key share
              <input
                id="secret"
                type="text"
                value={keyShare}
                onChange={(event) => setKeyShare(event.target.value)}
              />
            </label>
            <label>
              Index
              <input
                id="index"
                type="text"
                value={index}
                onChange={(event) => setIndex(event.target.value)}
              />
            </label>
            <button type="submit">Submit</button>
          </p>
        </form>
        <p>
          <button
            onClick={() => {
              getPrivateKey(keyShares, indexes, setPrivateKey);
            }}
          >
            Get Private Key
          </button>
          <button onClick={reset}>Reset all</button>
        </p>
        {privateKey && (
          <div>
            <p>Private Key: {privateKey.toString("hex")}</p>
            <p>Corresponding address: {ethAddress}</p>
          </div>
        )}
        <p>
          Current secrets:{" "}
          {keyShares.map((share) => (
            <p>{share.toString("hex")}</p>
          ))}
        </p>
        <p>
          Current indexes:{" "}
          {indexes.map((index) => (
            <p>{index.toString("hex")}</p>
          ))}
        </p>
        <p></p>
      </header>
    </div>
  );
}

export default App;
