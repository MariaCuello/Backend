import fs from "fs";
class ProductManager {

    constructor (path){
        this.path = path;
    }

    async addProduct (obj) {

        const productos = await this.getProducts();
        const id =  productos.length ? productos.length + 1 : 1;
        let status = true;

        const producto = { id, status, ...obj};
        console.log( productos.find ((event) => event.codigo === obj.codigo));
            
        if (!(obj.titulo && obj.descripcion && obj.precio && obj.codigo && obj.stock && obj.categoria))
            return null;
        else if (productos.find ((event) => event.codigo === obj.codigo))
            return null;
        else {
            productos.push(producto);
            await fs.promises.writeFile(this.path, JSON.stringify(productos));
            return producto;
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

    async updateProduct (id, obj) {
        try {
            let productos = await this.getProducts();
            
            const pos = productos.findIndex((item) => item.id === id);
            if (pos === -1)
                return "No encontrado";
            productos[pos] = { ...productos[pos], ...obj };
            await fs.promises.writeFile(this.path, JSON.stringify(productos));
            return "Producto actualizado";
        } catch (error) {
            return error;
        }
    }
}


export const productManager = new ProductManager("ProductsAPI.json");