const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// email length checker funtion
let emailLengthChecker = (email) => {
    // check if email exist
    if(!email) {
        return false; // return error
    } else {
        // check the length of e-mail string
        if(email.length < 5 || email.length > 30) {
            return false; // return error
        } else {
            return true;  // return as a valid email
        }
    }
}


// validat function to check if email format valid
let validEmailChecker = (email) => {
    // check if email exist
    if(!email) {
        return false;
    } else {
        // regular expression for check email valid
        let regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);  // Return regular expression test result (true or false)
    }
}

// array of e-mail validator
const emailValidators = [
    // email length checker validator
    {
        validator: emailLengthChecker, 
        message: 'E-Mail must be at least 5 characters but not more than 30'
    },
    // valid email checker
    {
        validator: validEmailChecker,
        message: 'must be a valid e-mail'
    }
];

// username length checker fuction
let usernameLengthChecker = (username) => {
    // check if user name exist
    if(!username) {
        return false;   //  Return error
    } else {
        // check username string length must be between 3 to 15
        if(username.length < 3 || username > 15){
            return false;   //  Return error
        } else {
            return true;    //  Return as a valid username
        }
    }
}


// valid username format checker
let validUsernameChecker = (username) => {
    // check if username exist
    if(!username) {
        return false;   //  Return error
    } else { 
        let regExp = new RegExp(/^[a-zA-Z0-9]+$/);   // [a-zA-Z0-9]+$
        return regExp.test(username);   //  Return regExp test result (true or false)
    }
}

// array of username validators
const usernameValidators = [
    {
        validator: usernameLengthChecker,
        message: 'username must be at least 5 charecters but not more than 30'
    },
    {
        validator: validUsernameChecker,
        message: 'username must not have any special charecters'
    }
];


// valid password to check password length
let passwordLengthChecker = (password) => {
    // check if password exist
    if(!password){
        return false;   //  Return error
    } else {
        // check password string length must be between 8 to 35
        if(password.length < 8 || password.length > 35){
            return false;   //  Return error
        } else {
            return true;    //  Return password as valid
        }
    }
}


// validate function to check password be in valid format
let validPassword = (password) => {
    // check if password exist
    if(!password){
        return false;   //  Return error
    } else {
        let regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);   //  return regExp test result (true or false)
    }
}

// array of password validators
const passwordValidators = [
    {
        validator: passwordLengthChecker,
        message: 'password must be at least 8 characters but not more 35'
    },
    {
        validator: validPassword,
        message: 'Must have at least one uppercase, lowercase, special character and number'
    }
]

// mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
    username: {type: String, required: true, unique: true, lowercase: true, validate: usernameValidators},
    password: {type: String, required: true, validate: passwordValidators}
})

userSchema.pre('save', function(next) {
    if(!this.isModified('password'))
        return next();

    bcrypt.hash(this.password, null, null, (err, hash) => {
        if(err)
            return next(err);
        this.password = hash;
        next();
    })
})

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema)
