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
  } catch {
    throw new Error("Failed to authenticate with GBX client");
  }

  await client.call("SetApiVersion", "2023-04-24");
  await client.call("EnableCallbacks", true);
  await client.callScript("XmlRpc.EnableCallbacks", "true");

  cachedClient = client;
  return client;
}

export async function getGbxClient() {
  const client = await connectToGbxClient();
  return client;
}
