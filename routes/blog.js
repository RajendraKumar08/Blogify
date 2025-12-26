const { Router } = require("express")
const User = require("../models/user")
const router = Router();
const path = require("path")
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/upload/`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()} - ${file.originalname}`
    cb(null, filename);
  }
})

const upload = multer({ storage})

router.get("/addNew", (req, res) => {
    return res.render("blog", {
        user : req.user
    })
})

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
  console.log(comments)
  return res.render("blogPage", {
    user : req.user,
    blog,
    comments
  })
})

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content : req.body.content,
    blogId : req.params.blogId,
    createdBy : req.user._id
  });
  return res.redirect(`/blog/${req.params.blogId}`);
})

router.post("/", upload.single("coverImage") , async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy : req.user._id,
        coverImage : `/upload/${req.file.filename}`

    }) 
    console.log(blog)
    return res.redirect(`/blog/${blog._id}`);
})

module.exports = router;