import React from "react";
import { useState } from "react";
import "./App.css";
import BN from "bn.js";
import { lagrangeInterpolation } from "./recover";

function App() {
  const [keyShare, setKeyShare] = useState("");
  const [index, setIndex] = useState("");
  const [keyShares, setKeyShares] = useState<BN[]>([]);
  const [indexes, setIndexes] = useState<BN[]>([]);
  const [privateKey, setPrivateKey] = useState<BN>();

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

  function getPrivateKey(shares: BN[], indexes: BN[], setPrivateKey: any) {
    // let shares: BN[] = [];
    // let indexes: BN[] = [];

    // secrets for
    // polynomialID:"020a4557aca651b4078e9a73ecd8af3ed87ca057da31dd91e26f9c9e8262ed43da|02663c58290b1862534ff2a3dd2297a6da4d82cba176908ce5f5973922182d1751"
    // extracted from browser
    // const deviceShareSecret =
    //   "b6dac735ebfa40ef58031382071ae60c738ac693e0f2c542e3b4f5e7d9e367a4";
    // const deviceShareIndex =
    //   "6def503eea5d321c285abdcd385c0451f2b6acd0d05c522c7e3c032e0de9fb4b";

    // const providerShareSecret =
    //   "dd819ae466a9a6e3e297aa629caa405af31f7806c8a48677ed6c55c0c8e64e34";
    // const providerShareIndex = "1";

    // const privateKey = new BN(
    //   "dc146f1a3f4ae942d14ce82676c30b8cc933f0149e807e802b6f2039452083a9",
    //   "hex"
    // );

    // shares.push(new BN(deviceShareSecret, "hex"));
    // indexes.push(new BN(deviceShareIndex, "hex"));
    // shares.push(new BN(providerShareSecret, "hex"));
    // indexes.push(new BN(providerShareIndex, "hex"));

    const calculatedPrivateKey = lagrangeInterpolation(shares, indexes);
    setPrivateKey(calculatedPrivateKey);
    console.log("calculatedPrivateKey: ", calculatedPrivateKey.toString("hex"));
    // if (calculatedPrivateKey.eq(privateKey)) {
    //   console.log("Found the private key: ", privateKey.toString("hex"));
    // } else {
    //   console.log("Private key not found");
    // }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h2>Shamir's Secret Sharing Scheme recovery</h2>
          <h3>
            {" "}
            as implemented by <a href="https://web3auth.io/tech">web3auth.io</a>
          </h3>
          <p>
            Input the number of shares needed for recovery, along with their
            index.{" "}
          </p>
          <ul>
            <li>
              share refers to the y coordinate of the point on the polynomial
            </li>
            <li>
              index refers to the x coordinate of the point on the polynomial
            </li>
            <ul>
              <li>index of the device social recovery share is always 1</li>
              <li>index of the other shares are random and too big to guess</li>
            </ul>
            <li>
              device share and index can be extracted from browser storage
            </li>
            <li>
              using shares that do not belong to the same polynomial will not
              fail, but definitely yield a wrong result
            </li>
            <li>working example</li>
            <ul>
              <li>
                deviceShare
                <ul>
                  <li>
                    share:
                    "b6dac735ebfa40ef58031382071ae60c738ac693e0f2c542e3b4f5e7d9e367a4"
                  </li>
                  <li>
                    index:
                    "6def503eea5d321c285abdcd385c0451f2b6acd0d05c522c7e3c032e0de9fb4b"
                  </li>
                </ul>
              </li>
              <li>
                providerShare
                <ul>
                  <li>
                    share:
                    "dd819ae466a9a6e3e297aa629caa405af31f7806c8a48677ed6c55c0c8e64e34"
                  </li>
                  <li>index: "1"</li>
                </ul>
              </li>
              <li>
                privateKey:
                "dc146f1a3f4ae942d14ce82676c30b8cc933f0149e807e802b6f2039452083a9"
              </li>
            </ul>
          </ul>
        </div>
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
            <p>Corresponding address: </p>
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
