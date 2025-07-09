import crypto from "crypto";
import "server-only";
import config from "./config";

const algorithm = "aes-256-gcm";
const ivLength = 12;
const key = crypto.createHash("sha256").update(config.HETZNER.KEY).digest();

export function encryptHetznerToken(token: string): string {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptHetznerToken(encryptedBase64: string): string {
  const data = Buffer.from(encryptedBase64, "base64");
  const iv = data.subarray(0, ivLength);
  const tag = data.subarray(ivLength, ivLength + 16);
  const encrypted = data.subarray(ivLength + 16);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
