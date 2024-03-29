const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRoutes = require('./routes/products');
const vendorsRoutes = require('./routes/vendors');
const userRoutes = require('./routes/user');


const app = express();

mongoose.connect("mongodb+srv://andrewmartin1186:dudley12@posapp-opyi8.mongodb.net/test", { useCreateIndex: true, useNewUrlParser: true })
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin', '*'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use("/api/products", productsRoutes);
app.use("/api/vendors", vendorsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
