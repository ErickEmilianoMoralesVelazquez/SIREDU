import multer from "multer";
import path from "path";
import fs from "fs";

// Carpeta ./files en la raíz del proyecto
const UPLOAD_DIR = path.join(process.cwd(), "files");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

function fileFilter(req, file, cb) {
  // Acepta imágenes comunes
  const allowed = /image\/(png|jpg|jpeg|gif|webp)/i;
  if (!allowed.test(file.mimetype)) {
    return cb(new Error("Tipo de archivo no permitido"), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
