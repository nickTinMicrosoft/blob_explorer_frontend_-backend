import express from 'express';
import { listUpcs, listFolder, containerClient } from './azureBlob.js';
import archiver from 'archiver';

const router = express.Router();

router.get('/upcs', async (req, res) => {
  try {
    const upcs = await listUpcs();
    res.json(upcs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/upcs/:upcId/list', async (req, res) => {
  const { upcId } = req.params;
  const { path = '' } = req.query;
  try {
    const items = await listFolder(upcId, path);
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/upcs/:upcId/download', async (req, res) => {
  const { upcId } = req.params;
  const { path = '', files = [] } = req.query;
  const filesArr = Array.isArray(files) ? files : [files];
  if (filesArr.length === 1) {
    // Single file download
    const blobName = path ? `${upcId}/${path}/${filesArr[0]}` : `${upcId}/${filesArr[0]}`;
    const blobClient = containerClient.getBlobClient(blobName);
    const downloadBlockBlobResponse = await blobClient.download();
    res.setHeader('Content-Disposition', `attachment; filename="${filesArr[0]}"`);
    downloadBlockBlobResponse.readableStreamBody.pipe(res);
  } else {
    // Multiple files/folders: zip
    res.setHeader('Content-Disposition', 'attachment; filename="download.zip"');
    const archive = archiver('zip');
    archive.pipe(res);
    for (const file of filesArr) {
      const blobName = path ? `${upcId}/${path}/${file}` : `${upcId}/${file}`;
      const blobClient = containerClient.getBlobClient(blobName);
      const exists = await blobClient.exists();
      if (exists) {
        const downloadBlockBlobResponse = await blobClient.download();
        archive.append(downloadBlockBlobResponse.readableStreamBody, { name: file });
      }
    }
    archive.finalize();
  }
});

export default router;
