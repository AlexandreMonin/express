import express, { Router, Request } from 'express';

//Définir le router
const router: Router = express.Router();

//Récupérer un utilisateur grâce à son mail
router.get("/:email", (req: Request<{email: String}>, res) => {
    const { email }  = req.params;

});

//Créer un utilisateur
router.post("/add", (req, res) => {

});

//Modifier un utilisateur
router.put("/:email", (req: Request<{email: String}>, res) => {
    const { email }  = req.params;

});

//Supprimer un utilisateur
router.delete("/:email", (req: Request<{email: String}>, res) => {
    const { email }  = req.params;

});


//Exporter le router
export default router;