
import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER;

let blobServiceClient, containerClient;
let blobConnectionStatus = 'not attempted';
try {
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  containerClient = blobServiceClient.getContainerClient(containerName);
  // Try to get container properties to verify connection
  containerClient.getProperties().then(() => {
    console.log('✅ Connected to Azure Blob Storage container:', containerName);
    blobConnectionStatus = 'success';
  }).catch((err) => {
    console.error('❌ Failed to connect to Azure Blob Storage container:', err.message);
    blobConnectionStatus = 'failed';
  });
} catch (err) {
  console.error('❌ Error initializing Azure Blob Storage client:', err.message);
  blobConnectionStatus = 'failed';
}

export async function listUpcs() {
  const upcs = new Set();
  for await (const blob of containerClient.listBlobsByHierarchy('/')) {
    if (blob.kind === 'prefix') {
      const upc = blob.name.replace(/\/$/, '');
      upcs.add(upc);
    }
  }
  return Array.from(upcs);
}

export async function listFolder(upc, path = '') {
  const prefix = path ? `${upc}/${path}/` : `${upc}/`;
  const items = [];
  for await (const blob of containerClient.listBlobsByHierarchy('/', { prefix })) {
    if (blob.kind === 'prefix') {
      items.push({ name: blob.name.slice(prefix.length, -1), type: 'folder' });
    } else {
      items.push({ name: blob.name.slice(prefix.length), type: 'file' });
    }
  }
  return items;
}

export { containerClient };
