import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import DbResult from "../type/DbResult";
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

//Récupérer un utilisateur grâce à son mail
// router.get(
//   "/:email",
//   passport.authenticate("jwt", { session: false }),
//   isAdmin,
//   async (req: Request<{ email: string }>, res: Response) => {
//     const { email }: { email: string } = req.params;
//     try {
//       const user = await prisma.user.findUnique({
//         where: {
//           email: email,
//         },
//       });

//       //Retourner la réponse
//       res.status(201).json({
//         message: "user",
//         user: user,
//       });
//     } catch (e: any) {
//       //Log l'erreur
//       console.error(e);

//       //Créer la réponse
//       let error: DbResult = {
//         code: 500,
//         message: "An error has occured",
//       };

//       //Retourner la réponse
//       res.status(500).send("An error has occured");
//     }
//   }
// );

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

// //Modifier un utilisateur
// router.patch(
//   "/:email",
//   passport.authenticate("jwt", { session: false }),
//   isAdmin,
//   async (req: Request<{ email: string }, {}, User>, res) => {
//     const { email }: { email: string } = req.params;
//     const newUser: User = req.body;

//     //Créer le produit
//     const user: User = new User({
//       id: 0,
//       email: email,
//       firstName: "",
//       lastName: "",
//       password: "",
//       role: 0,
//     });

//     try {
//       //Chercher le produit
//       const result: DbResult = await user.Update(newUser);

//       //Renvoyer la réponse
//       result.user
//         ? res.status(result.code).json({ "User updated": result.user })
//         : res.status(result.code).send(result.message);
//     } catch (e: any) {
//       //Log l'erreur
//       console.error(e);

//       //Retourner l'erreur
//       res.status(500).send("Error while updating user");
//     }
//   }
// );

// //Supprimer un utilisateur
// router.delete(
//   "/:email",
//   passport.authenticate("jwt", { session: false }),
//   isAdmin,
//   async (req: Request<{ email: string }, {}, User>, res) => {
//     const { email }: { email: string } = req.params;
//     const newUser: User = req.body;

//     //Créer le produit
//     const user: User = new User({
//       id: 0,
//       email: email,
//       firstName: "",
//       lastName: "",
//       password: "",
//       role: 0,
//     });

//     try {
//       //Chercher le produit
//       const result: DbResult = await user.Delete();

//       //Renvoyer la réponse
//       result.user
//         ? res.status(result.code).json({ "User deleted": result.user })
//         : res.status(result.code).send(result.message);
//     } catch (e: any) {
//       //Log l'erreur
//       console.error(e);

//       //Retourner l'erreur
//       res.status(500).send("Error while adding product");
//     }
//   }
// );

//Exporter le router
export default router;
