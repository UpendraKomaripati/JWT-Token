const express = require("express");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv")

const app = express();
app.use(express.json());
dotEnv.config();

const secretKey = process.env.mySecretKey;

const users = [
    { id: "1", username: "Upendra", password: "Upendra1218", isAdmin: true },
    { id: "2", username: "Ramesh", password: "Ramesh1218", isAdmin: false }
];

const verifyUser = (req, res, next) => {
    const userToken = req.headers.authorization
    if (userToken) {
        const token = userToken.split(" ")[1]
        jwt.verify(token, "MyNameisUpendra", (error, person) => {
            if (error) {
               return res.status(401).json({ message: "Token is not valid" })
            }
            req.person = person
            next()
        })

    }
    else {
         return res.status(401).json({ message: "User not authintucated" })
    }
}

app.post("/app/login", (req, res) => {
    try {
        const { username, password } = req.body;

        const person = users.find((person) => {
            return person.username === username && person.password === password

        })
        if (person) {
            const accessToken = jwt.sign(
                { id: person.id, isAdmin: person.isAdmin, username: person.username },
                "MyNameisUpendra"
            );
            return res.json({
                username: person.username,
                isAdmin: person.isAdmin,
                password: person.password,
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

app.delete("/api/users/:personId", verifyUser, (req, res) => {
    if (req.person.id === req.params.personId || req.person.isAdmin) {
        res.status(201).json({ message: "user is deleted Successfully" })
    } else {
        res.status(401).json("you are not alloow to delte")
    }


})

app.listen(1212, () => {
    console.log("Server is started");
});
