import express, { Router, Request, Response } from "express";
import User from "../class/user";
import bcrypt from "bcrypt";
import DbResult from "../type/DbResult";
import jwt from "jsonwebtoken";
import passport from "passport";
import isAdmin from "../middlewares/isAdmin";

//Définir le router
const router: Router = express.Router();

//Récupérer un utilisateur grâce à son mail
router.get(
  "/:email",
  passport.authenticate("jwt", { session: false }),
  (req: Request<{ email: String }>, res) => {
    const { email } = req.params;
  }
);

//Créer un utilisateur
router.post(
  "/signup/:Role",
  async (req: Request<{ Role: number }>, res: Response) => {
    //Définir l'utilisateur à partir du body
    const user: User = new User(req.body);
    const { Role }: { Role: number } = req.params;

    console.log(Role);
    //Ajouter l'utilisateur en base de données
    try {
      let result: DbResult;
      //Ajouter l'utilisateur en base
      result = await user.AddToDb(Role);

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
  }
);

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
      const token = jwt.sign({ user }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      res.status(200).json({ email: user.email, token: token });
    }
  } else {
    res.status(401).send("Mail or password invalid");
  }
});

//Modifier un utilisateur
router.put(
  "/:email",
  isAdmin,
  passport.authenticate("jwt", { session: false }),
  (req: Request<{ email: string }>, res) => {
    const { email } : {email: string} = req.params;
  }
);

//Supprimer un utilisateur
router.delete(
  "/:email",
  isAdmin,
  passport.authenticate("jwt", { session: false }),
  (req: Request<{ email: string }>, res) => {
    const { email } : {email: string} = req.params;
  }
);

//Exporter le router
export default router;
