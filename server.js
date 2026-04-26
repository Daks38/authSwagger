const express = require("express");
const { swaggerUi, swaggerSpec } = require("./swagger");
require("dotenv").config();
const router = require("./routes/usersRouter");
const authToken = require("./middleware/Auth");
const loginRouter = require("./routes/loginRouter");
const registerRouter = require("./routes/registerRouter");
const cors = require('cors')
const connectDB = require("./configs/db");
const port = process.env.PORT;

const app = express();
connectDB();
app.use(cors())
app.use(express.json());



app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API de gestion des utilisateurs. Voir la documentation Swagger à /api-docs");
});
app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerSpec))
//Routes
//Register
app.use("/register", registerRouter)

//Login
app.use("/login", loginRouter)

//User
app.use("/users", authToken, router)

app.listen(port, () => {
  // console.log(`Serveur lancé sur le https://authback-six.vercel.app`);
  console.log(`Serveur lancé sur le http://localhost:3000`);
});