const express = require("express");
const bodyParser = require("body-parser")
const cors = require("cors");
const jwt = require("jsonwebtoken")

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

app.post("/login", (req, res) => {
    const { email } = req.body

    if (email !== "admin") {
        return res.status(400).json({
            message: "Email is Wrong"
        })
    }

    const secretKey = "abc123"

    const payloads = {
        email: email,
        exp: Math.floor(Date.now() / 1000) + 60
    }

    const token = jwt.sign(payloads, secretKey)

    return res.status(200).json({
        email: email,
        token: token,
        message: "Email True",
    })
})

const verifyToken = (req, res, next) => {
    try {
        const secretKey = "abc123"

        const token = req.headers.authorization.split(" ")[1];

        console.log(token)

        if (!token) {
            return res.status(400).json({
                message: "Geçersiz Token ve ya Süresi Geçmiş Token ya da geçersiz imza",
            })
        }

        jwt.verify(token, secretKey, algorithms = ['HS256'])
        
        next()
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }

}

app.get("/auth", verifyToken, (req, res) => {
    return res.status(200).json({
        message: "Authentication Successful"
    })
})

app.listen(5000, () => {
    console.log("Server Listening")
})



