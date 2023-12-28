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
// //Récupérer un produit grâce à son id
// router.get(
//   "/:id",
//   passport.authenticate("jwt", {session: false}),
//   isAdminOrManager,
//   async (req: Request<{ id: string }>, res: Response) => {
//     const id: number = parseInt(req.params.id);

//     //Créer le produit
//     const product: Product = new Product({ id: id, name: "", price: 0.0 });

//     try {
//       //Chercher le produit
//       const result: DbResult = await product.FindById();

//       //Renvoyer la réponse
//       result.product
//         ? res.status(result.code).json({ "product": result.product })
//         : res.status(result.code).send(result.message);
//     } catch (e: any) {
//       //Log l'erreur
//       console.error(e);

//       //Retourner l'erreur
//       res.status(500).send("Error while adding product");
//     }
//   }
// );

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

// //Modifier un produit
// router.patch(
//   "/:id",
//   isAdminOrManager,
//   async (req: Request<{ id: string }, {}, Product>, res: Response) => {
//     const id: number = parseInt(req.params.id);
//     const newProduct: Product = req.body;

//     //Créer le produit
//     const product: Product = new Product({ id: id, name: "", price: 0.0 });

//     try {
//       //Chercher le produit
//       const result: DbResult = await product.Update(newProduct);

//       //Renvoyer la réponse
//       result.product
//         ? res.status(result.code).json({ "product": result.product })
//         : res.status(result.code).send(result.message);
//     } catch (e: any) {
//       //Log l'erreur
//       console.error(e);

//       //Retourner l'erreur
//       res.status(500).send("Error while updating the product");
//     }
//   }
// );

// //Supprimer un produit
// router.delete(
//   "/:id",
//   isAdminOrManager,
//   async (req: Request<{ id: string }, {}, Product>, res: Response) => {
//     const id: number = parseInt(req.params.id);
//     const newProduct: Product = req.body;

//     console.log(newProduct);

//     //Créer le produit
//     const product: Product = new Product({ id: id, name: "", price: 0.0 });

//     try {
//       //Chercher le produit
//       const result: DbResult = await product.Delete();

//       //Renvoyer la réponse
//       result.product
//         ? res.status(result.code).json({ "product": result.product })
//         : res.status(result.code).send(result.message);
//     } catch (e: any) {
//       //Log l'erreur
//       console.error(e);

//       //Retourner l'erreur
//       res.status(500).send("Error while adding product");
//     }
//   }
// );

//Exporter le router
export default router;
