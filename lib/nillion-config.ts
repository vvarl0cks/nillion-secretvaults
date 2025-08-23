export const NILLION_CONFIG = {
  // Testnet configuration
  testnet: {
    chain: "http://rpc.testnet.nilchain-rpc-proxy.nilogy.xyz",
    auth: "https://nilauth.sandbox.app-cluster.sandbox.nilogy.xyz",
    authPublicKey: "03e3ba1eb887b4e972fbf395d479ff6cdb2cec91ba477ffc287b2b9cb5ec2161aa",
    dbs: [
      "https://nildb-nx8v.nillion.network",
      "https://nildb-p3mx.nillion.network",
      "https://nildb-rugk.nillion.network",
    ],
    dbPublicKeys: [
      "034a2df3bafaca2aa0b70353aa2f05ad129096b60c8a305d115bf605d57bc2588a",
      "03d088a7f2c8f2a6e2aa788265c87e22d1501dd1210fa149ff600ac264ada5eb42",
      "02c4a5c6135098dd7ac1186c13d4de466be85f85efc6961e75abc31e4fdac41528",
    ],
  },
  // Storage API endpoints
  storageApi: {
    base: "https://nillion-storage-apis-v0.onrender.com",
  },
} as const

export type NillionNetwork = "testnet"
