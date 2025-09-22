import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();
const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_SECRET;
 // 32 chars key
const iv = crypto.randomBytes(16);

export const encryptData = (data) => {
  console.log( secretKey)
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(JSON.stringify(data));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decryptData = (encrypted) => {
  const textParts = encrypted.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
};
