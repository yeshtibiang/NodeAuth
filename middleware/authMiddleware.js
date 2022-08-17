const jwt = require('jsonwebtoken');

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

//on a créer la fonction qu'on peut mettre devant toutes les routes qui ont besoin d'une authentification 
module.exports = {requireAuth};