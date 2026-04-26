const authIsadmin = (req, res, next)=>{
    if(req.user.isAdmin === "user"){
        res.status(403).json({error: "Accès reservé aux admins"})
    }
    next()
}
module.exports = authIsadmin