import express from "express";
import { productManager } from './ProductManager.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get ("/productos", async (req, res) => {
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

  app.get("/productos/:idProd", async (req, res) => {
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

  app.listen(8080, () => {
    console.log("Escuchando puerto:8080");
  });

