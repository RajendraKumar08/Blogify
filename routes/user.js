const { Router } = require("express")
const User = require("../models/user")
const { createTokenForUser } = require("../services/authentication");
const router = Router();

router.get("/signIn", (req, res) => {
    res.render("signIn")
})

router.get("/signUp", (req, res) => {
    res.render("signUp");
})

router.post("/signIn", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);

        return res.cookie("token", token).redirect("/")
    } catch (error) {
        return res.render("signIn", {
            error : "Incorrect Email or Password"
        })
    }
})

router.post("/signUp", async (req, res) => {
    const { fullName, email, password } = req.body;
    const user = await User.create({
        fullName,
        email,
        password
    });
    const token = createTokenForUser(user);
    return res.cookie("token", token).redirect("/");
})

router.get("/logout", async (req, res) => {
    res.clearCookie("token").redirect('/')
})

module.exports = router; 