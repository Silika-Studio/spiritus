const globalAny: any = global;
// Standard `ethers` import for chain interaction, `network` for logging, and `run` for verifying contracts
const { ethers } = require("hardhat");
// Import 'node-fetch' and set globally -- needed for Tableland to work with CommonJS
const fetch = (...args: [any]) =>
  import("node-fetch").then(({ default: fetch }) => fetch.apply(null, args));
globalAny.fetch = fetch;
require("@nomiclabs/hardhat-etherscan");

const { contractAddress } = require("./consts");

async function main() {
  const Decoy = await ethers.getContractFactory("Decoy");

  const contract = await Decoy.attach(contractAddress);

  const mintToken = await contract.mint(1);
  const mintTxn = await mintToken.wait();
  const mintReceipient = mintTxn.events[0].args[1];
  const tokenId = mintTxn.events[0].args[2];
  console.log(
    `\nNFT minted: tokenId '${tokenId.toNumber()}' to owner '${mintReceipient}'`
  );
  const tokenURI = await contract.tokenURI(tokenId);
  console.log(
    `See an example of 'tokenURI' using token '${tokenId}' here:\n${tokenURI}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
