const { Router } = require('express')
const path = require("path")
const multer = require("multer");
const Blog = require('../models/blog')
const {client} = require("../service/openai");
// const openai = require("../service/openai")

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

// Create a new blog post
router.post('/api/create', upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    let { discription } = req.body;

    if (!discription) {
      const result = await client.responses.create({
        model: "openai/gpt-oss-20b",
        input: "Generate A short Discription within 60 character for a blog post with the following content: " + content,
      });
      console.log("OpenAI Response:", result.output_text);
      discription = result.output_text;
    }
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/upload/${req.file.filename}`;
    }
    // let chunks = chunk_text(content);
    // let embeddings = [];
    // for(let chunk of chunks) {
    //   const embeddingResponse = await client.embeddings.create({
    //     model: "openai/gpt-oss-20b",
    //     input: chunk
    //   });
    //   embeddings.push(...embeddingResponse.data[0].embedding);
    // }


    const blog = await Blog.create({ title, content, discription, imageUrl, createdBy: req.user._id});

    // console.log(blog);
    return res.status(201).json({ success: true, blog });
  } catch (error) {
    console.log("Create Blog Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
})

router.get('/api/all', async (req, res) => {
  try {
    const allblogs = await Blog.find().populate('createdBy');
    return res.json({ success: true, blogs: allblogs });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }

})

router.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    // console.log("Search query:", q);
    const blogs = await Blog.find({
      title: { $regex: q, $options: 'i' }
    }).sort({ createdAt: -1 });

    return res.json({ success: true, blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
})

router.get('/api/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    // console.log("Blog ID received:", blogId);
    const blog = await Blog.findById(blogId).populate('createdBy');
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    return res.json({ success: true, blog });
  }
  catch (error) {
    // console.log("Error from backend ", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/api/:id/like', async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Check if the user has already liked the blog
    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      // Unlike the blog
      blog.likes = blog.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Like the blog
      blog.likes.push(userId);
    }

    await blog.save();
    return res.json({ success: true, blog });
  } catch (error) {
    console.log("Error liking blog", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


