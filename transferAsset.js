const diamnet = require("diamnet-sdk");

async function transfer_asset(receiverNFT, rarePullNft) {
  try {
    // Load the account of the receiver for setting up trustline
    let receiver = await server.loadAccount(receiverNFT.publicKey());

    //Build and submit the transaction to create a trustline for the NFT in the receiver's account
    let transaction = new diamnet.TransactionBuilder(receiver, {
      fee: diamnet.BASE_FEE,
      networkPassphrase: diamnet.Networks.TESTNET,
    })
      .addOperation(
        diamnet.Operation.changeTrust({
          asset: TheNFt, // Trustline for the new NFT asset, theNft will be the name of the nft being transferred
          limit: "1", // Set a limit of 1 for an NFT
          source: receiverNFT.publicKey(),
        })
      )
      .setTimeout(180)
      .build();

    // Sign the transaction with the receiver's keypair
    transaction.sign(receiverNFT);
    await server.submitTransaction(transaction);
    console.log("Trustline created successfully for NFT");

    //Issue the NFT to the receiver
    let distributor = await server.loadAccount(receiverNFT.publicKey());

    transaction = new diamnet.TransactionBuilder(distributor, {
      fee: diamnet.BASE_FEE,
      networkPassphrase: diamnet.Networks.TESTNET,
    })
      .addOperation(
        diamnet.Operation.payment({
          destination: receiverNFT.publicKey(), // Send NFT to the receiver
          asset: TheNFt, // The NFT asset to be issued
          amount: "1", // Since it’s an NFT, issuing one unit
        })
      )
      .setTimeout(180)
      .build();

    // Sign the issuance transaction
    transaction.sign(receiverNFT);
    const result = await server.submitTransaction(transaction);
    console.log("NFT issued and transferred successfully:", result);
  } catch (error) {
    console.error("There was an error in transferring the asset:", error);
  }
}

module.exports = { transfer_asset };
