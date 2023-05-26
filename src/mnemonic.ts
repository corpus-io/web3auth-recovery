import createHash from "create-hash";

/**
 * These functions were taken from https://github.com/tkey/tkey/
 * and adapted
 * They are used to convert a mnemonic to entropy
 */

function normalize(str?: string): string {
  return (str || "").normalize("NFKD");
}

function binaryToByte(bin: string): number {
  return parseInt(bin, 2);
}

function lpad(str: string, padString: string, length: number): string {
  let string = str;
  while (string.length < length) {
    string = padString + string;
  }
  return string;
}

function bytesToBinary(bytes: number[]): string {
  return bytes.map((x) => lpad(x.toString(2), "0", 8)).join("");
}

function deriveChecksumBits(entropyBuffer: Buffer): string {
  const ENT = entropyBuffer.length * 8;
  const CS = ENT / 32;
  const hashFunction = createHash("sha256");
  const hash = hashFunction.update(entropyBuffer).digest();

  return bytesToBinary(Array.from(hash)).slice(0, CS);
}

function mnemonicToEntropy(mnemonic: string, english: string[]): string {
  const words = normalize(mnemonic).split(" ");
  if (words.length % 3 !== 0) {
    throw Error("Invalid Mnemonic");
  }

  // convert word indices to 11 bit binary strings
  const bits = words
    .map((word: string): string => {
      const index = english.indexOf(word);
      if (index === -1) {
        throw Error("Invalid Mnemonic");
      }

      return lpad(index.toString(2), "0", 11);
    })
    .join("");

  // split the binary string into ENT/CS
  const dividerIndex = Math.floor(bits.length / 33) * 32;
  const entropyBits = bits.slice(0, dividerIndex);
  const checksumBits = bits.slice(dividerIndex);

  // calculate the checksum and compare
  const temp = entropyBits.match(/(.{1,8})/g);
  if (!temp) {
    throw Error("Invalid Entropy");
  }
  const entropyBytes = temp.map(binaryToByte);
  if (entropyBytes.length < 16) {
    throw Error("Invalid Entropy");
  }
  if (entropyBytes.length > 32) {
    throw Error("Invalid Entropy");
  }
  if (entropyBytes.length % 4 !== 0) {
    throw Error("Invalid Entropy");
  }

  const entropy = Buffer.from(entropyBytes);
  const newChecksum = deriveChecksumBits(entropy);
  if (newChecksum !== checksumBits) {
    throw Error("Invalid Checksum");
  }

  return entropy.toString("hex");
}
