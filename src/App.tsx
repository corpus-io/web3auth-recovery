import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import ThresholdKey from "@tkey/default";
import { tKey } from "./tkey";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import BN from "bn.js";
import { lagrangeInterpolation } from "./recover";

import WebStorageModule from "@tkey/web-storage";
import SecurityQuestionsModule from "@tkey/security-questions";
import { lagrangeInterpolatePolynomial } from "@toruslabs/torus.js";

function App() {
  const [secretMessage, setSecretMessage] = useState<string>("Hello World");
  const [message, setMessage] = useState<string>("Hello World");
  const [privateKey, setPrivateKey] = useState<any>();
  const [provider, setProvider] = useState<any>();
  const [user, setUser] = useState<any>(null);

  const [tkey, setTkey] = useState<ThresholdKey>();

  // // Init Service Provider inside the useEffect Method
  // useEffect(() => {
  //   const init = async () => {
  //     // Initialization of Service Provider
  //     try {
  //       // Init is required for Redirect Flow but skip fetching sw.js and redirect.html )
  //       (tKey.serviceProvider as any).init({ skipInit: true });
  //       if (
  //         window.location.pathname === "/auth" &&
  //         window.location.hash.includes("#state")
  //       ) {
  //         let result = await (
  //           tKey.serviceProvider as any
  //         ).directWeb.getRedirectResult();
  //         tKey.serviceProvider.postboxKey = new BN(
  //           (result.result as any).privateKey!,
  //           "hex"
  //         );
  //         setUser((result.result as any).userInfo);
  //         //setOAuthShare((result.result as any).privateKey);
  //         //initializeNewKey();
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   init();
  //   const ethProvider = async () => {
  //     const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
  //       config: {
  //         /*
  // 			pass the chain config that you want to connect with
  // 			all chainConfig fields are required.
  // 			*/
  //         chainConfig: {
  //           chainId: "0x13881",
  //           rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
  //           displayName: "Polygon Testnet",
  //           blockExplorer: "https://mumbai.polygonscan.com",
  //           ticker: "MATIC",
  //           tickerName: "Matic",
  //         },
  //       },
  //     });
  //     /*
  // 		pass user's private key here.
  // 		after calling setupProvider, we can use
  // 		*/
  //     if (privateKey) {
  //       await ethereumPrivateKeyProvider.setupProvider(privateKey);
  //       console.log(ethereumPrivateKeyProvider.provider);
  //       setProvider(ethereumPrivateKeyProvider.provider);
  //     }
  //   };
  //   ethProvider();
  // }, [privateKey]);

  function initTKey() {
    // Configuration of Service Provider
    const customAuthArgs = {
      baseUrl: `${window.location.origin}/serviceworker`,
      network: "cyan", // based on the verifier network.
    };

    // Configuration of Modules
    const webStorageModule = new WebStorageModule();
    const securityQuestionsModule = new SecurityQuestionsModule();
    console.log("Arrived here");

    const tkey = new ThresholdKey({
      modules: {
        webStorage: webStorageModule,
        securityQuestions: securityQuestionsModule,
      },
      customAuthArgs: customAuthArgs as any,
    });

    setTkey(tkey);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setSecretMessage(event.currentTarget.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(secretMessage);
    setMessage(secretMessage);
  }

  function getPrivateKey() {
    let shares: BN[] = [];
    let indexes: BN[] = [];

    shares.push(
      new BN(
        "66632f27e450beb22638602ce8e1063ef860edf7fa29c3afff11ba757cfa6619",
        "hex"
      )
    );
    indexes.push(new BN(2));

    shares.push(
      new BN(
        "219733a69292fa302f52b7b2dbdc056c9bdc182ae33304c631b5f6e7e74425c1",
        "hex"
      )
    );
    indexes.push(new BN(3));

    const privateKey = lagrangeInterpolation(shares, indexes);

    console.log(privateKey.toString("hex"));
  }

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <label>
            Secret 1:
            <input
              id="message"
              value={secretMessage}
              type="text"
              onChange={(event) => handleChange(event)}
            />
            <button type="submit">Submit</button>
          </label>
        </form>
        <p>Current secret: {message}</p>
        <p>
          <button onClick={initTKey}>Init tKey</button>
        </p>
        <p>
          <button onClick={getPrivateKey}>Get Private Key</button>
        </p>
      </header>
    </div>
  );
}

export default App;
