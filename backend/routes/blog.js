const { Router } = require('express')
const path = require("path")
const multer = require("multer");
const Blog = require('../models/blog')
const View = require('../models/blogViews')
const { client } = require("../service/openai");
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

    console.log("Content in api create", content);

    if (!discription) {
      const result = await client.responses.create({
        model: "openai/gpt-oss-20b",
        input: "Generate A short Discription of exact 60 character for a blog post with the following content: " + content,
      });
      // console.log("OpenAI Response:", result.output_text);
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

    const tagsResult = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: `Extract 5-7 relevant tags from this blog post content. Return them as a comma-separated string.\n\nContent:\n${content}`,
    });

    console.log("Tags Result", tagsResult)
    const tagsString = tagsResult.output_text.trim();
    console.log("Tags String", tagsString);
    const problemTags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);


    const blog = await Blog.create({ title, content, discription, imageUrl, createdBy: req.user._id, problemTags });

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

    if (!q || !q.trim()) {
      return res.json({ success: true, blogs: [] });
    }
    const result = await client.responses.create({
      model :  "openai/gpt-oss-20b",
      input : `Extract 2-3 relevant tags from this query ${q}. Return them as a comma-separated string`
    });

    
    const tagsString = result.output_text.trim();
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    // console.log(tags)

    const blogs = await Blog.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: tags,
            path: ["title", "problemTags"],
            fuzzy: {
              maxEdits: 2
            }
          }
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          content: 1,
          imageUrl: 1,
          createdAt: 1,
          comments: 1,
          views: 1,
          likes: 1, 
          score: { $meta: "searchScore" }
        }
      },
      {
        $sort: {
          score: -1
        }
      },
      {
        $limit: 5
      }
    ]);

    return res.json({ success: true, blogs });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/api/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    // console.log("Blog ID received:", blogId);
    const blog = await Blog.findById(blogId).populate('createdBy');
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    console.log("Blog found: in api get", blog.content);
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

router.post('api/:id/read-time', async (req, res) => {
  try {
    const blogId = req.params.id;
    const { time } = req.body;
    
    if (time && typeof time === 'number') {
      // The Blog model already has a `readTime` field, so we use $inc to accumulate the total time
      await Blog.findByIdAndUpdate(blogId, { $inc: { readTime: time } });
    }
    
    return res.json({ success: true, message: 'Read time updated successfully' });
  } catch (error) {
    console.log("Error updating read time", error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/api/:id/delete', async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(blogId);
    return res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.log("Error deleting blog", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/api/:id/update', upload.single("image"), async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;
    const { title, content, discription } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this blog' });
    }

    let imageUrl = blog.imageUrl; // Keep existing image if no new one

    if (req.file) {
      imageUrl = `/upload/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, content, discription, imageUrl },
      { new: true }
    ).populate('createdBy');

    return res.json({ success: true, blog: updatedBlog });
  } catch (error) {
    console.log("Error updating blog", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/api/:id/view', async (req, res) => {
  try{
    const blogId = req.params.id;

    
    const userId = req.user ? req.user._id : null;

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const query = userId ? {blogId: blogId, userId: userId} : {blogId: blogId, ip: ip};

    const alreadyCounted = await View.findOne(query);
    if(!alreadyCounted){
      const view = new View({
        blogId: blogId,
        userId: userId,
        ip: ip
      });
      await view.save();
      await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });
    }

    return res.json({success: true, message: 'View counted'});

  } catch(error){
    console.log("Error in view count", error);
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
})

router.post('/api/:id/read-time', async (req, res) => {
  try {
    const blogId = req.params.id;
    const { time } = req.body;
    
    if (time && typeof time === 'number') {
      // The Blog model already has a `readTime` field, so we use $inc to accumulate the total time
      await Blog.findByIdAndUpdate(blogId, { $inc: { readTime: time } });
    }
    
    return res.json({ success: true, message: 'Read time updated successfully' });
  } catch (error) {
    console.log("Error updating read time", error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;


