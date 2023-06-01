import { useEffect } from "react";
import { useState } from "react";
import {
  Box,
  Flex,
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

  function handleSubmit() {
    setKeyShares([...keyShares, new BN(keyShare, "hex")]);
    setIndexes([...indexes, new BN(index, "hex")]);
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
        <VStack width="100%" spacing={600}>
          <Box>
            <Heading>Shamir's Secret Sharing Scheme recovery</Heading>
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
            <Heading as="h3" size="md" m={2}>
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
            <Heading as="h3" size="md" m={2}>
              License
            </Heading>
            <Text>
              This tool is licensed under the{" "}
              <Link
                textDecoration={"underline"}
                href="https://github.com/corpus-io/web3auth-recovery/blob/main/LICENSE"
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
            <Heading as="h3" size="md" m={2}>
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
            </UnorderedList>
            <Button colorScheme="teal" onClick={handleToggle}>
              show example values
            </Button>
            <Collapse in={show}>
              <Box border={"1px"} borderRadius={10} p={4} maxW={"fit-content"}>
                <UnorderedList>
                  <ListItem>
                    deviceShare
                    <UnorderedList>
                      <ListItem>
                        index:
                        <pre>
                          6def503eea5d321c285abdcd385c0451f2b6acd0d05c522c7e3c032e0de9fb4b
                        </pre>
                      </ListItem>
                      <ListItem>
                        share:
                        <pre>
                          b6dac735ebfa40ef58031382071ae60c738ac693e0f2c542e3b4f5e7d9e367a4
                        </pre>
                      </ListItem>
                    </UnorderedList>
                  </ListItem>
                  <ListItem>
                    providerShare
                    <UnorderedList>
                      <ListItem>
                        index: <pre>1</pre>
                      </ListItem>
                      <ListItem>
                        share:
                        <pre>
                          dd819ae466a9a6e3e297aa629caa405af31f7806c8a48677ed6c55c0c8e64e34
                        </pre>
                      </ListItem>
                    </UnorderedList>
                  </ListItem>
                  <ListItem>
                    privateKey:
                    <pre>
                      dc146f1a3f4ae942d14ce82676c30b8cc933f0149e807e802b6f2039452083a9
                    </pre>
                  </ListItem>
                  <ListItem>
                    Ethereum Address:
                    <pre>0x97dA24fF2a92C94Db0535cf8D20FcA0Ab6dB9876</pre>
                  </ListItem>
                </UnorderedList>
              </Box>
            </Collapse>
          </Box>
        </VStack>
        <VStack mt={10}>
          <Flex direction="column" width="100%">
            <InputGroup>
              <HStack width="100%" alignItems={"start"}>
                <FormControl>
                  {/* <FormLabel>Index</FormLabel> */}
                  <Input
                    id="index"
                    type="text"
                    value={index}
                    placeholder="Index"
                    minW="650px"
                    onChange={(event) => setIndex(event.target.value)}
                  />
                  {indexes[0] && (
                    <Box width="100%">
                      Current indexes:{" "}
                      {indexes.map((index) => (
                        <Text>{index.toString("hex")}</Text>
                      ))}
                    </Box>
                  )}
                </FormControl>
                <FormControl>
                  {/* <FormLabel>Key share</FormLabel> */}
                  <Input
                    id="secret"
                    type="text"
                    value={keyShare}
                    placeholder="key share"
                    minW="650px"
                    onChange={(event) => setKeyShare(event.target.value)}
                  />
                  {keyShares[0] && (
                    <Box width="100%">
                      Current key shares:{" "}
                      {keyShares.map((share) => (
                        <Text>{share.toString("hex")}</Text>
                      ))}
                    </Box>
                  )}
                </FormControl>
                <Button colorScheme="teal" px="10" onClick={handleSubmit}>
                  Submit
                </Button>
              </HStack>
            </InputGroup>
          </Flex>
          <HStack width="100%"></HStack>
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
