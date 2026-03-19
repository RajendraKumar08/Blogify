const { Router } = require('express')
const Comment = require('../models/comment');
const User = require('../models/user');
const Blog = require('../models/blog');
const { randomBytes } = require("crypto");
const { createTokenForUser, validateToken } = require("../service/auth");
const router = Router()

// Create a new comment
router.post('/api/create', async (req, res) => {
    try {
        const { content, blogId } = req.body;
        const token = req.cookies.token;
        if(!token){
            throw new console.error("No user found");
            
        }
        const payload = validateToken(token);
        const user = await User.findById(payload._id);
        const blog = await Blog.findById(blogId);
        blog.comments.push(payload._id);
        user.comments.push(blogId);
        await blog.save();
        await user.save();
        // console.log("content for comment and id", content, blogId);
        const comment = await Comment.create({ content, blog: blogId, createdBy: user._id });
        return res.status(201).json({ success: true, comment });
    } catch (error) {
        console.log("Create Comment Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/api/all', async(req, res) => {
    try{
        const allcomments = await Comment.find().populate('createdBy');
        // console.log("All comments", allcomments);
        return res.json({ success: true, comments: allcomments });
    } catch(error){
        console.log(error);
    }

})

module.exports = router;