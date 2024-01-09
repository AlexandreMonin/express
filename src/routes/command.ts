import express, { Router, Request, Response } from "express";
import isManager from "../middlewares/isManager";
import isAdmin from "../middlewares/isAdmin";
import Command from "../class/command";
import DbResult from "../type/DbResult";
import User from "../class/user";
import Orders_Products from "../class/orders_products";
import prisma from "../utils/database";
import isAdminOrManager from "../middlewares/isAdminOrManager";
import passport from "passport";

//Définir le router
const router: Router = express.Router();

//Récupérer une commande grâce à son id
router.get(
  "/:id",
  isAdminOrManager,
  async (req: Request<{ id: string }>, res: Response) => {
    const id: number = parseInt(req.params.id);

    try {
      const command = await prisma.command.findUnique({
        where: {
          id: id,
        },
        include: {
          Orders_Products: {
            include: {
              product: true
            }
          }
        }
      });

      //Retourner la réponse
      res.status(200).json({
        command: command,
      });
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner la réponse
      res.status(500).send("An error has occured");
    }
  }
);

//Créer une commande
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    const user: User = req.user as User;

    try {
      //Créer la commande
      const command = await prisma.command.create({
        data: {
          commandNumber: `CMD${Math.floor(Math.random() * 10000)}`,
          userId: user.id,
        },
      });

      //Retourner la réponse
      res.status(201).json({
        message: "Command created, don't forget your command number !",
        command: command,
      });
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner la réponse
      res.status(500).send("An error has occured");
    }
  }
);

//Ajouter des produits à une commande
router.post(
  "/addProduct",
  passport.authenticate("jwt", { session: false }),
  async (req: Request<{}, {}, Orders_Products>, res: Response) => {
    const orders_Products: Orders_Products = req.body;

    try {
      //Créer la commande
      const order = await prisma.orders_Products.upsert({
        where: {
          commandId_productId: {
            commandId: orders_Products.commandId,
            productId: orders_Products.productId,
          },
        },
        update: {
          quantity: orders_Products.quantity,
        },
        create: {
          commandId: orders_Products.commandId,
          productId: orders_Products.productId,
          quantity: orders_Products.quantity,
        },
      });

      //Retourner la réponse
      res.status(201).json({
        message: "Added to the command",
        order: order,
      });
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner la réponse
      if (e.code == 'P2003') {
        res.status(500).send("The product or the command doesn't exist");
      } else {
        res.status(500).send("An error has occured");
      }

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

      const orders = await prisma.orders_Products.deleteMany({
        where: {
          commandId: id
        }
      });

      const command = await prisma.command.deleteMany({
        where: {
          id: id
        },
      });

      //Retourner la réponse
      if (command.count == 0) {
        res.status(404).send("Command not found");
      } else {
        res.status(200).send("Command deleted");
      }
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner la réponse
      if (e.code == 'P2025') {
        res.status(404).send("Command not found");
      } else {
        res.status(500).send("An error has occured");
      }
    }
  }
);

//Exporter le router
export default router;
