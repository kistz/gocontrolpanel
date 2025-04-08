import config from "@/lib/config";
import { GbxClient } from "@evotm/gbxclient";

let cachedClient: GbxClient | null = null;

export async function connectToGbxClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new GbxClient();
  const status = await client.connect(config.XMLRPC.HOST, config.XMLRPC.PORT);
  if (!status) {
    throw new Error("Failed to connect to GBX client");
  }

  try {
    await client.call("Authenticate", config.XMLRPC.USER, config.XMLRPC.PASS);
  } catch (error) {
    throw new Error("Failed to authenticate with GBX client");
  }

  cachedClient = client;
  return client;
}

export async function getGbxClient() {
  const client = await connectToGbxClient();
  return client;
}