const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const config = require('./../config/database');

module.exports = (router) => {

    router.post('/register', (req, res) => {
        if(!req.body.email) {
            res.json({success: false, message: 'you must provide email.'})
        } else {
            if(!req.body.username){
                res.json({success: false, message: 'you must provide username'})
            } else {
                if(!req.body.password){
                    res.json({success: false, message: 'you must provide password'})
                } else{
                    // console.log(req.body);
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });
                    user.save(err => {
                        
                        if(err) {
                            // error for username or email exist
                            if(err.code === 11000) {
                                res.json({success: false, message: 'Username or E-Mail already exist.'})
                            } else {
                                // validator errors
                                if(err.errors) {
                                    // custom errors
                                    if(err.errors.email) {
                                        res.json({success: false, message: err.errors.email.message})
                                    } else if(err.errors.username) {
                                        res.json({success: false, message: err.errors.username.message}) 
                                    } else if(err.errors.password){
                                        res.json({success: false, message: err.errors.password.message})
                                    } else {
                                        res.json({success: false, message: err})
                                    }
                                } else { // errors
                                    res.json({
                                        success: false,
                                        message: 'user could not registered.',
                                        error: err
                                    })
                                }
                            }  
                        } else { 
                            res.json({
                                success: true,
                                message: 'user created.'
                            })
                        }
                    });
                    // user.save()
                    // .then(result => {
                    //     res.json({
                    //         success: true,
                    //         message: 'user created.',
                    //         user: result
                    //     });
                    // })
                    // .catch(err => {
                    //     res.json({
                    //         success: false,
                    //         message: 'user could not registered.',
                    //         error: err
                    //     })
                    // })
                    // res.send('hellow yaar');
                }
            }
        }
    });
    

    // ----------------------------------
    // Route to check for user E-Mail is available for registration
    //  --------------------------------------------
    router.get('/checkEmail/:email', (req, res) => {
        const email = req.params.email;

        if(email) {
            User.findOne({email: email}, (err, data) => {
                if(err) {
                    res.json({
                        success: false,
                        message: err
                    })
                } else {
                    if(data) {
                        res.json({
                            success: false,
                            message: 'E-Mail already taken.'
                        })
                    } else {
                        res.json({
                            success: true,
                            message: 'ok'
                        })
                    }
                }
            })
        } else {
            res.json({
                success: false,
                error: 'E-Mail was not provided.'
            })
        } 
    })


    // ----------------------------------
    // Route to check for user Username is available for registration
    //  --------------------------------------------
    router.get('/checkUsername/:username', (req, res) => {
        const uname = req.params.username;

        if(uname) {
            User.findOne({username: uname}, (err, data) => {
                if(err) {
                    res.json({
                        success: false,
                        message: err
                    })
                } else {
                    if(data) {
                        res.json({
                            success: false,
                            message: 'Username already taken.'
                        })
                    } else {
                        res.json({
                            success: true,
                            message: 'ok'
                        })
                    }
                }
            })
        } else {
            res.json({
                success: false,
                error: 'Username was not provided.'
            })
        } 
    })



    // ************ user login ***************
    router.post('/login', (req, res) => {
        const uname = req.body.username;
        const pass = req.body.password;
        if(!uname) {
            res.json({
                success: false,
                message: 'Username was not provided.'
            })
        } else if (!pass) {
            res.json({
                success: false,
                message: 'Password was not provided.'
            })
        } else {
            User.findOne({username: uname.toLowerCase()}, (err, data) => {
                if(err) {
                    res.json({
                        success: false,
                        message: 'Authentication Failed.',
                        error: err
                    })
                } else if(!data) {
                    res.json({
                        success: false,
                        message: 'Invalid username.'
                    })
                } else {
                    
                    const passVarify = data.comparePassword(pass);
                    
                    if(passVarify) {
                        const token = jwt.sign({userId: data._id}, config.secret, {expiresIn: '24h'});
                        res.json({
                            success: true,
                            message: 'Success!',
                            token: token,
                            user: data.username
                        })
                    } else {
                        res.json({
                            success: false,
                            message: 'Invalid password.'
                        })
                    }
                }
            })
        }
    })




    return router;
}