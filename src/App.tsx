import React from "react";
import { useState } from "react";
import "./App.css";
import ThresholdKey from "@tkey/default";

function App() {
  const [secretMessage, setSecretMessage] = useState<string>("Hello World");
  const [message, setMessage] = useState<string>("Hello World");
  const [tkey, setTkey] = useState<ThresholdKey>();

  function initTKey() {
    const tkey = new ThresholdKey();
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
      </header>
    </div>
  );
}

export default App;
