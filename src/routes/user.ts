import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import isAdmin from "../middlewares/isAdmin";
import prisma from "../utils/database";
import User from "../type/User";

//Définir le router
const router: Router = express.Router();

//Récupérer tous les utilisateurs
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany();

      //Retourner la réponse
      if (!users) {
        res.status(404).send("No users found");
      } else {
        res.status(200).json({
          users: users,
        });
      }
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner la réponse
      res.status(500).send("An error has occured");
    }
  }
);

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
      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.status(200).json({
          user: user,
        });
      }

    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner la réponse
      res.status(500).send("An error has occured");
    }
  }
);

//Créer un utilisateur
router.post(
  "/signup",
  async (req: Request<{}, {}, User>, res: Response) => {
    //Définir l'utilisateur à partir du body
    const user: User = req.body;

    //Ajouter l'utilisateur en base de données
    try {
      //Crypter le mot de passe
      const encryptedPassword: string = await bcrypt.hash(
        user.password.toString(),
        15
      );
      //Ajouter l'utilisateur en base
      const dbSave = await prisma.user.create({
        data: {
          lastName: user.lastName.toString(),
          firstName: user.firstName.toString(),
          email: user.email.toString(),
          password: encryptedPassword,
          role: parseInt(user.role.toString()),
        },
      });
      //Renvoyer la réponse
      res.status(201).json({ user: dbSave })
    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner l'erreur
      if (e.code == "P2002") {
        res.status(409).send("Mail already existing");
      } else {
        res.status(500).send("Error while adding user");
      }
    }
  }
);

//Authentifier un utlisateur
router.post("/signin", async (req: Request<{}, {}, User>, res: Response) => {
  const auth: User = req.body;

  try {
    //Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: {
        email: auth.email.toString(),
      },
    });

    //Si l'utilisateur existe
    if (!user) {
      res.status(404).send("error: Mail ou mot de passe incorect");
    } else {
      const isPasswordSame: boolean = await bcrypt.compare(
        auth.password.toString(),
        user.password.toString()
      );

      if (!isPasswordSame) {
        res.status(404).send("error: Mail ou mot de passe incorect");
      } else {
        const token = jwt.sign({ user }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });
        res.status(200).json({ email: user.email, token: token });
      }
    }
  } catch (e: any) {
    console.log(e);

    res.status(500).send("An error has occured");
  }
});

//Modifier un utilisateur
router.patch(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req: Request<{}, {}, User>, res) => {
    const newUser: User = req.body;
    let encryptedPassword: string | undefined = undefined;

    try {
      if(newUser.password){
        encryptedPassword = await bcrypt.hash(
          newUser.password.toString(),
          15
        );
      }
      
      const user = await prisma.user.update({
        where: {
          email: newUser.email.toString(),
        },
        data: {
          email: newUser.email?.toString(),
          lastName: newUser.lastName?.toString(),
          firstName: newUser.firstName?.toString(),
          password: encryptedPassword,
        },
      });

      //Renvoyer la réponse
      res.status(201).json({ "User updated": user })
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

    try {
      const user = await prisma.user.delete({
        where: {
          email: email,
        },
      });

      res.status(200).json({ "User deleted": user })

    } catch (e: any) {
      //Log l'erreur
      console.error(e);

      //Retourner l'erreur
      if(e.code == 'P2025'){
        res.status(404).send("Error while deleting user: it doesn't exist");
      } else {
        res.status(500).send("Error while deleting user");
      }
    }
  }
);

//Exporter le router
export default router;
