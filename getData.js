const diamnet = require("diamnet-sdk");

async function fetchDataFromAccount(publicKey) {
  // Connect to the Diamante server (testnet in this example)
  const server = new diamnet.Aurora.Server("https://diamtestnet.diamcircle.io");

  try {
    // Load the account's data
    const account = await server.loadAccount(publicKey);
    const data = account.data_attr;

    // Display all data entries stored in this account
    console.log("Data stored on account:");
    for (const [key, value] of Object.entries(data)) {
      console.log(
        `Key: ${key}, Value: ${Buffer.from(value, "base64").toString()}`
      );
    }
  } catch (error) {
    console.error("Error fetching data from account:", error.message);
  }
}

// Replace with the public key of the account you want to access
fetchDataFromAccount(
  "GDPQXD25TSYUP2NYYI73BZRF55KOGC3CNV2QIA36VTGOMABZB4LJWZBX"
);

module.exports = { fetchDataFromAccount }; //remove the previous function call when adding it into another file that calls according to your need
