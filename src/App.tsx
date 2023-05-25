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

    // secrets for
    // polynomialID:"020a4557aca651b4078e9a73ecd8af3ed87ca057da31dd91e26f9c9e8262ed43da|02663c58290b1862534ff2a3dd2297a6da4d82cba176908ce5f5973922182d1751"
    // extracted from browser
    const deviceShareSecret =
      "b6dac735ebfa40ef58031382071ae60c738ac693e0f2c542e3b4f5e7d9e367a4";
    const deviceShareIndex =
      "6def503eea5d321c285abdcd385c0451f2b6acd0d05c522c7e3c032e0de9fb4b";

    const providerShareSecret =
      "dd819ae466a9a6e3e297aa629caa405af31f7806c8a48677ed6c55c0c8e64e34";
    const providerShareIndex = "1";

    const privateKey = new BN(
      "dc146f1a3f4ae942d14ce82676c30b8cc933f0149e807e802b6f2039452083a9",
      "hex"
    );

    shares.push(new BN(deviceShareSecret, "hex"));
    indexes.push(new BN(deviceShareIndex, "hex"));
    shares.push(new BN(providerShareSecret, "hex"));
    indexes.push(new BN(providerShareIndex, "hex"));

    const calculatedPrivateKey = lagrangeInterpolation(shares, indexes);
    if (calculatedPrivateKey.eq(privateKey)) {
      console.log("Found the private key: ", privateKey.toString("hex"));
    } else {
      console.log("Private key not found");
    }
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
