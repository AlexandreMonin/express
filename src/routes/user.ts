import express, { Router, Request, Response } from "express";
import User from "../class/user";
import bcrypt from "bcrypt";
import DbResult from "../type/DbResult";
import jwt from "jsonwebtoken";
import passport from "passport";
import isAdmin from "../middlewares/isAdmin";
import prisma from "../utils/database";

//Définir le router
const router: Router = express.Router();

//Récupérer un utilisateur grâce à son mail
router.get(
  "/:email",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request<{ email: string }>, res: Response) => {
    const { email }: { email: string } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      //Retourner la réponse
      res.status(201).json({
        message: "user",
        user: user,
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
        ? res.status(result.code).json({ user: result.user })
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
router.patch(
  "/:email",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request<{ email: string }, {}, User>, res) => {
    const { email }: { email: string } = req.params;
    const newUser: User = req.body;

    //Créer le produit
    const user: User = new User({
      id: 0,
      email: email,
      firstName: "",
      lastName: "",
      password: "",
      role: 0,
    });

    try {
      //Chercher le produit
      const result: DbResult = await user.Update(newUser);

      //Renvoyer la réponse
      result.user
        ? res.status(result.code).json({ "User updated": result.user })
        : res.status(result.code).send(result.message);
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner l'erreur
      res.status(500).send("Error while updating user");
    }
  }
);

//Supprimer un utilisateur
router.delete(
  "/:email",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request<{ email: string }, {}, User>, res) => {
    const { email }: { email: string } = req.params;
    const newUser: User = req.body;

    //Créer le produit
    const user: User = new User({
      id: 0,
      email: email,
      firstName: "",
      lastName: "",
      password: "",
      role: 0,
    });

    try {
      //Chercher le produit
      const result: DbResult = await user.Delete();

      //Renvoyer la réponse
      result.user
        ? res.status(result.code).json({ "User deleted": result.user })
        : res.status(result.code).send(result.message);
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner l'erreur
      res.status(500).send("Error while adding product");
    }
  }
);

//Exporter le router
export default router;
