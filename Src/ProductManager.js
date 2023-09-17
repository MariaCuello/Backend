import fs from "fs";
class ProductManager {

    constructor (path){
        this.path = path;
    }

    async addProduct (titulo, descripcion, precio, url, codigo, stock) {

        const productos = await this.getProducts();

        const producto = {
            id: productos.length ? productos.length + 1 : 1,
            titulo: titulo,
            descripcion: descripcion,
            precio: precio,
            thumbnail: url,
            codigo: codigo,
            stock: stock
        };

        if (!titulo && descripcion && precio && url && codigo && stock)
            return "Faltan datos";
        else if (productos.find ((event) => event.codigo === codigo))
            return "El producto ya existe";
        else if ((titulo && descripcion && precio && url && codigo && stock) && !productos.find ((event) => event.codigo === codigo)){
            productos.push(producto);
            await fs.promises.writeFile(this.path, JSON.stringify(productos));
            return "Producto añadido correctamente";
        }

    }

    async getProducts () {
        try {
            if(fs.existsSync(this.path)){
                const info = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(info);
            } else {
                return [];
            }
        } catch (error) {
            return error
        }
    }


    async getProductbyId (id) {
        try{
            const productos = await this.getProducts();
            const producto = productos.find ((event) => event.id === id);
            return producto ? producto : "Producto no encontrado";
        }catch (error){
            return error;
        }
    }

    async deleteProduct (id) {
        try {
            const productos = await this.getProducts();
            if (!productos.find ((event) => event.id === id)) 
                return "Producto no encontrado";
            const productos_ = productos.filter(event => event.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(productos_));
            return "Producto eliminado";
        } catch (error) {
            return error;
        }
    }

    async updateProduct (producto) {
        try {
            let productos = await this.getProducts();
            if (!productos.find ((event) => event.id === producto.id)) 
                return "Producto no encontrado";
            await this.deleteProduct(producto.id);
            productos = await this.getProducts();
            productos.push(producto);
            await fs.promises.writeFile(this.path, JSON.stringify(productos));
            return "Product actualizado";
        } catch (error) {
            return error;
        }
    }
}


export const productManager = new ProductManager("ProductsAPI.json");