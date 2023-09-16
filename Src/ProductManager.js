const fs = require("fs");
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

async function prueba(){
    const productManager = new ProductManager("Productos.json");
    console.log(await productManager.addProduct("camiseta", "description camiseta", 12.99, "url1", "1234", 100));
    console.log(await productManager.addProduct("pantalon", "description pantalon", 24.99,"url2", "1235", 200));
    console.log(await productManager.addProduct("zapato", "description zapato", 35, "url3", "1236", 1000));
    console.log(await productManager.getProductbyId(1));
    console.log(await productManager.getProductbyId(13));
    console.log(await productManager.deleteProduct(2));
    console.log(await productManager.updateProduct({id:1, titulo:"zapato mixto", descripcion:"description zapato", precio:56, thumbnail: "url3", codigo:"1236", stock:1000}));
}
prueba();


export const productManager = new ProductManager("ProductsAPI.json");