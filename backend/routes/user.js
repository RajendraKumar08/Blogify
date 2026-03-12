const { Router } = require('express')
const User = require('../models/user')
const { randomBytes } = require("crypto");
const { createTokenForUser } = require("../service/auth");
const {validateToken} = require("../service/auth");
const user = require('../models/user');
const multer = require("multer");
const path = require("path");

const router = Router()


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, `../public/upload`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()} - ${file.originalname}`
    cb(null, filename);
  }
})

const upload = multer({ storage })

router.post('/api/signup', upload.single('profileImg'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // const salt = randomBytes(16).toString("hex");
    console.log("File received:", req.file);
    let imageUrl = '';
    if(req.file){
      imageUrl = `/upload/${req.file.filename}`;
    }
    const user = await User.create({ name, email, password, profileImg: imageUrl });

    const token = createTokenForUser(user);

    console.log(user)

    return res.cookie("token", token, { httpOnly: true }).json({ success: true, user });

  } catch (error) {
    console.log("Signup Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});


router.post('/api/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const token = await User.matchPasswordAndGenerateToken(email, password)
        const user = validateToken(token);
        // console.log(user)
        return res.cookie("token", token).json({ success: true, user})
    } catch (error) {
        return res.status(401).json({ error: "Incorrect Email or Password" })
    }
})

router.post('/api/logout', (req, res) => {
  return res.clearCookie("token").json({ success: true });
});

router.get("/api/me", (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, error: "Not logged in" });
    }

    const user = validateToken(token);

    return res.json({ success: true, user });
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
});

module.exports = router
