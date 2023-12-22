import express, { Router, Request, Response } from "express";
import Product from "../class/product";
import DbResult from "../type/DbResult";
import UserRole from "../type/UserRole";
import isManager from "../middlewares/isManager";
import isAdmin from "../middlewares/isAdmin";
import isAdminOrManager from "../middlewares/isAdminOrManager";

//Définir le router
const router: Router = express.Router();

//Récupérer un produit grâce à son id
router.get(
  "/:id",
  isAdminOrManager,
  async (req: Request<{ id: string }>, res: Response) => {
    const id: number = parseInt(req.params.id);

    //Créer le produit
    const product: Product = new Product({ id: id, name: "", price: 0.0 });

    try {
      //Chercher le produit
      const result: DbResult = await product.FindById();

      //Renvoyer la réponse
      result.product
        ? res.status(result.code).json({ "Product found": result.product })
        : res.status(result.code).send(result.message);
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner l'erreur
      res.status(500).send("Error while adding product");
    }
  }
);

//Créer un produit
router.post("/add", isAdminOrManager, async (req, res) => {
  const product: Product = new Product(req.body);

  try {
    const result: DbResult = await product.AddToDb();

    result.product
      ? res.status(result.code).json({ "Product created": result.product })
      : res.status(result.code).send(result.message);
  } catch (e: any) {
    //Log l'erreur
    console.error(e);

    //Retourner l'erreur
    res.status(500).send("Error while adding product");
  }
});

//Modifier un produit
router.patch(
  "/:id",
  isAdminOrManager,
  async (req: Request<{ id: string }, {}, Product>, res: Response) => {
    const id: number = parseInt(req.params.id);
    const newProduct: Product = req.body;

    //Créer le produit
    const product: Product = new Product({ id: id, name: "", price: 0.0 });

    try {
      //Chercher le produit
      const result: DbResult = await product.Update(newProduct);

      //Renvoyer la réponse
      result.product
        ? res.status(result.code).json({ "Product updated": result.product })
        : res.status(result.code).send(result.message);
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner l'erreur
      res.status(500).send("Error while updating the product");
    }
  }
);

//Supprimer un produit
router.delete(
  "/:id",
  isAdminOrManager,
  async (req: Request<{ id: string }, {}, Product>, res: Response) => {
    const id: number = parseInt(req.params.id);
    const newProduct: Product = req.body;

    console.log(newProduct);

    //Créer le produit
    const product: Product = new Product({ id: id, name: "", price: 0.0 });

    try {
      //Chercher le produit
      const result: DbResult = await product.Delete();

      //Renvoyer la réponse
      result.product
        ? res.status(result.code).json({ "Product deleted": result.product })
        : res.status(result.code).send(result.message);
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner l'erreur
      res.status(500).send("Error while adding product");
    }
  }
);

//Exporter le router
export default router;
