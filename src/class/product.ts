import Orders_Products from "./orders_products";

//Définir la classe Product
export default class Product {
  //Définir les champs
  id: number;
  name: String;
  description?: String;
  price: number;
  orders_products: Orders_Products[];

  /**
   *Define a new product
   */
  constructor(id: number, name: String, price: number, description?: String, orders_products: Orders_Products[]) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.orders_products = orders_products;
  }
}
