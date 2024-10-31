const diamnet = require("diamnet-sdk");
//const { question } = require("readline-sync");
const { accountVerification } = require("./loadAccount");
const { transfer_asset } = require("./transferAsset");

let server = new diamnet.Aurora.Server("https://diamtestnet.diamcircle.io");

// async function sender_verification() {
//   //checking to see if users account actually exists and also storing the account after loading it
//   while (true) {
//     let senderSecretKey = question("what are your secret keys");
//     let senderKeypair = diamnet.Keypair.fromSecret(senderSecretKey);
//     try {
//       const sourceAccount = await server.loadAccount(senderKeypair.publicKey());
//       break;
//     } catch (error) {
//       if (error instanceof diamnet.NotFoundError) {
//         throw new Error("your account could not be found");
//       } else {
//         console.log("an error occured");
//       }
//     }
//   }
// }

async function make_payment(receiverKey, senderKeypair) {
  try {
    const transaction = new DiamSdk.TransactionBuilder(sourceAccount, {
      fee: DiamSdk.BASE_FEE,
      networkPassphrase: DiamSdk.Networks.TESTNET,
    })
      .addOperation(
        diamnet.Operation.payment({
          destination: receiverKey,
          asset: diamnet.Asset.native(), //its being sent in lumens, the native asset of diamnet
          amount: 10, //the amount thats being transferred to the destination account
        })
      )
      .setTimeout(180)
      .build();
    transaction.sign(senderKeypair);

    const result = await server.submitTransaction(transaction);

    const rarePullNft = "";
    transfer_asset(senderKeypair, rarePullNft);
  } catch (e) {
    console.log("There was an error");
  }
}

//this works only if the try block executes with no issues
accountVerification().then(() => {
  const receiverKey =
    "GC4ZJJRESNHECNST6HA5HUBYAUUGETMKGESJMEKYQLYBCQXTLYNVCUY7";
  make_payment(receiverKey);
});
