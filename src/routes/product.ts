import express, { Router, Request, Response } from "express";
import DbResult from "../type/DbResult";
import UserRole from "../type/UserRole";
import isManager from "../middlewares/isManager";
import isAdmin from "../middlewares/isAdmin";
import isAdminOrManager from "../middlewares/isAdminOrManager";
import passport from "passport";
import prisma from "../utils/database";
import Product from "../type/Product";

//Définir le router
const router: Router = express.Router();

//Récupérer tous les utilisateurs
router.get(
  "/",
  async (req: Request, res: Response) => {
    try {
      const products = await prisma.product.findMany();

      //Retourner la réponse
      if (!products) {
        res.status(404).send("No products found");
      } else {
        res.status(200).json({
          products: products,
        });
      }
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner la réponse
      res.status(500).send("An error has occured");
    }
  }
);

//Récupérer un produit grâce à son id
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdminOrManager,
  async (req: Request<{ id: string }>, res: Response) => {
    const id: number = parseInt(req.params.id);

    try {
      //Chercher le produit
      const product = await prisma.product.findUnique({
        where: {
          id: id,
        },
      });

      //Renvoyer la réponse
      if (!product) {
        res.status(404).send("product not found");
      } else {
        res.status(200).json({ "product": product });
      }
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner l'erreur
      res.status(500).send("Internal server error");
    }
  }
);

//Créer un produit
router.post("/add",
  passport.authenticate("jwt", { session: false }), isAdminOrManager, async (req: Request, res: Response) => {
    const product: Product = req.body;

    try {
      const DbSaved = await prisma.product.create({
        data: {
          name: product.name.toString(),
          price: product.price,
          description: product.description?.toString(),
        },
      });
      res.status(201).json({ "product": DbSaved })
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner l'erreur
      res.status(500).send("Error while adding product");
    }
  });

//Modifier un produit
router.patch(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdminOrManager,
  async (req: Request<{}, {}, Product>, res: Response) => {
    const newProduct: Product = req.body;

    try {
      if (!newProduct.id) {
        res.status(409).send("Please add the 'id' to the body");
      } else {
        //Chercher le produit
        const product = await prisma.product.update({
          where: {
            id: parseInt(newProduct.id.toString()),
          },
          data: {
            name: newProduct.name?.toString(),
            description: newProduct.description?.toString(),
            price: parseFloat(newProduct?.price.toString()),
          },
        });
        //Renvoyer la réponse
        res.status(200).json({ "product updated": product });
      }

    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner l'erreur
      if (e.code == 'P2025') {
        res.status(404).send("Product to update not found.");
      } else {
        res.status(500).send("Error while updating the product");
      }
    }
  }
);

//Supprimer un produit
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdminOrManager,
  async (req: Request<{id: string}>, res: Response) => {
    const id: number = parseInt(req.params.id.toString());

    try {
      if (!id) {
        res.status(409).send("Please add the 'id' to the url");
      } else {
      //Chercher le produit
      const product = await prisma.product.delete({
        where: {
          id: id,
        },
      });

      //Renvoyer la réponse
      res.status(200).json({ "product_deleted": product })
    }
      
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner l'erreur
      if (e.code == 'P2025') {
        res.status(404).send("Product to delete not found.");
      } else {
        res.status(500).send("Error while deleting the product");
      }
    }
  }
);

//Exporter le router
export default router;
