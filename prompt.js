const readlineSync = require("readline-sync");
const { createNFT, createNftAsset } = require("./create_NFT");

// Prompt for details
const issuerSecret = "GDPQXD25TSYUP2NYYI73BZRF55KOGC3CNV2QIA36VTGOMABZB4LJWZBX";
//const receiverSecret = readlineSync.question("Enter the receiver secret key: ");
//const receiverPublicKey = readlineSync.question("Enter the receiver public key: ");
const nftName = readlineSync.question("Enter the NFT name: ");
//const nftMetadata = readlineSync.question("Enter the NFT metadata: ");
const filePath =
  "C:\\Users\\mahip\\OneDrive\\Pictures\\Screenshots\\Screenshot 2024-10-26 230613.png";

async function mintNFT() {
  try {
    const result = await createNftAsset(issuerSecret, nftName, filePath);
    console.log(result);
  } catch (error) {
    console.error("Error creating NFT:", error);
  }
}

mintNFT();
