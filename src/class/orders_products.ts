import DbResult from "../type/DbResult";
import prisma from "../utils/database";
import Command from "./command";
import Product from "./product";

//Définir la classe Orders_Products
export default class Orders_Products {
  commandId: number;
  command: Command;
  productId: number;
  product: Product;
  quantity: number;

  /**
   *Define a new orders_products
   */
  constructor({
    commandId,
    command,
    productId,
    product,
    quantity
  }: {
    commandId: number;
    command: Command;
    productId: number;
    product: Product;
    quantity: number;
  }) {
    this.commandId = commandId;
    this.command = command;
    this.productId = productId;
    this.product = product;
    this.quantity = quantity;
  }
}
