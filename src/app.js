const express = require("express");
const jwt = require("jsonwebtoken");
const dotEnv=require("dotenv")

const app = express();
app.use(express.json());
dotEnv.config();

const secretKey = process.env.mySecretKey;

const users = [
    { id: "1", username: "Upendra", password: "Upendra1218", isAdmin: true },
    { id: "2", username: "Ramesh", password: "Ramesh1218", isAdmin: false }
];

app.post("/app/login", (req, res) => {
    try {
        const { username, password } = req.body;

        const person = users.find((person) => {
            return person.username === username && person.password === password

        })
        if (person) {
            const accessToken = jwt.sign(
                { id: person.id, isAdmin: person.isAdmin ,username:person.username},
               "MyNameisUpendra"
            );
            return res.json({
                username: person.username,
                isAdmin: person.isAdmin,
                password:person.password,
                accessToken,
            });
        } else {
            console.error("Invalid credentials");
            return res.status(400).json({ message: "User credentials do not match" });
        }
    }
    catch (error) {
        console.log("error", error)
    }

});

app.listen(1212, () => {
    console.log("Server is started");
});
