import axios from "axios";

export const storeHashInBlockchain = async (dataHash) => {
  try {
    const res = await axios.post(process.env.BLOCKCHAIN_API, { hash: dataHash });
    return res.data.uniqueId; // Blockchain returns unique ID
  } catch (error) {
    throw new Error("Blockchain error: " + error.message);
  }
};
