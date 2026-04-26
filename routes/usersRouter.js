const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userRegister");
const authIsadmin = require("../middleware/AuthIsadmin");
// require("../middleware/Auth");
const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère tous les utilisateurs
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       401:
 *         description: Token manquant ou invalide
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par son ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur récupéré avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur par son ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       403:
 *         description: Accès non autorisé
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur par son ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crée un utilisateur
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 */



//All Users
router.get("/", authIsadmin, async (req, res) => {
  const users = await User.find();
  res.json({ users });
});
//By User
router.get("/:id", async (req, res) => {
  const users = await User.findById(req.params.id);
  res.json({ users });
});
//Delete User
router.delete("/:id", authIsadmin, async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "Utilisateur supprimé", deletedUser });
});
//Update User
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ msg: "Utilisateur mis à jour", updatedUser });
  } catch (err) {
    res.json(err.message);
  }
});
//Create User
router.post("/create", authIsadmin, async (req, res) => {
   try {
    const { username, email, number, name, password, isAdmin } = req.body;
    const verifEmail = await User.findOne({ email });
    const verifUsername = await User.findOne({ username });
    if (verifEmail) {
      return res.status(400).json({ msg: "Email existe déjà" });
    }

    else if (verifUsername) {
      return res.status(400).json({ msg: "Username déjà utilisé" });
    }
    else if (!name) {
      return res.status(400).json({ msg: "Le champs nom est requis" });
    }
    else if (!username) {
      return res
        .status(400)
        .json({ msg: "Le champs nom d'utilisateur est requis" });
    }
    else if (!email) {
      return res.status(400).json({ msg: "Le champs email est requis" });
    }
    else if (!number) {
      return res
        .status(400)
        .json({ msg: "Le champs numéro de téléphone est requis" });
    }
    else if (!password) {
      return res.status(400).json({ msg: "Le champs mot de passe est requis" });
    }
    else {
      const salt = bcrypt.genSaltSync(10)
      const newUser = new User({  
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        number: req.body.number,
        password: bcrypt.hashSync(req.body.password, salt),
        isAdmin: req.body.isAdmin,
      });
      const saved = await newUser.save();
      const  userInfos = {
      id: saved.id,
      isAdmin: saved.isAdmin,
      name: saved.name,
      username: saved.username,
      email: saved.email
      }
      res.json({ user: userInfos, msg: "Utilisateur créé avec succès" });
    }
  } catch (err) {
    res.json(err.message);
  }
});
//By User
// router.get("/me", async (req, res) => {
//   const user = User.findById(req.user.id)
//   res.json(user)
// //   console.log(req )
// // //  res.json({msg:"dodo"})
// });

module.exports = router;
