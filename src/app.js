const ProductManager = require("./src/ProductManager.js");
const express = require("express");
const path = require("path");
const app = express();
const port = 8080;

const productos = new ProductManager(path.join(__dirname, "./src/ProductManager.json"));

app.get("/products", async (req, res) => {
  try {
    let productList = await productos.getProducts();
    const { limit } = req.query;

    if (!limit) {
      res.json(productList);
    } else {
      const limitNumber = parseInt(limit);
      if (Number.isInteger(limitNumber) && limitNumber > 0) {
        res.json(productList.slice(0, limitNumber));
      } else {
        res.status(400).send(`El límite ${limit} es inválido.`);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await productos.getProductById(id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error interno del servidor");
  }
});

app.listen(port, () => {
  console.log(`Aplicación funcionando en el puerto ${port}`);
});
