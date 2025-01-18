import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: './public/uploads', // Ensure this folder exists
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export const config = {
  api: { bodyParser: false }, // Disable Next.js body parser for file uploads
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const multerUpload = upload.single('photo');

    // Use `multerUpload` to handle the file upload
    multerUpload(req, {}, (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ error: 'Upload failed' });
      }

      // Debug uploaded file
      console.log('Uploaded file:', req.file);

      // Return the file path to the client
      const photoPath = `/uploads/${req.file.filename}`;
      res.status(200).json({ photoPath });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
