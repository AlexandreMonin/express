import express, { Router, Request, Response } from "express";
import isManager from "../middlewares/isManager";
import isAdmin from "../middlewares/isAdmin";
import Command from "../class/command";
import DbResult from "../type/DbResult";
import User from "../class/user";
import Orders_Products from "../class/orders_products";
import prisma from "../utils/database";
import isAdminOrManager from "../middlewares/isAdminOrManager";

//Définir le router
const router: Router = express.Router();

//Récupérer une commande grâce à son id
router.get(
  "/:id",
  isManager || isAdmin,
  (req: Request<{ id: string }>, res: Response) => {
    const id: number = parseInt(req.params.id);
    res.status(200).send(id);
  }
);

//Créer une commande
router.post(
  "/add",
  async (req: Request<{}, {}, Orders_Products[]>, res: Response) => {
    const products: Orders_Products[] = req.body;
    console.log(products);
    const user: User = req.user as User;

    try {
      //Créer la commande
      const command = await prisma.command.create({
        data: {
          commandNumber: `CMD${Math.floor(Math.random() * 10000)}`,
          userId: user.id,
        },
      });

      const product = await prisma.orders_Products.createMany({
        data: products.map((prod) => ({
          productId: prod.productId,
          commandId: command.id,
          quantity: prod.quantity,
        })),
      });

      //Retourner la réponse
      res.status(201).json({
        message: "Command created",
        command: command,
        products: products,
      });
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Créer la réponse
      let error: DbResult = {
        code: 500,
        message: "An error has occured",
      };

      //Retourner la réponse
      res.status(500).send("An error has occured");
    }
  }
);

//Modifier une commande
router.patch(
  "/",
  isAdminOrManager,
  async (req: Request<{ id: string }, {}, Orders_Products>, res: Response) => {
    const id: number = parseInt(req.params.id);
    const product: Orders_Products = req.body;

    try {
      const db = await prisma.orders_Products.update({
        where: {
          commandId_productId: {
            commandId: product.commandId,
            productId: product.productId,
          },
        },
        data: {
          quantity: product.quantity,
        },
      });

      //Retourner la réponse
      res.status(201).json({
        message: "Command modified",
        product: db,
      });
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Créer la réponse
      let error: DbResult = {
        code: 500,
        message: "An error has occured",
      };

      //Retourner la réponse
      res.status(500).send("An error has occured");
    }
  }
);

//Supprimer une commande
router.delete(
  "/:id",
  isAdminOrManager,
  async (req: Request<{ id: string }>, res: Response) => {
    const id: number = parseInt(req.params.id);

    try {
      const orders_Products = await prisma.orders_Products.deleteMany({
        where: {
          commandId: id,
        },
      });

      const command = await prisma.command.deleteMany({
        where: {
          id: id,
        },
      });

      //Retourner la réponse
      res.status(200).json({
        message: "Command supprimé",
        command: command,
        product: orders_Products,
      });
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Créer la réponse
      let error: DbResult = {
        code: 500,
        message: "An error has occured",
      };

      //Retourner la réponse
      res.status(500).send("An error has occured");
    }
  }
);

//Exporter le router
export default router;
