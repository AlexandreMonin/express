import express, { Router, Request } from "express";
import User from "../class/user";
import bcrypt from "bcrypt";
import DbResult from "../type/DbResult";

//Définir le router
const router: Router = express.Router();

//Récupérer un utilisateur grâce à son mail
router.get("/:email", (req: Request<{ email: String }>, res) => {
  const { email } = req.params;
});

//Créer un utilisateur
router.post("/signup", async (req, res) => {
  //Définir l'utilisateur à partir du body
  const user: User = new User(req.body);

  console.log(user);

  //Ajouter l'utilisateur en base de données
  try {
    //Ajouter l'utilisateur en base
    const result: DbResult = await user.AddToDb();

    console.log(result.user);
    //Renvoyer la réponse
    result.user
      ? res.status(result.code).json({ "User created": result.user })
      : res.status(result.code).send(result.message);
  } catch (e: any) {
    //Log l'erreur
    console.error(e);

    //Retourner l'erreur
    res.status(500).send("Error while adding user");
  }
});

//Authentifier un utlisateur
router.post("/signin", async (req, res) => {
  const auth: User = new User(req.body);

  //Rechercher l'utilisateur
  const findInDb: DbResult = await auth.FindByEmail();

  //Si l'utilisateur existe
  if (findInDb.user) {
    const user: User = new User(findInDb.user);

    const isPasswordSame: boolean = await bcrypt.compare(
      auth.password.toString(),
      user.password.toString()
    );

    if (!isPasswordSame) {
      res.status(401).send("Mail or password invalid");
    } else {
        
    }
  } else {
    res.status(401).send("Mail or password invalid");
  }

  console.log(findInDb.user);
  res.send(findInDb.user);
});

//Modifier un utilisateur
router.put("/:email", (req: Request<{ email: String }>, res) => {
  const { email } = req.params;
});

//Supprimer un utilisateur
router.delete("/:email", (req: Request<{ email: String }>, res) => {
  const { email } = req.params;
});

//Exporter le router
export default router;
