const jwt = require('jsonwebtoken');
const User = require('../models/User');

// on crée le middleware fonction
const requireAuth = (req, res, next) => {
    // on va chercher le token dans le header de la requête 
    const token = req.cookies.jwt;

    // on va verifier si le token existe et verifié
    if (token){
        // on va verifier le token 
        jwt.verify(token, 'net yeshua secret', (err, decodedToken) => {
            if (err){
                // s'il y'a une erreur 
                console.log(err.message);
                res.redirect('/login');
            }
            else{
                // si le token est valide on passe au middleware suivant
                console.log(decodedToken);
                next();
            }
        })
    }
    else{
        // rediriger vers le login page
        res.redirect('/login');
    }
}

// pour vérifier l'utilisateur courant 
const checkUser = (req, res, next) => {
    // obtenir le token
    const token = req.cookies.jwt;
    // verifier si le token existe
    if (token){
        jwt.verify(token, 'net yeshua secret', async (err, decodedToken) => {
            if (err){ 
                console.log(err.message);
                // on veut explicitement mettre user à null pour eviter les erreurs
                res.locals.user = null;
                // on veut pas les rediriger mais juste passer 
                next();
            }
            else{
                // on veut obtenir les informations du user 
                // il faut noter que dans le token on a le playload et le playload contient l'id du user. qu'on a pasé à la fonction 
                // lors de la création du token
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                // maintenant qu'on a le user on veut l'injecter dans la vue 
                // on peut utiliser quelque chose appeler locals sur la res
                // on fait res.locals. n'importe quel attrbut que l'on veut injecter à la vue
                res.locals.user = user;
                next();
            }
        })
    }else{
        res.locals.user = null;
        next();
    }
}

//on a créer la fonction qu'on peut mettre devant toutes les routes qui ont besoin d'une authentification 
module.exports = {requireAuth, checkUser};