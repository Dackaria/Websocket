import fs from "fs/promises"

class ProductManager {
	constructor(path) {
		this.path = path;
	}

	async addProduct({ title, description, price, thumbnail, code, stock }) {
    		 if (!title || !description || !price || !thumbnail || !code || !stock) {
	     	console.log("Revisa las propiedades, te falta alguna");
			return null;
		    }

            const products = await this.getProducts();

            const repitCode = products.find(prod => prod.code === code);
            if (repitCode) {
                console.log('Algún código se repite', code);
                return null;
            }

            const id = products.length ? products[products.length - 1].id + 1 : 1
            
            console.log("generando nuevo ID")
            
            const newProduct = {title, description, price, thumbnail, code, stock, id};
            products.push(newProduct);

            console.log("Agregando un nuevo Producto", newProduct)

            await this.writeFile(products)

            console.log("producto agregado correctamente")

            return id
    }
	    
	    async getProducts() {
            try {
                const lista =await fs.readFile(this.path, "utf-8")
                const products = JSON.parse(lista);
                return products
            }   catch (error) {
                await fs.writeFile(this.path ,'[]');
                return [];
            }   
	    }

	    async getProductById(id) {
            const products = await this.getProducts();
		    const porId = products.find((prod) => prod.id === id);
            if(!porId) {
              console.log("Not found");
              return null;
            }
            return porId;
	    }

	    async updateProduct(id, obj) {
            const products = await this.getProducts();
            const indexProduct = products.findIndex(product => product.id === Number(id));
            console.log(typeof id);
            if(indexProduct < 0){
               console.log("No se encuentra el producto con el ID:", id)
               return null;
            }
            console.log("Producto antes de la actualización:", products[indexProduct]);


            products[indexProduct] = {...products[indexProduct], ...obj};

            console.log("Valores de actualización:", obj);
           
            await this.writeFile(products)
            return products[indexProduct]
	    }

	    async deleteProduct(id) {
            let products = await this.getProducts();

            console.log("ID recibido para eliminar", id)

		    const largoOriginal = products.length;
            products = products.filter(product => product.id !== Number(id));
           
            console.log("Productos después de eliminar:", products);

            if(largoOriginal == products.length){
               console.log("no encontrado")
               return null
	        }

            await this.writeFile(products)
            return true
        }

        async writeFile(products){
            try {
                const lista = JSON.stringify(products, null, 2);
                await fs.writeFile(this.path, lista);
                return true;
            } catch (error) {
                console.log("Error al escribir el archivo", error);
                return null;
            }
        }
      
} 

export default ProductManager