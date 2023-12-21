import Orders_Products from "./orders_products";
import User from "./user";

//Définir la classe Command
export default class Command {
  //Définir les champs
  id: number;
  commandNumber: number;
  userId: number;
  user: User;
  orders_products: Orders_Products[];

  /**
   *Define a new command
   */
  constructor(id: number, commandNumber: number, userId: number, user: User, orders_products: Orders_Products[]) {
    this.id = id;
    this.commandNumber = commandNumber;
    this.userId = userId;
    this.user = user;
    this.orders_products = orders_products;
  }
}
