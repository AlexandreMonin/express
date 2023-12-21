import express, { Router, Request } from 'express';

//Définir le router
const router: Router = express.Router();

//Récupérer une commande grâce à son id
router.get("/:id", (req: Request<{id: Number}>, res) => {
    const { id }  = req.params;

});

//Créer une commande
router.post("/add", (req, res) => {

});

//Modifier une commande
router.put("/:id", (req: Request<{id: Number}>, res) => {
    const { id }  = req.params;
    
});

//Supprimer une commande
router.delete("/:id", (req: Request<{id: Number}>, res) => {
    const { id }  = req.params;
    
});

//Exporter le router
export default router;