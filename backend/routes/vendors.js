const express = require('express');
const Vendor = require('../models/vendor');
const multer = require("multer");

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

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const vendor = new Vendor({
    vendorName: req.body.vendorName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    commission: req.body.commission,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    startDate: req.body.startDate,
    rentAmount: req.body.rentAmount,
    contractLength: req.body.contractLength,
    imagePath: url + "/images/" + req.file.filename
  });
  vendor.save().then(createdVendor =>{
    res.status(201).json({
      message: 'Vendor added successfully!',
      vendor: {
        id: createdVendor._id,
        vendorName: createdVendor.vendorName,
        firstName: createdVendor.firstName,
        lastName: createdVendor.lastName,
        commission: createdVendor.commission,
        email: createdVendor.email,
        phoneNumber: createdVendor.phoneNumber,
        address: createdVendor.address,
        startDate: createdVendor.startDate,
        rentAmount: req.body.rentAmount,
        contractLength: req.body.contractLength,
        imagePath: createdVendor.imagePath
      }
    });
  });

});

router.put(
  "/:id",
  multer({storage: storage}).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" +req.file.filename
    }
    const vendor = new Vendor({
    _id: req.body.id,
    vendorName: req.body.vendorName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    commission: req.body.commission,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    startDate: req.body.startDate,
    rentAmount: req.body.rentAmount,
    contractLength: req.body.contractLength,
    imagePath: imagePath
  });
  Vendor.updateOne({_id: req.params.id}, vendor).then(result => {
    console.log(result);
    res.status(200).json({ message: "Update successful!"});
  });
});

router.get("",(req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const vendorQuery = Vendor.find();
  let fetchedVendors;
  if (pageSize && currentPage) {
    vendorQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  vendorQuery
    .then(documents => {
      fetchedVendors = documents;
      return Vendor.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Vendors fetched successfully!',
        vendors: fetchedVendors,
        maxVendors: count
    });
});
})

router.get("/:id", (req, res, next) => {
  Vendor.findById(req.params.id).then(vendor => {
    if  (vendor) {
      res.status(200).json (vendor);
    } else {
      res.status(404).json({message: 'Vendor not found!'})
    }
  })
});

router.delete("/:id", (req, res, next) => {
  Vendor.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  })
  res.status(200).json({ message: "Vendor deleted!" });
});

module.exports = router;
