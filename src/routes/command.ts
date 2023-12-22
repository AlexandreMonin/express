import express, { Router, Request, Response } from "express";
import isManager from "../middlewares/isManager";
import isAdmin from "../middlewares/isAdmin";
import Command from "../class/command";
import DbResult from "../type/DbResult";
import User from "../class/user";
import Orders_Products from "../class/orders_products";
import prisma from "../utils/database";

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

      await products.forEach(async element => {
        const product = await prisma.orders_Products.create({
          data: {
            productId: element.productId,
            commandId: command.id,
            quantity: element.quantity
          },
        });
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
router.put(
  "/:id",
  isManager || isAdmin,
  (req: Request<{ id: string }>, res: Response) => {
    const id: number = parseInt(req.params.id);
  }
);

//Supprimer une commande
router.delete(
  "/:id",
  isManager || isAdmin,
  (req: Request<{ id: string }>, res: Response) => {
    const id: number = parseInt(req.params.id);
  }
);

//Exporter le router
export default router;
