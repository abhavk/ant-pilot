import Arweave from "arweave";
import { LoggerFactory, SmartWeaveNodeFactory } from "redstone-smartweave";
import * as fs from "fs";
import { JWKInterface } from "arweave/node/lib/wallet";
import { testKeyfile } from "../constants";

(async () => {
  //~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE THE BELOW~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const subDomainToRemove = "changeme";
  const contractTxId = "lheofeBVyaJ8s9n7GxIyJNNc62jEVCKD7lbL3fV8kzU"; // The ANT Smartweave Contract that is to be modified
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  
  // ~~ Initialize Arweave ~~
  const arweave = Arweave.init({
    host: "testnet.redstone.tools",
    timeout: 600000,
    port: 443,
    protocol: "https",
  });

  // ~~ Initialize `LoggerFactory` ~~
  LoggerFactory.INST.logLevel("error");

  // ~~ Initialize SmartWeave ~~
  const smartweave = SmartWeaveNodeFactory.memCached(arweave);

  // Get the key file used for the distribution
  const wallet: JWKInterface = JSON.parse(
    await fs.readFileSync(testKeyfile).toString()
  );

  // ~~ Read contract source and initial state files ~~
  const pst = smartweave.pst(contractTxId);
  pst.connect(wallet);
  await pst.writeInteraction({
    function: "removeRecord",
    subDomain: subDomainToRemove,
  });
})();
