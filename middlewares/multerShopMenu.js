// middleware/multerShopMenu.js
import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "Shop-Menu");

// ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // unique filename: timestamp + original name (safe)
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    const fname = `${Date.now()}-${base}${ext}`;
    cb(null, fname);
  },
});

const fileFilter = (req, file, cb) => {
  // accept images only
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

export const uploadSingleImage = multer({ storage, fileFilter }).single("image");

// export upload dir constant if needed elsewhere
export default {
  uploadSingleImage,
  UPLOAD_DIR,
};
