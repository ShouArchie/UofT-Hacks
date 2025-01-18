import multer from 'multer';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: './public/uploads', // Directory to save photos
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate unique filename
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser for file uploads
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const userId = req.query.userId; // Get userId from query or session
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const multerUpload = upload.single('photo');
    multerUpload(req, {}, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'File upload failed', error: err });
      }

      const photoPath = `/uploads/${req.file.filename}`;

      try {
        await prisma.profile.update({
          where: { userId },
          data: { image: photoPath },
        });

        res.status(200).json({ message: 'Photo uploaded successfully', photoPath });
      } catch (error) {
        res.status(500).json({ message: 'Database update failed', error });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
