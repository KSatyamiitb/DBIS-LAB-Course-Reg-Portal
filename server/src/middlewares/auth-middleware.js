// const passport = require('passport')

// exports.userAuth = passport.authenticate('jwt', { session: false })

exports.auth = function(req,res,next){
    req.user = { id : req.session.user_id }
    if (!req.session.loggedin){
        //console.log('unauthorized')
        //return res.redirect("/login");
        return res.send("not authorized")
    } else{
        return next();
    }
};

exports.auth_login = function(req,res,next){
    if (req.session.loggedin){
        //console.log('unauthorized')
        //return res.redirect("/login");
        return res.send("already logged in")
    } else{
        return next();
    }
};
