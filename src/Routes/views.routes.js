import { Router } from "express";

const viewsRoute = Router();

let prods = [];

// Ruta para mostrar la página de realtimeproducts
viewsRoute.get("/", (req, res) => {
    res.render("realtimeproducts", {});
});

// Ruta para agregar un nuevo producto
viewsRoute.post("/add", (req, res) => {
    const prodBody = req.body;
    console.log(prodBody); // Corregido el nombre de la variable
    const newProd = {
        ...prodBody,
        status: true,
    };

    prods.push(newProd);
    res.send("Producto agregado correctamente"); // Se puede enviar una respuesta
});

// Ruta para eliminar un producto por ID
viewsRoute.delete("/delete/:id", (req, res) => {
    const prodId = req.params.id; // Se obtiene el ID de los parámetros de la URL
    console.log(prodId);
    prods = prods.filter(prod => prod.id !== prodId);
    res.send("Producto eliminado correctamente"); // Se puede enviar una respuesta
});

export default viewsRoute;
