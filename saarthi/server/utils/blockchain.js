import Web3 from "web3";
import dotenv from 'dotenv';
dotenv.config();
import TouristRegisteryJSON from "../../blockchain/build/contracts/TouristRegistry.json"assert { type: "json" };
const CONTRACT_ABI = TouristRegisteryJSON.abi;

const PROVIDER_URL = process.env.PROVIDER_URL;
const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;
console.log("Owner Private Key:", OWNER_PRIVATE_KEY);
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const web3 = new Web3(PROVIDER_URL);

const ownerAccount = web3.eth.accounts.privateKeyToAccount(OWNER_PRIVATE_KEY);
web3.eth.accounts.wallet.add(ownerAccount);
web3.eth.defaultAccount = ownerAccount.address;

const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);


export const storeDataInBlockchain = async (touristId, username, hashedData) => {
  try {
    const tx = contract.methods.registerTourist(touristId, username, hashedData);
    const receipt = await tx.send({
      from: ownerAccount.address,
    });
    return receipt.transactionHash;
  } catch (err) {
    console.error("Blockchain error:", err);
    throw err; // propagate to calling function
  }
};

