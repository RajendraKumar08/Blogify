const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
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
const rateLimit = require("express-rate-limit");

// add cors policy for frontend
const whitelist = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.replace(/;+$/, '').split(',').map(url => url.trim())
  : [];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Strict rate limiter for authentication routes - 5 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login/signup attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Comment rate limiter - 20 requests per 15 minutes
const commentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: "Too many comments posted, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

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
app.use("/user/api/signup", authLimiter);
app.use("/user/api/login", authLimiter);
app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.use("/comment", commentRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});