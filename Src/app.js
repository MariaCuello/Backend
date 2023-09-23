import express from "express";
import { productManager } from './ProductManager.js';
import { cartManager } from "./CartManager.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get ("api/productos", async (req, res) => {
    try {
      let productos = await productManager.getProducts();
      const { limit } = req.query;
      
      if (limit) 
        productos = productos.slice(0, limit);

      if (!productos.length) {
        res.status(200).json({ message: "No se han encontrado productos" });
      } else {
        res.status(200).json({ message: 'Productos:', productos });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  });

  app.get("api/productos/:idProd", async (req, res) => {
    const { idProd } = req.params;
    try {
      const response = await productManager.getProductbyId(+idProd);
      if (response === "Producto no encontrado") {
        res.status(400).json({ message: response });
      } else {
        res.status(200).json({ message: "Producto:", response });
      }
    } catch (error) {
      res.status(500).json({ message: error })
    }
  });

  app.post("api/productos", async (req, res) => {
    try {
      const producto = await productManager.addProduct(req.body);

      if (!producto) {
        res.status(400).json({ message: 'Faltan campos o el producto ya existe' });
      } else {
        res.status(200).json({ message: 'Product añadido', producto });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  });

  app.put("api/productos/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const productoActualizado = await productManager.updateProduct(parseInt(id), req.body);
      if (productoActualizado === "No encontrado") {
        res.status(400).json({ message: productoActualizado });
      } else {
        res.status(200).json({ message: productoActualizado });
      }
    } catch (error) {
      res.status(500).json({ message: error })
    }
  });


  app.delete("api/productos/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const eliminar = await productManager.deleteProduct(parseInt(id));
      if (eliminar === "Producto no encontrado") {
        res.status(400).json({ message: eliminar });
      } else {
        res.status(200).json({ message: eliminar });
      }
    } catch (error) {
      res.status(500).json({ message: error })
    }
  });

  app.post("api/carts/", async (req, res) => {
    try {
      const cart = await cartManager.addCart(req.body);

      if (!cart) {
        res.status(400).json({ message: "Faltan datos" });
      } else {
        res.status(200).json({ message: 'Carro añadido', cart });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  });
  
  app.get("api/carts/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const products = await cartManager.getProducts(parseInt(id));
      if (!products) {
        res.status(400).json({ message: "No encontrado" });
      } else {
        res.status(200).json({ message: "Productos: ", products });
      }
    } catch (error) {
      res.status(500).json({ message: error })
    }
  });

  app.post("api/carts/:idCart/product/:idProduct", async (req, res) => {
    try {
      const { idCart, idProduct } = req.params; 
      const cart = await cartManager.addProduct(parseInt(idCart), parseInt(idProduct));

      if (!cart) {
        res.status(400).json({ message: "No encontrado" });
      } else {
        res.status(200).json({ message: 'Carro actualizado', cart });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  });
  
  app.listen(8080, () => {
    console.log("Escuchando puerto:8080");
  });

