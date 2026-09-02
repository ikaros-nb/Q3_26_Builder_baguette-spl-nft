import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import {
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { getCreateAccountInstruction } from "@solana-program/system";

//import your wallet
import wallet from "../../devnet-wallet.json";
import { RPC_URL, RPC_WS_URL } from "../config";
import { DECIMALS } from "./config";
import { writeState } from "./state";

const rpc = createSolanaRpc(RPC_URL);

const rpcSubscriptions = createSolanaRpcSubscriptions(RPC_WS_URL);

(async () => {
  try {
    // create a signer from your wallet
    const signer = await createKeyPairSignerFromBytes(new Uint8Array(wallet));
    // generate a new mint signer for address
    const mint = await generateKeyPairSigner();

    // get the size of the mint
    const space = BigInt(getMintSize());

    // get the minimum balance for rent exemption
    const rent = await rpc.getMinimumBalanceForRentExemption(space).send();

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const sendAndConfirm = sendAndConfirmTransactionFactory({
      rpc,
      rpcSubscriptions
    });

    const msg = createTransactionMessage({ version: 0 });

    const msgWithPayer = setTransactionMessageFeePayerSigner(signer, msg);

    const msgWithLifetime = setTransactionMessageLifetimeUsingBlockhash(
      latestBlockhash,
      msgWithPayer
    );

    const txMessage = appendTransactionMessageInstructions(
      [
        getCreateAccountInstruction({
          payer: signer,
          newAccount: mint,
          lamports: rent,
          space,
          programAddress: TOKEN_PROGRAM_ADDRESS,
        }),
        getInitializeMintInstruction({
          mint: mint.address,
          decimals: DECIMALS,
          mintAuthority: signer.address,
          freezeAuthority: null,
        }),
      ],
      msgWithLifetime,
    );

    const signedTx = await signTransactionMessageWithSigners(txMessage);

    assertIsTransactionWithBlockhashLifetime(signedTx);

    const signature = getSignatureFromTransaction(signedTx);

    // send and confirm the transaction
    await sendAndConfirm(signedTx, {commitment: "confirmed"});

    console.log(
      `mint address: ${mint.address}. Transaction Signature: ${signature}`,
    );

    writeState({ mint: mint.address });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
