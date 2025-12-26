require('dotenv').config()
const express = require("express")
const path = require("path")
const app = express();
const PORT = process.env.PORT || 8000;
const userRoute = require("./routes/user")
const blogRouter = require("./routes/blog")
const cookieParse = require("cookie-parser")
const mongoose = require("mongoose");
const Blog = require("./models/blog")
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

mongoose.connect(process.env.MONGO_URL).then(() => console.log("mongo conncected"))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParse());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")));
app.use(express.static(path.resolve("./public"))) // means publiic folder ke andar jo b hai use statically serve kar do. Express by default esa nahi karti


app.set("view engine", "ejs");
app.set("views" , path.resolve("./views"))
app.get("/", async (req, res) => {
    // task 1 : isko sort kar lena
    const allBlogs = await Blog.find({})
    
    res.render("home", {
        user : req.user,
        blogs : allBlogs
    })
})


app.use("/user", userRoute);
app.use("/blog", blogRouter)


app.listen(PORT, ()=> console.log(`server started at PORT :  ${PORT}` ))