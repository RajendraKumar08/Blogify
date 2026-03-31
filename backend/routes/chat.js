const { Router } = require('express');
const { client } = require("../service/openai");
const rateLimit = require("express-rate-limit");
const Blog = require('../models/blog')

const router = Router();

// Strict rate limiter for AI chat/API calls - 20 requests per 15 minutes
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: "Too many AI requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Chatbot endpoint (frontend can POST user questions here)
router.post('/api/ask', chatLimiter, async (req, res) => {
  try {
    const { question, blogId } = req.body;
    console.log("This is the req body", req.body);

    if (!blogId) {
      return res.status(400).json({ success: false, error: 'Blog ID is required' });
    }

    const blog = await Blog.findById(blogId);
    console.log("This is the blog in chat", blog);

    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }

    const content = blog.content;
    console.log("This is the blog content in chat", content);

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }

    // const prompt = `You are a helpful assistant. Provide advice for a user who asks where to place a chatbot in a blog app. Question: ${question}`;

    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: `You have to give a detail response in plain text paragraph of this question "${question}"  and you have to give the response based on this content ${content}. Like someone is reading this content and he/she stuck at somewherew he/she is asking the question so you have to give the response according to this given content `,
    });

    // console.log("OpenAI Response:", response.output_text);

    const answer = response.output_text || (response.output && response.output[0] && response.output[0].content && response.output[0].content[0] && response.output[0].content[0].text) || 'No response from AI';

    return res.type('text').send(answer);
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
});



module.exports = router;
