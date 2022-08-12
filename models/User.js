const mongoose = require('mongoose');
// validator contient un nombre de fonction qui permettent de valider les donnees
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');


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

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// lancer une fonction après la sauvegarde d'un document.
// post refere à quelque chose qui se passe après une autre chose
// userSchema.post('save', function(doc, next) {
//     console.log('user saved');
     // si next n'est pas mis on risque d'être bloqué à ce niveau
//     next();
// })

// lancer une fonction avant la sauvegarde d'un document.
// userSchema.pre('save', function(next){
     // on utilise function ici au lieu de arrow function car on veut utiliser this
     // et que this pointe vers l'objet user
//     console.log("l'utilisateur est en train d'être sauvegardé");
//     next();
// })


const User = mongoose.model('user', userSchema);

module.exports = User;