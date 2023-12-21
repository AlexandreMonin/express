import express from 'express';

//Définir l'application
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.status(200).send('Bienvenue !');
});

//Démarrer l'application
app.listen(port, () => {
    console.log("Server is succesfully running");
})