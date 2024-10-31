const firstTraderSecret = "SA..."; // Replace with first trader's secret key
const secondTraderSecret = "SB..."; // Replace with second trader's secret key
const server = new diamnet.Aurora.Server("https://diamtestnet.diamcircle.io");

async function tradeNFTs(firstNFTName, secondNFTName) {
  try {
    const firstTraderKeypair = diamnet.Keypair.fromSecret(firstTraderSecret);
    const secondTraderKeypair = diamnet.Keypair.fromSecret(secondTraderSecret);

    const firstNFT = new diamnet.Asset(firstNFTName, "GISSUER_PUBLIC_KEY"); // Replace with the issuer's public key
    const secondNFT = new diamnet.Asset(secondNFTName, "GISSUER_PUBLIC_KEY"); // Replace with the issuer's public key

    const firstAccount = await server.loadAccount(
      firstTraderKeypair.publicKey()
    );
    const secondAccount = await server.loadAccount(
      secondTraderKeypair.publicKey()
    );

    const sendNFT1Tx = new diamnet.TransactionBuilder(firstAccount, {
      fee: diamnet.BASE_FEE,
      networkPassphrase: diamnet.Networks.TESTNET,
    })
      .addOperation(
        diamnet.Operation.payment({
          destination: secondTraderKeypair.publicKey(),
          asset: firstNFT,
          amount: "1",
        })
      )
      .setTimeout(180)
      .build();
    sendNFT1Tx.sign(firstTraderKeypair);

    const sendNFT2Tx = new diamnet.TransactionBuilder(secondAccount, {
      fee: diamnet.BASE_FEE,
      networkPassphrase: diamnet.Networks.TESTNET,
    })
      .addOperation(
        diamnet.Operation.payment({
          destination: firstTraderKeypair.publicKey(),
          asset: secondNFT,
          amount: "1",
        })
      )
      .setTimeout(180)
      .build();
    sendNFT2Tx.sign(secondTraderKeypair);

    const result1 = await server.submitTransaction(sendNFT1Tx);
    console.log("First NFT transfer successful:", result1);

    const result2 = await server.submitTransaction(sendNFT2Tx);
    console.log("Second NFT transfer successful:", result2);

    alert("NFT trade completed successfully!");
  } catch (error) {
    console.error("Error during NFT trade:", error.message);
    alert("An error occurred during the trade.");
  }
}

document
  .getElementById("tradeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    const firstNFT = document.getElementById("firstNFT").value;
    const secondNFT = document.getElementById("secondNFT").value;

    tradeNFTs(firstNFT, secondNFT); // Call the trade function with user input
  });
