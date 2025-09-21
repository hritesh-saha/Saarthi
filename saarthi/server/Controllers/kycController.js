import { v4 as uuidv4 } from "uuid";
import KYC from "../models/kycModel.js";
import { encryptData, decryptData } from "../utils/encrypt.js";
import { storeDataInBlockchain } from "../utils/blockchain.js";
import crypto from "crypto";

 // CREATE KYC

export const storeKYC = async (req, res) => {
  try {
    const { fullName, passportNumber, nationality, contactNumber, address, latitude, longitude } = req.body;

    // Convert uploaded PDF file to base64
    let documentBase64 = null;
    if (req.file) {
      documentBase64 = req.file.buffer.toString("base64"); // multer with storage.memoryStorage() required
    }

    // Encrypt details
    const encryptedData = encryptData({
      fullName,
      passportNumber,
      nationality,
      contactNumber,
      address,
      latitude,
      longitude
    });

    // Create hash of data
    const dataHash = crypto.createHash("sha256").update(encryptedData).digest("hex");

    // Unique ID for tourist
    const touristId = uuidv4();

    // Store hash in blockchain
    const blockchainId = await storeDataInBlockchain(touristId, fullName, dataHash);

    // Save in MongoDB
    const kycRecord = new KYC({
      touristId,
      fullName,
      passportNumber,
      nationality,
      contactNumber,
      address,
      geoLocation: { latitude, longitude },
      documentBase64, // store PDF file as base64
      blockchainId,
      encryptedData
    });

    await kycRecord.save();

    res.status(201).json({
      message: "✅ KYC stored successfully",
      blockchainId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


 // GET KYC by ID

export const getKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const kycRecord = await KYC.findById(id);

    if (!kycRecord) {
      return res.status(404).json({ message: "❌ KYC record not found" });
    }

    // Decrypt data before returning
    const decryptedData = decryptData(kycRecord.encryptedData);

    res.status(200).json({
      blockchainId: kycRecord.blockchainId,
      documentUrl: kycRecord.documentUrl,
      geoLocation: kycRecord.geoLocation,
      decryptedData
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE KYC

export const updateKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, passportNumber, nationality, contactNumber, address, latitude, longitude } = req.body;

    const kycRecord = await KYC.findById(id);
    if (!kycRecord) {
      return res.status(404).json({ message: "❌ KYC record not found" });
    }

    // If document re-uploaded
    let documentUrl = kycRecord.documentUrl;
    if (req.file) {
      documentUrl = req.file.path;
    }

    // Encrypt updated details
    const encryptedData = encryptData({
      fullName: fullName || kycRecord.fullName,
      passportNumber: passportNumber || kycRecord.passportNumber,
      nationality: nationality || kycRecord.nationality,
      contactNumber: contactNumber || kycRecord.contactNumber,
      address: address || kycRecord.address,
      latitude: latitude || kycRecord.geoLocation.latitude,
      longitude: longitude || kycRecord.geoLocation.longitude
    });

    // Recompute hash + push to blockchain
    const dataHash = crypto.createHash("sha256").update(encryptedData).digest("hex");
    const blockchainId = await storeHashInBlockchain(dataHash);

    // Update record
    kycRecord.fullName = fullName || kycRecord.fullName;
    kycRecord.passportNumber = passportNumber || kycRecord.passportNumber;
    kycRecord.nationality = nationality || kycRecord.nationality;
    kycRecord.contactNumber = contactNumber || kycRecord.contactNumber;
    kycRecord.address = address || kycRecord.address;
    kycRecord.geoLocation = { latitude, longitude };
    kycRecord.documentUrl = documentUrl;
    kycRecord.blockchainId = blockchainId;
    kycRecord.encryptedData = encryptedData;

    await kycRecord.save();

    res.status(200).json({
      message: "✅ KYC updated successfully",
      blockchainId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
