import fs from 'fs';

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getCarts() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async writeCarts(carts) {
        try {
            await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.error('Error al escribir el archivo de carritos:', error);
        }
    }

    async addCart() {
        const carts = await this.getCarts();
        const newCartId = carts.length > 0 ? Math.max(...carts.map(cart => cart.id)) + 1 : 1;
        const newCart = { id: newCartId, products: [] };
        carts.push(newCart);
        await this.writeCarts(carts);
        return newCart;
    }

    async addProductToCart(cartId, productId, quantity) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cartId);
       
       //console.log("carts antes del update", carts);
       
        if (!cart) {
            throw new Error(`No existe el carrito con id ${cartId}`);
        }

        console.log("cart antes del update", cart);

        const existingProduct = cart.products.find(product => product.id === productId);
        if (existingProduct) {

            console.log("Producto existente encontrado:", existingProduct);

            existingProduct.quantity = quantity;
        } else {

            console.log("Producto nuevo agregado al carrito.");

            cart.products.push({ id: productId, quantity: quantity });
        }

        console.log("cart despues del update", cart);

        await this.writeCarts(carts);

        // console.log("carts despues del update", carts);
        // return cart;
    }

    async removeCart(cartId) {
        let carts = await this.getCarts();
        carts = carts.filter(cart => cart.id !== cartId);
        await this.writeCarts(carts);
        return true;
    }
}

export default CartManager;