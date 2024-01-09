import DbResult from "../type/DbResult";
import prisma from "../utils/database";
import Command from "./command";
import Product from "./product";

//Définir la classe Orders_Products
type Orders_Products = {
  commandId: number;
  command: Command;
  productId: number;
  product: Product;
  quantity: number;
}

export default Orders_Products