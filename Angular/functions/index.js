const functions = require('firebase-functions');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const configMensaje = require('./configMensaje');
const app = express();

app.use(bodyParser.json());
app.use(cors())

app.post('/formulario', (req, res) => {
  configMensaje(req.body);
  res.status(200).send();
 })

app.get('/peli', (request, response) => {
    response.send("Entraste al lado peligroso de la página >:)");
})



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.app = functions.https.onRequest(app);

//API NodeJS creada por nosotros