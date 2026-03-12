require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParse = require("cookie-parser")

const { checkForAuthenticationCookie } = require("./middleware/auth")
const userRoute = require("./routes/user")
const blogRoute = require("./routes/blog");
const commentRoute = require("./routes/comment");
const chatRoute = require('./routes/chat');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParse());
app.use(checkForAuthenticationCookie("token"))

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.json('Hello World!');
});

app.use('/chat', chatRoute);
app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.use("/comment", commentRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});