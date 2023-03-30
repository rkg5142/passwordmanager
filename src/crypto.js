import pbkdf2 from "crypto-js/pbkdf2";
import { SHA256 } from "crypto-js";

function hashPassword(password) {
  return String(SHA256(password));
}

function generateKey({ email, hashedPassword, salt }) {
  return pbkdf2(`${email}:${hashedPassword}`, salt, {
    keySize: 32,
  }).toString();
}


export { hashPassword, generateKey};
