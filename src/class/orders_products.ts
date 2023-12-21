import Command from "./command";
import Product from "./product";

//Définir la classe Orders_Products
export default class Orders_Products {
  commandId: number;
  command: Command;
  productId: number;
  product: Product;

  /**
   *Define a new orders_products
   */
  constructor(
    commandId: number,
    command: Command,
    productId: number,
    product: Product
  ) {
    this.commandId = commandId;
    this.command = command;
    this.productId = productId;
    this.product = product;
  }
}
