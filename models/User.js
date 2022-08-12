const mongoose = require('mongoose');
// validator contient un nombre de fonction qui permettent de valider les donnees
const {isEmail} = require('validator');


// pour avoir des erreurs et messages appropié pour chaque attribut la valeur de required sera un tableau 
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'SVP entrez un email'],
        unique: true,
        lowercase: true,
        // pour le email on autra d'une propriété validate qui est un tableau le premier element est une fonction
        // val est la value de l'email
        // pour valider on peut utiliser les expressions regulière ou des packages qui gèrent cela
        validate: [isEmail, 'SVP entrez un email valide']
    },
    password: {
        type: String,
        required: [true, 'SVP entrez un mot de passe'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    },
})

const User = mongoose.model('user', userSchema);

module.exports = User;