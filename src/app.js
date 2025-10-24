const express = require("express")
const app = express();
app.use(express.json());

const user = [{
    id: "1",
    name: "Upendra",
    password: "Upendra1218",
    isAdmin: true
},
{
    id: "2",
    name: "Ramesh",
    password: "Ramesh1218",
    isAdmin: false
}
]
app.use(express.json())

app.post("/app/login", async (req, res) => {

     const { name, password } = req.body
    try {
        const person = await user.find((person) => {
            return person.name === name && person.password === password
        })
        res.json(person)
    } catch (error) {
        console.log("code will be wrong", error)
        res.status(400).json("user credintals not match",)
    }

})

app.listen(1212, () => {
    console.log('Server is started')
})