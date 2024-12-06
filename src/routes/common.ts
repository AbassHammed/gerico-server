import { Router } from 'express';
import { requireAuth } from '../middlewares/protected-route';
import { CommonUtils } from '../controllers/common';
import { generateUUIDv4 } from '../utils/misc';
import { s3Client } from '../models/connect';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { logservice } from '../services/loggerService';

class CommonRouter {
  router = Router();
  controller = new CommonUtils();

  constructor() {
    this.initRouter();
  }

  initRouter() {
    this.router.get('/thresholds', requireAuth, this.controller.retrieveThresholds);
    this.router.get('/deductions', requireAuth, this.controller.retrieveDeductions);
    this.router.post('/upload', async (req, res) => {
      const fileName = req.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '');

      if (!fileName) {
        return res.status(400).json({ error: 'No filename provided' });
      }

      const fileKey = `payslips/${generateUUIDv4()}-${fileName}`;

      try {
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: fileKey,
            Body: req.body,
            ACL: 'public-read',
            ContentType: 'application/pdf',
          }),
        );

        const fileUrl = `https://${process.env.BUCKET_NAME}.ams3.digitaloceanspaces.com/${fileKey}`;
        res.json({ url: fileUrl });
      } catch (error) {
        logservice.error('[upload$CommonRouter]', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
      }
    });
  }
}

export default new CommonRouter().router;
