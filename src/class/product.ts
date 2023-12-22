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

  /**
   * AddToDb
   */
  public async AddToDb(): Promise<DbResult> {
    try {
      //Créer le produit
      const product = await prisma.product.create({
        data: {
          name: this.name.toString(),
          price: this.price,
          description: this.description?.toString(),
        },
      });

      //Créer la réponse
      const response: DbResult = {
        code: 200,
        message: "Product created",
        product: product,
      };

      //Retourner la réponse
      return response;
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Créer la réponse
      let error: DbResult = {
        code: 500,
        message: "An error has occured",
      };

      //Retourner la réponse
      return error;
    }
  }

  /**
     * FindById
   
   
   try {

   } */
  public async FindById(): Promise<DbResult> {
    //Définir le retour
    let result: DbResult = {
      code: 200,
      message: "Product found",
    };

    try {
      //Chercher le produit
      const product = await prisma.product.findUnique({
        where: {
          id: parseInt(this.id.toString()),
        },
      });

      //Assigner le produit s'il existe;
      product
        ? (result.product = product)
        : (result = { code: 404, message: "Product not found" });

      //Retourner le produit
      return result;
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Créer la réponse
      result = {
        code: 500,
        message: "An error has occured",
      };

      //Retourner la réponse
      return result;
    }
  }

  /**
   * Update
newProduct: Product   */
  public async Update(newProduct: Product): Promise<DbResult> {
        //Définir le retour
        let result: DbResult = {
          code: 200,
          message: "Product updated",
        };
    
        try {
          //Chercher le produit
          const product = await prisma.product.update({
            where: {
              id: parseInt(this.id.toString()),
            },
            data: {
              name: newProduct.name?.toString(),
              description: newProduct.description?.toString(),
              price: parseFloat(newProduct?.price.toString()),
            },
          });
    
          //Assigner le produit s'il existe;
          product
            ? (result.product = product)
            : (result = { code: 404, message: "Product not found" });
    
          //Retourner le produit
          return result;
        } catch (e: any) {
          //Log l'erreur
          console.error(e);
    
          //Créer la réponse
          result = {
            code: 500,
            message: "An error has occured",
          };
    
          //Retourner la réponse
          return result;
        }
  }
}
