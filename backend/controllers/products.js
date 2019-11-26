const Product = require('../models/product');


exports.createProduct =  (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    cost: req.body.cost,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
    product.save().then(createdProduct =>{
      res.status(201).json({
        message: 'Product added successfully!',
        product: {
          ...createdProduct,
          id: createdProduct._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed"
      })
    });
  };

exports.updateProduct = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" +req.file.filename
    }
    const product = new Product({
    _id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    cost: req.body.cost,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Product.updateOne({_id: req.params.id, creator: req.userData.userId }, product).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Update successful!"});
    } else {
      res.status(401).json({ message: "User is not authorized!"})
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post!"
    })
  });
};

exports.getProducts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const productQuery = Product.find();
  let fetchedProducts;
  if (pageSize && currentPage) {
    productQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  productQuery
    .then(documents => {
      fetchedProducts = documents;
      return Product.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Products fetched successfully!',
        products: fetchedProducts,
        maxProducts: count
    });
})
.catch(error => {
  res.status().json({
    message: "Fetching products failed!"
})
});
};

exports.getSingleProducts = (req, res, next) => {
  Product.findById(req.params.id).then(product => {
    if  (product) {
      res.status(200).json (product);
    } else {
      res.status(404).json({message: 'Product not found!'})
    }
  }).catch(error => {
    res.status().json({
      message: "Fetching product failed!"
  });
  })
};

exports.deleteProduct = (req, res, next) => {
  Product.deleteOne({_id: req.params.id, creator: req.userData.userId})
  .then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion successful!"});
    } else {
      res.status(401).json({ message: "User is not authorized!"});
    }
  })
  .catch(error => {
    res.status().json({
      message: "Fetching posts failed!"
  });
  });
};
