require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const diamnet = require("diamnet-sdk");
const mysql = require("mysql2");

// MySQL connection details
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "asdfghjkl",
  database: "rarepull_1",
});

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

async function uploadToPinata(filePath, nameOfNft) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let data = new FormData();
  data.append("file", fs.createReadStream(filePath));

  try {
    const response = await axios.post(url, data, {
      headers: {
        ...data.getHeaders(),
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });
    console.log("File uploaded successfully:", response.data);

    uploadData(response.data.IpfsHash, nameOfNft);
  } catch (error) {
    console.error(
      "Error uploading file to Pinata:",
      error.response ? error.response.data : error.message
    );
  }
}

//uploadToPinata("C:\\Users\\mahip\\Downloads\\apiKeys_rarePull.png");

function uploadData(hash, nameOfNft) {
  var server = new diamnet.Aurora.Server("https://diamtestnet.diamcircle.io");
  var sourceKeys = diamnet.Keypair.fromSecret(
    "SAAN6PUYL4VHRQGESGBKAIJQEQY472LGWB7I5JS4B463IZHASB7OGQYS" //will be our secret key of the user, using account 2
  );

  var transaction;

  server
    .loadAccount(sourceKeys.publicKey())
    .then(function (sourceAccount) {
      // Start building the transaction.
      transaction = new diamnet.TransactionBuilder(sourceAccount, {
        fee: diamnet.BASE_FEE,
        networkPassphrase: diamnet.Networks.TESTNET,
      })
        .addOperation(
          diamnet.Operation.manageData({
            name: nameOfNft, // The name of the data entry
            value: hash, // The value to store
          })
        )
        .setTimeout(0)
        .build();
      // Sign the transaction to prove you are actually the person sending it.
      transaction.sign(sourceKeys);
      // And finally, send it off to Diamante!
      return server.submitTransaction(transaction);
    })
    .then(function () {
      console.log("Success! Results:");
    })
    .catch(function (error) {
      console.error("Something went wrong!", error);
    });

  db.query(
    "INSERT INTO allNFT (nftName, ipfsHash) VALUES (?, ?)",
    [nameOfNft, hash],
    (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);
      } else {
        console.log("Data inserted successfully:", results);
      }
    }
  );
}

module.exports = { uploadToPinata };
