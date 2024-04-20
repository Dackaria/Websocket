import { Router } from 'express';
import CartManager from '../CartManager.js';


const router = Router();
const cartManager = new CartManager('carritos.json');

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json({ ok: true, carts });
    } catch (error) {
        res.status(500).json({ ok: false, message: 'Error al obtener los carritos' });
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    try {
        const carts = await cartManager.getCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (cart) {
            res.json({ ok: true, cart });
        } else {
            throw new Error(`No se encontró el carrito con ID ${cartId}`)
        }
    } catch (error) {
        res.status(404).json({ ok: false, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json({ ok: true, cart: newCart });
    } catch (error) {
        res.status(500).json({ ok: false, message: 'Error al crear el carrito' });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
  
    console.log("Cuerpo de la solicitud:", req.body);
  
    const quantity = parseInt(req.body.quantity);
    try {
        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json({ ok: true, cart: updatedCart });
        } catch (error) {
            res.status(404).json({ ok: false, message: error.message });
           }
});

router.delete('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    try {
        await cartManager.removeCart(cartId);
        res.json({ ok: true, message: `Carrito con id ${cartId} eliminado correctamente` });
    } catch (error) {
        res.status(404).json({ ok: false, message: error.message });
    }
});

export default router;
