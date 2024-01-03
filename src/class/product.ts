import DbResult from "../type/DbResult";
import prisma from "../utils/database";
import Orders_Products from "./orders_products";

//Définir la classe Product
export default class Product {
  //Définir les champs
  id: number;
  name: String;
  description?: String;
  price: number;
  orders_products?: Orders_Products[];

  /**
   *Define a new product
   */
  constructor({
    id,
    name,
    price,
    orders_products,
    description,
  }: {
    id: number;
    name: String;
    price: number;
    orders_products?: Orders_Products[];
    description?: String;
  }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.orders_products = orders_products;
  }

}
