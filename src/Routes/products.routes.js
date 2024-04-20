import { Router } from 'express';
//import productosData from  '../productos.json' assert { type: 'json' };
import ProductManager  from '../../ProductManager.js';

const router = Router();
const productManager = new ProductManager('productos.json');

//Get/api/products
router.get( '/', async (req, res) =>{
    try{
        const products = await productManager.getProducts( );
        res.json({ok: true, products});
    }catch (error) {
        res.status(400).json({ok: false, message: "Error al obtener los productos"});
    }
});

// Get /api/products/:id
router.get('/:pId', async (req,res)=>{
    const pId= Number(req.params.pId);
    
    try{
        const product = await productManager.getProductById(pId);
        if(product) {
            res.json({ok: true, product});
            } else {
                res.status(404).json({ ok :false ,message:`No se encontró el producto con id ${pId}`}) ;    
            }                        
    } catch (error) {
        res.status(500).json({ok: false, message: "Error al obtener el producto"});
    }
    
   // if (isNaN(pId)) {
     //   return res.json({ok: true, message: `No existe el producto con el id ${pId}`,
    //        queryParams: req.query,

   

//    const product = productosData.find((u) => {
  //      return u.id === Number(pId);
  //  });
  //  if (!product) {
  //      return res.json({
  //          ok: true,
  //          message: `No se ha encontrado el producto con el id "${pId}"`,
  //          queryParams: req.query,
  //      });
  //  }
  //  return res.json({ ok: true, message: `product id: ${pId}`, product });  

});
// POST /api/products
router.post('/', async (req, res) => {
    const prod = req.body;
    //const lastId = productosData[productosData.length - 1].id;
    //const newprod = {
    //    id: lastId + 1, ...prod };
    //productosData.push(newprod);
//    try { fs.writeFileSync('productos.json', JSON.stringify(productosData, null, 2));
        
    //} catch (error) {console.log(error)        
    //}
    // Guardar los cambios en el archivo JSON
    //res.json({ ok: true, message: "Producto agregado", product: newprod });
    try {
        const pId = await productManager.addProduct(prod);
        res.json({ ok: true, message: 'Producto creado correctamente', pId });
    } catch (error) {
        res.status(500).json({ok: false, message:"Error al agregar el producto"});
    }
});

// PUT /api/products/:id
router.put('/:pId', async (req, res) => {
    const updatedProduct = req.body;
    const productId = req.params.pId;
    // const index = productosData.findIndex(p => p.id === Number(productId));
    // if (index !== -1) {
    //     productosData[index] = { ...productosData[index], ...updatedProduct };
    //     fs.writeFileSync('./productos.json', JSON.stringify(productosData, null, 2)); // Guardar los cambios en el archivo JSON
    //     res.json(productosData[index]);
    // } else {
    //     res.status(404).json({
    //         ok: false,
    //         message: `No existe el producto con id ${productId}`
    //     });
    // }
    try{
        const product = await productManager.updateProduct(productId, updatedProduct);
        if (product){
            res.json({ ok: true, message: "Producto actualizado", product});
            }else{
                res.status(500).json({ok: false, message: `No se encontró el producto con id ${productId}`})
            }
      }catch(error){
        res.status(500).json({ok: false, message: "Error al actualizar el producto" })
      }
});

// DELETE /api/products/:id
router.delete('/:pId', async (req, res) => {
    const productId = req.params.pId;
    // const filteredProducts = productosData.filter(p => p.id !== Number(productId));
    // if (filteredProducts.length < productosData.length) {
    //     productosData.splice(0, productosData.length, ...filteredProducts); // Eliminar todos los elementos y añadir los filtrados
    //     console.log(filteredProducts)
    //     try {
    //         fs.writeFileSync('productos.json', JSON.stringify(productosData, null, 2));
    //     } catch (error) {
    //         console.log(error)
    //     }
    //     // Guardar los cambios en el archivo JSON
    //     res.json({
    //         ok: true,
    //         message: 'Producto eliminado correctamente'
    //     });
    // } else {
    //     res.status(404).json({
    //         ok: false,
    //         message: `No existe el producto con id ${productId}`
    //     });
    // }
    try {
        const success = await productManager.deleteProduct(productId);
        if (success) {
            res.json({ok: true, message: "Producto eliminado"});
        } else {
            res.status(404).json({ok: false, message: `No se encontró el producto con id ${productId}`});
        }
    } catch (err) {
        res.status(500).json({ok: false, message:"Error al eliminar el producto"});
    }
});


export default router;