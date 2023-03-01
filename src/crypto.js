import pbkdf2 from "crypto-js/pbkdf2";
import { AES, enc, SHA256 } from "crypto-js";

function hashPassword(password) {
  return String(SHA256(password));
}

function generateKey({ email, hashedPassword, salt }) {
  return pbkdf2(`${email}:${hashedPassword}`, salt, {
    keySize: 32,
  }).toString();
}

function decryptVault({ vaultKey, vault }) {
  const bytes = AES.decrypt(vault, vaultKey);
  const decrypted = bytes.toString(enc.Utf8);

  try {
    return JSON.parse(decrypted).vault;
  } catch (e) {
    return null;
  }
}

function encryptVault({ vaultKey, vault }) {
  return AES.encrypt(vault, vaultKey).toString();
}

export { hashPassword, generateKey, decryptVault, encryptVault };
