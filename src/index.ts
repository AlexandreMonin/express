import express from 'express';
import userRouter from './routes/user';
import commandRouter from './routes/command';
import productRouter from './routes/product';

//Définir l'application
const app = express();
const port = 3000;

//Parser automatiquement les body entrant en json
app.use(express.json());

//Définir les routes
app.get("/", (req, res) => {
    res.status(200).send('Bienvenue !');
});

//Utiliser les routes définies dans les router
app.use("/users", userRouter);
app.use("/commands", commandRouter);
app.use("/products", productRouter);

//Démarrer l'application
app.listen(port, () => {
    console.log("Server is succesfully running");
})