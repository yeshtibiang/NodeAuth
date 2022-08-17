const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth} = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
// pour parser les donnees json
app.use(express.json());
//pour les cookies 
app.use(cookieParser());
// après avoir fait cela on peut accéder à une cookie methode sur la reponse object

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://nodejsuser:passer123@node-yesh.590lq0u.mongodb.net/node-tuto?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
// on veut faire en sotre que la route /smoothies puisse require une authentification 

app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

// cookies theorie 
//mettre en place un cookie 
// app.get('/set-cookies', (req, res) => {
  // on va utiliser notre cookieParser pour accéder à la cookie
  // on peut passer un troisième argument à cookie pour spécifier différents propriétés
  // maxAge est à un jour, 
  // secure à true veut dire que le cookie va être envoyé seulement si on a un https connection
  // httpOnly à true veut dire que le cookie ne sera pas accessible par les scripts
  // ces deux propriétés sont importantes car en production on veut utiliser les cookies uniquement dans une connexion securisé
  // et on ne veut pas que le client modifie le code. 
  // res.cookie('newUser', false, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true});
  // res.cookie('isEmployee', true)
  //res.setHeader('set-cookie', 'newUser=true')
  // res.send('cookies set')
// })

// on veut lire les cookies on va utiliser la methode req.cookies
// vu que c'est du js on peutt utiliser le . pour accéder aux propriétés
// app.get('/read-cookies', (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies.newUser);

//   res.json(cookies)
// })
