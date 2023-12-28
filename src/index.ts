import express from "express";
import userRouter from "./routes/user";
import commandRouter from "./routes/command";
import productRouter from "./routes/product";
import prisma from "./utils/database";
import "dotenv/config";
import "./utils/passport";
import passport from "passport";

async function main() {
  //Définir l'application
  const app = express();
  const port = 3000;

  //Parser automatiquement les body entrant en json
  app.use(express.json());

  app.use(passport.initialize());

  //Définir les routes
  app.get("/", (req, res) => {
    res.status(200).send("Bienvenue !");
  });

  //Utiliser les routes définies dans les router

  app.use("/users", userRouter);
  app.use("/commands", passport.authenticate("jwt", {session: false}), commandRouter);
  app.use("/products", productRouter);

  //Démarrer l'application
  app.listen(port, () => {
    console.log("Server is succesfully running");
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
