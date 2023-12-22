import express, { Router, Request } from "express";
import Product from "../class/product";
import DbResult from "../type/DbResult";

//Définir le router
const router: Router = express.Router();

//Récupérer un produit grâce à son id
router.get("/:id", (req: Request<{ id: Number }>, res) => {
  const { id } = req.params;
});

//Créer un produit
router.post("/add", async (req, res) => {
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
router.put("/:id", (req: Request<{ id: Number }>, res) => {
  const { id } = req.params;
});

//Supprimer un produit
router.delete("/:id", (req: Request<{ id: Number }>, res) => {
  const { id } = req.params;
});

//Exporter le router
export default router;
