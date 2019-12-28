const express = require('express');

const multer = require("multer");

const VendorController = require("../controllers/vendors");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const vendorName = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, vendorName + '-' + Date.now() + '.' + ext);
  }
});

router.post("", multer({storage: storage}).single("image"), );

router.put(
  "/:id",
  multer({storage: storage}).single("image"),
  VendorController.createVendor
  );

router.get("", VendorController.getVendors);

router.get("/:id", VendorController.getSingleVendors);

router.delete("/:id", VendorController.deleteVendor);

module.exports = router;
