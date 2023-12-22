import express, { Router, Request, Response } from "express";
import isManager from "../middlewares/isManager";
import isAdmin from "../middlewares/isAdmin";

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
router.post("/add", (req, res) => {});

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
