const { Router } = require('express')
const Comment = require('../models/comment')
const router = Router()

// Create a new comment
router.post('/api/create', async (req, res) => {
    try {
        const { content, blogId } = req.body;
        console.log("content for comment and id", content, blogId);
        const comment = await Comment.create({ content, blog: blogId, createdBy: req.user._id });
        return res.status(201).json({ success: true, comment });
    } catch (error) {
        console.log("Create Comment Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/api/all', async(req, res) => {
    try{
        const allcomments = await Comment.find().populate('createdBy');
        console.log("All comments", allcomments);
        return res.json({ success: true, comments: allcomments });
    } catch(error){
        console.log(error);
    }

})

module.exports = router;