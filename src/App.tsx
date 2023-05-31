import { useEffect } from "react";
import { useState } from "react";
import {
  Box,
  Link,
  Heading,
  Button,
  UnorderedList,
  ListItem,
  Text,
  HStack,
  VStack,
  InputGroup,
  FormControl,
  FormLabel,
  Input,
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
    console.log("Handle submit");
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
        <VStack width="100%">
          <Box>
            <Heading>Shamir's Secret Sharing Scheme recovery</Heading>
            {/* <Heading as="h3" size="md">
              as implemented by{" "}
            </Heading> */}
            <Text>
              <Link
                textDecoration={"underline"}
                href="https://web3auth.io/tech"
              >
                Web3auth.io
              </Link>{" "}
              uses Shamir's secret sharing scheme to distribute key shares and
              later reconstruct a private key. This tool reverse engineers the
              reconstruction of the private key.
            </Text>
            <Heading as="h3" size="md">
              Credits
            </Heading>
            Most of the code is taken from web3auth.io's{" "}
            <Link
              textDecoration={"underline"}
              href="https://github.com/tkey/tkey/blob/master/packages/core/src/lagrangeInterpolatePolynomial.ts#L82"
            >
              implementation of the lagrange interpolation
            </Link>
            , or other places of the{" "}
            <Link
              textDecoration={"underline"}
              href="https://github.com/tkey/tkey"
            >
              tkey repository.
            </Link>
            . Alterations and some wrapper code provided by{" "}
            <Link
              textDecoration={"underline"}
              href="https://github.com/malteish"
            >
              malteish
            </Link>{" "}
            for{" "}
            <Link textDecoration={"underline"} href="https://www.tokenize.it/">
              Tokenize.it
            </Link>
            .
            <Heading as="h3" size="md">
              License
            </Heading>
            <Text>
              This tool is licensed under the{" "}
              <Link
                textDecoration={"underline"}
                href="https://opensource.org/licenses/MIT"
              >
                MIT license
              </Link>
              , just like the works it is based on. The source code can be found{" "}
              <Link
                textDecoration={"underline"}
                href="https://github.com/corpus-io/web3auth-recovery"
              >
                here
              </Link>
              .
            </Text>
            <Heading as="h3" size="md">
              How to use this tool
            </Heading>
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
                  index of the social recovery share is always 1
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
                <Button colorScheme="teal" onClick={handleToggle}>
                  show example values
                </Button>
              </ListItem>
              <Collapse in={show}>
                <UnorderedList>
                  <ListItem>
                    deviceShare
                    <UnorderedList>
                      <ListItem>
                        index:
                        "6def503eea5d321c285abdcd385c0451f2b6acd0d05c522c7e3c032e0de9fb4b"
                      </ListItem>
                      <ListItem>
                        share:
                        "b6dac735ebfa40ef58031382071ae60c738ac693e0f2c542e3b4f5e7d9e367a4"
                      </ListItem>
                    </UnorderedList>
                  </ListItem>
                  <ListItem>
                    providerShare
                    <UnorderedList>
                      <ListItem>index: "1"</ListItem>
                      <ListItem>
                        share:
                        "dd819ae466a9a6e3e297aa629caa405af31f7806c8a48677ed6c55c0c8e64e34"
                      </ListItem>
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
        </VStack>
        <VStack>
          <form onSubmit={handleSubmit}>
            <FormControl onSubmit={handleSubmit}>
              <InputGroup>
                <HStack width="100%">
                  <Box>
                    <FormLabel>
                      Index
                      <Input
                        id="index"
                        type="text"
                        value={index}
                        onChange={(event) => setIndex(event.target.value)}
                      />
                    </FormLabel>
                  </Box>
                  <Box>
                    <FormLabel>
                      Key share
                      <Input
                        id="secret"
                        type="text"
                        value={keyShare}
                        onChange={(event) => setKeyShare(event.target.value)}
                      />
                    </FormLabel>
                  </Box>
                  <Button colorScheme="teal" type="submit">
                    Submit
                  </Button>
                </HStack>
              </InputGroup>
            </FormControl>
          </form>
          <HStack width="100%">
            {/* <StackDivider borderColor="gray.200" /> */}
            <Box width="40%">
              Current indexes:{" "}
              {indexes.map((index) => (
                <Text>{index.toString("hex")}</Text>
              ))}
            </Box>
            <Box width="40%">
              Current key shares:{" "}
              {keyShares.map((share) => (
                <Text>{share.toString("hex")}</Text>
              ))}
            </Box>
          </HStack>
          <HStack>
            <Button
              colorScheme="teal"
              onClick={() => {
                getPrivateKey(keyShares, indexes, setPrivateKey);
              }}
            >
              Get Private Key
            </Button>
            <Button colorScheme="teal" onClick={reset}>
              Reset all
            </Button>
          </HStack>
          {privateKey && (
            <Box>
              <Text>Private Key: {privateKey.toString("hex")}</Text>
              <Text>Corresponding address: {ethAddress}</Text>
            </Box>
          )}
        </VStack>
      </header>
    </div>
  );
}

export default App;
