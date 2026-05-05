const express = require("express")
const User = require("../models/userRegister")
const bcrypt  = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY
const router = express.Router()

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connecte un utilisateur
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: dodo@email.com
 *               password:
 *                 type: string
 *                 example: 12345
 *     responses: 
 *       200:
 *         description: Utilisateur connecté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Identifiants invalides
 */


router.post("/", async (req, res) => {
  const { email,password } = req.body;
  if (!email) {
    return res.status(400).json({msg: "Champ email est vide"})
    
  }if (!password) {
    return res.status(400).json({msg: "Champ mot de passe est vide"})
    
  }
  const verifEmail  = await User.findOne({email});
  if (!verifEmail) {
    return res.status(400).json({msg: "Mot de passe ou email incorect"})
  }
      const isPassword = await bcrypt.compare(password, verifEmail.password)
  if (!isPassword) {
    return res.status(400).json({msg: "Mot de passe ou email incorect"})
      }
     const payload = {
      isAdmin: verifEmail.isAdmin,
      id: verifEmail.id,
      name: verifEmail.name,
      username: verifEmail.username,
      number: verifEmail.number,
      email: verifEmail.email
     }
     const userInfos = {
      isAdmin: verifEmail.isAdmin,
      id: verifEmail.id,
      isAdmin: verifEmail.isAdmin,
      name: verifEmail.name,
      username: verifEmail.username,
      email: verifEmail.email
     }
    //  const secretKey = "a"
     jwt.sign( payload, secretKey,{expiresIn: 3600}, (err, token)=>{
      if (err) {
    return res.status(400).json(err.message)
        
      } else { 
        
        return res.status(201).json( {users: userInfos, token: token,msg:"Vous êtes connecté avec succès"});
      
      }
     })

});






module.exports = router 