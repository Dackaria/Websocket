import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import path from "path";
import ProductManager from '../ProductManager.js';
import CartManager from './CartManager.js';
import productsRouter from './Routes/products.routes.js';
import cartsRouter from './Routes/carts.routes.js';
import viewsRoute from "./Routes/views.routes.js";

const app = express();
const PORT = 8080;
const API_PREFIX = "api";

//configuracion de server io
const httpServer = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
const io = new Server(httpServer);

//configuracion de Handlebars 
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");

// Crear una instancia de ProductManager
const productManager = new ProductManager('productos.json');
const cartManager = new CartManager('carrito.json');

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(__dirname + "/public"))
app.use('/realtimeproducts', express.static(path.join(__dirname,'../public')));
app.use('/home', express.static(path.join(__dirname, '/public')))

// Middleware para establecer el tipo de contenido adecuado para los archivos JavaScript
app.use(express.static(path.join(__dirname, "/public"), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Rutas para productos
app.use(`/${API_PREFIX}/products`, productsRouter); 

// Rutas para carritos
app.use(`/${API_PREFIX}/carts`, cartsRouter);

app.use(`/${API_PREFIX}/realtimeproducts`, viewsRoute);

//IMPLEMENTACION SOCKET IO
io.on('connection', (socket)=> {
  console.log('servidor de socket io conectado')

  socket.on('nuevoProducto', async (nuevoProd) => {
      const response = await productManager.addProduct(nuevoProd)
      console.log(response)
      const products = await productManager.getProducts()
      socket.emit('products-data', products)
      socket.emit("status-changed", response)
  })

  socket.on('update-products', async () => {
      const products = await productManager.getProducts();
      socket.emit('products-data', products);
  });

//   socket.on('remove-product', async (code) => {
//       console.log("inicio remove socket")
//       const result = await productManager.deleteProduct(code) ;
//       socket.emit("status-changed", result)
//       const products = await productManager.getProducts();
//       socket.emit('products-data', products);
//       console.log("fin remove socket")
//   })
})

// Ruta para la vista principal
app.get("/", (req, res) => {
    res.render("index");
});

// Ruta para la vista de productos en tiempo real
app.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("realtimeproducts", { products });
});

// Ruta para la vista de inicio
app.get("/home", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
});
