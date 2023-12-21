import express, { Router, Request } from 'express';

//Définir le router
const router: Router = express.Router();

//Récupérer un produit grâce à son id
router.get("/:id", (req: Request<{id: Number}>, res) => {
    const { id }  = req.params;

});

//Créer un produit
router.post("/add", (req, res) => {

});

//Modifier un produit
router.put("/:id", (req: Request<{id: Number}>, res) => {
    const { id }  = req.params;
    
});

//Supprimer un produit
router.delete("/:id", (req: Request<{id: Number}>, res) => {
    const { id }  = req.params;
    
});

//Exporter le router
export default router;