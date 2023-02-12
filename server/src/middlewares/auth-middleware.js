
exports.auth = function(req,res,next){
    req.user = { id : req.session.user_id }
    if (!req.session.loggedin){
        return res.send("not authorized")
    } else{
        return next();
    }
};

exports.auth_login = function(req,res,next){
    if (req.session.loggedin){
        return res.send("already logged in")
    } else{
        return next();
    }
};
