const User = require('../models/User');

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
        // on renvoie la reponse ici à postman
        res.status(201).json(user);
    } catch (error) {
        console.log(error)
        res.status(400).send('error, user not created');
    }
}

module.exports.login_post = async (req, res) => {
    console.log(req.body)
    res.send('user login')
}