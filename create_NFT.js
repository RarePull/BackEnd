const diamnet = require("diamnet-sdk");
const { uploadToPinata } = require("./uploadNFT");

function createNftAsset(issuerKeypair, nftName, filePath) {
  try {
    const lol = new diamnet.Asset(nftName, issuerKeypair);

    uploadToPinata(filePath, nftName);
  } catch (e) {
    console.log("there was an error", e);
  }
}

module.exports = { createNftAsset };
