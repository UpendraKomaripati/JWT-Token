const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const ejs = require("ejs");

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const secretKey = process.env.mySecretKey || "MyNameisUpendra"; // ✅ consistent fallback

const users = [
  { id: "1", username: "Upendra", password: "Upendra1218", isAdmin: true },
  { id: "2", username: "Ramesh", password: "Ramesh1218", isAdmin: false },
];

// ✅ Middleware for verifying JWT token
const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "User not authenticated" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (error, person) => {
    if (error) {
      return res.status(401).json({ message: "Token is not valid" });
    }
    req.person = person;
    next();
  });
};

// ✅ EJS routes
app.get("/upendra", (req, res) => {
  res.render("upendra");
});

app.get("/ramesh", (req, res) => {
  res.render("ramesh");
});

// ✅ Login route
app.post("/api/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const person = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!person) {
      console.error("Invalid credentials");
      return res.status(400).json({ message: "User credentials do not match" });
    }

    const accessToken = jwt.sign(
      { id: person.id, isAdmin: person.isAdmin, username: person.username },
      secretKey,
      { expiresIn: "1h" }
    );

    return res.json({
      username: person.username,
      isAdmin: person.isAdmin,
      accessToken,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Delete route (protected)
app.delete("/api/users/:personId", verifyUser, (req, res) => {
  if (req.person.id === req.params.personId || req.person.isAdmin) {
    return res.status(200).json({ message: "User deleted successfully" });
  } else {
    return res.status(403).json({ message: "You are not allowed to delete" });
  }
});

// ✅ Fixed route parameter name
app.get("/api/login/:userId", (req, res) => {
  const userId = req.params.userId;

  if (userId === "1") {
    return res.redirect("/upendra");
  } else if (userId === "2") {
    return res.redirect("/ramesh");
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

// ✅ Start server
app.listen(1212, () => {
  console.log("Server is started ");
});
// ///////////////////////////////////////////////////////////////////////


//  login logout coode pending 

















