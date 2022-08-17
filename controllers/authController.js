const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleError = (err) => {
    console.log(err.message, err.code)
    let errors = {
        email: '',
        password: ''
    }

    // email incorrect
    if (err.message === 'email incorrect'){
        errors.email = 'ce email n\'existe pas';
    }
    
    // password incorrect
    if (err.message === 'mot de passe incorrect'){
        errors.password = 'mot de passe incorrect';
    }

    // duplicate error code
    if (err.code == 11000) {
        errors.email = 'Email already exists';
        return errors;
    }

    // console.log(err.message, err.code); nous permet de voir les erreurs dans la console et les debogger.
    // on remarque que l'on a user validation failed à chaque fois qu'il y'a des erreurs, donc ce que l'on va faire
    // c'est de verifier la presence de cela dans le message d'erreur
    // dans error object on voit une autre propriété appelé errors
    // on a d'autres propriétés tel que properties un object assez important. 
    // on veut donc acceder à la propriété errors de l'object error
    // la propriété path permet de dire quel propriété on veut update
    // object.values() nous permet d'avoir les valeurs de l'object
    // maintenant qu'on a les valeurs on peut passer à travaers chaque propriété et prendre les valeur que l'on souhaite.
    // on aura besoin de la propriété properties. errors.properties
    // {properties} permet de destructurer l'objet error et donc  
    if (err.message.includes('user validation failed')){
        // on destruture error pour avoir les properties
        Object.values(err.errors).forEach(({properties}) => {
            // on va mettre a jour notre variable error
            errors[properties.path] = properties.message;
        })
    } 

    return errors;

}

const maxAge = 3 * 24 * 60 * 60;
// foncion pour creer le jwt token
const createToken = (id) => {
    // on passe en premier argument le payload ici l'id de l'utilisateur
    // le second argument est le secret, on ne le publie pas dans un repo public
    return jwt.sign({id}, 'net yeshua secret', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

// on utilise async pour gerer les promises et await pour attendre la fin de la fonction
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    // on veut créer un nouvel utilisateur
    try {
        // on crée un nouvel utilisateur
        const user = await User.create({ email, password });
        // on utilise la fonction createToken ici 
        const token = createToken(user._id);
        // on va placer le token dans un cookie et l'envoyer comme partie de la reponse
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        // on renvoie la reponse ici à postman
        res.status(201).json({user: user._id});
    } catch (error) {
        const errors = handleError(error);
        // on renvoie les erreurs à postman via json
        res.status(400).json({errors});
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    // ce qu'on veut faire ici c'est prendre email et password et essayer de logger le user 
    // et ensuite créer le json webtoken  
    // on va créer une méthode static sur notre model pour se connecter 
    // on a besoin de créer le jwt si email et password match avec un user et mieux gérer les erreurs 
    // on crée le token comme on l'a fait pour le signup
    try {
        // on va essayer de se connecter 
        const user = await User.login(email, password);
        const token = createToken(user._id);
        // on va placer le token dans un cookie et l'envoyer comme partie de la reponse
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        // si le user est trouvé ici on renvoie le user
        res.status(200).json({user: user._id});
    }
    catch(err){
        const errors = handleError(err);
        res.status(400).json({errors})
    }
}