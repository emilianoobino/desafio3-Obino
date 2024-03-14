const fs = require("fs");
const path = require("path");

class ProductManager {
  static autoIncrementId = 0;

  constructor(path) {
    this.path = path;
    this.products = [];
    this.init();
  }

  async init() {
    try {
      const fileExists = fs.existsSync(this.path);
      if (!fileExists) {
        await fs.promises.writeFile(this.path, '[]');
        this.products = [];
      } else {
        this.products = await this.getProduct();
      }

      if (this.products.length > 0) {
        const maxId = this.products.reduce((max, product) => Math.max(max, product.id), 0);
        ProductManager.autoIncrementId = maxId + 1;
      }
    } catch (error) {
      throw new Error("Error al inicializar los productos:", error);
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.error("Todos los campos son obligatorios");
        return;
      }

      if (this.products.some(item => item.code === code)) {
        console.error("El código ya está en uso");
        return;
      }

      const newProduct = {
        id: ++ProductManager.autoIncrementId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      this.products.push(newProduct);

      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
      console.log("Producto agregado con éxito");
    } catch (error) {
      throw new Error("Error al agregar el producto:", error);
    }
  }

  async getProduct() {
    try {
      return JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    } catch (error) {
      throw new Error("Error al intentar mostrar productos:", error);
    }
  }

  async getProductById(id) {
    try {
      const producto = this.products.find((producto) => producto.id == id);
      if (!producto) {
        console.log(`Producto con ID "${id}" no encontrado, intente con otro ID`);
      } else {
        console.log(producto);
        return producto;
      }
    } catch (error) {
      throw new Error("Error al intentar mostrar el producto:", error);
    }
  }

  async deleteProduct(id) {
    try {
      if (!this.products.find((producto) => producto.id == id)) {
        return console.log(`Producto con ID "${id}" no encontrado, intente con otro ID`);
      }

      let colecciones = this.products.filter((i) => i.id !== id);
      await fs.promises.writeFile(this.path, JSON.stringify(colecciones));
      console.log(`Producto ${id} eliminado`);
    } catch (error) {
      throw new Error("Error al intentar borrar el producto:", error);
    }
  }

  async updateProduct(id, campo, valor) {
    try {
      let colecciones = this.products;
      let numeroIndex = colecciones.findIndex((i) => i.id == id);
      if (numeroIndex === -1) {
        return console.log(`Not Found id: ${id}`);
      }
      colecciones[numeroIndex][campo] = valor;
      await fs.promises.writeFile(this.path, JSON.stringify(colecciones, null, 2));
      console.log(`Producto ${id} editado`);
    } catch (error) {
      throw new Error("Error al intentar modificar el producto:", error);
    }
  }
}

const manager = new ProductManager(path.join(__dirname, "./ProductManager.json"));
test = async () => {
    try{
await manager.addProduct("funko 1", "spiderman", 1500, "thumbnail1.jpg", "abc123", 50);
await manager.addProduct("funko 2", "batman", 1700, "thumbnail2.jpg", "abc124", 80);
await manager.addProduct("funko 3", "it", 2000, "thumbnail3.jpg", "abc125", 45);

// testing
// array vacío
console.log("Primer llamado Array vacio")
console.log( await manager.getProduct());

//codigo repetido
console.log("producto con el codigo repetido")
await manager.addProduct("playstation", "videojuego", 150000, "play5.jpg", "abc123", 10);

//Validación de campos faltantes
console.log("producto con campos faltantes")
await manager.addProduct("nintendo", 500000, "nintendo.jpg", "abc129", 30);

//productos por id
console.log("producto que existe por el ID")
await manager.getProductById(2);

//Producto no encontrado
console.log("producto que NO existe por el ID")
await manager.getProductById(5);

//eliminar un producto
console.log("eliminar funko 3")
await manager.deleteProduct(3);

//Probamos que pasa si no encuentra el id del producto a eliminar
console.log("probamos buscar un id que no existe para eliminar")
await manager.deleteProduct(15)

//Probamos editar un producto
console.log("probamos editar funko 1")
await manager.updateProduct(1, "price", 1200)

//Probamos que pasa si no encuentra el id del producto a editar
console.log("probamos buscar un id que no existe para editar");
await manager.deleteProduct(8, "price", 1520);
}catch(error){
    console.error("Error en la prueba:", error);
}
};
test();


module.exports = ProductManager;