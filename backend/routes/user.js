const { Router } = require('express')
const User = require('../models/user')
const { randomBytes } = require("crypto");
const { createTokenForUser } = require("../service/auth");
const {validateToken} = require("../service/auth");
const user = require('../models/user');
const multer = require("multer");
const path = require("path");
const { ObjectId } = require('mongoose').Types;

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
    // console.log("File received:", req.file);
    let imageUrl = '';
    if(req.file){
      imageUrl = `/upload/${req.file.filename}`;
    }
    const user = await User.create({ name, email, password, profileImg: imageUrl });

    const token = createTokenForUser(user);

    // console.log(user)

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
        const payload = validateToken(token);
        const user = await User.findById(payload._id).select('-password -salt');
        // console.log(user)
        return res.cookie("token", token).json({ success: true, user})
    } catch (error) {
        return res.status(401).json({ error: "Incorrect Email or Password" })
    }
})

router.post('/api/logout', (req, res) => {
  return res.clearCookie("token").json({ success: true });
});

router.get("/api/me", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, error: "Not logged in" });
    }

    const payload = validateToken(token);
    const user = await User.findById(payload._id).select('-password -salt');

    return res.json({ success: true, user });
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
});
router.post("/api/managelike", async (req, res) => {
  try {
    const token = req.cookies.token;
    const blogId = req.body.blogId;  

    console.log("Blog ID received in manage like route:", blogId);

    if (!token) {
      return res.status(401).json({ success: false, error: "Not logged in" });
    }

    if (!blogId || !ObjectId.isValid(blogId)) {
      return res.status(400).json({ success: false, error: "Invalid blog ID" });
    }

    const payload = validateToken(token);
    const user = await User.findById(payload._id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const blogObjectId = new ObjectId(blogId);

    if(user.likedBlogs.some(id => id.equals(blogObjectId))){
      user.likedBlogs = user.likedBlogs.filter(id => !id.equals(blogObjectId));
    } else {
      user.likedBlogs.push(blogObjectId);
    }

    await user.save();
    user.likedBlogs.map(id => console.log("Liked blog id", id));
    
    return res.json({ success: true, user }); // Return the updated user document
  } catch (err) {
    console.log("Error in manage like:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

router.get("/api/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select('-password -salt');

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (err) {
    console.log("Error in fetch user by ID:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router
