function adminMiddleware(req, res, next) {
    if(req.user&&req.user.role === 'admin') {
        next();
    }else{
        res.status(403).send({message:'You do not have permission to perform this action.'});
    }
}

module.exports = adminMiddleware;