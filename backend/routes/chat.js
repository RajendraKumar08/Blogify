const { Router } = require('express');
const { client } = require("../service/openai");
const rateLimit = require("express-rate-limit");

const router = Router();

// Strict rate limiter for AI chat/API calls - 2 requests per 15 minutes
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
    const { question } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }

    // const prompt = `You are a helpful assistant. Provide advice for a user who asks where to place a chatbot in a blog app. Question: ${question}`;

    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: "Give me a helpful response to this question or provide a helpful response and yes give me the response in form of paragraph, no bullets points and no emojis. Here is the question or word :  " + question,
    });

    console.log("OpenAI Response:", response.output_text);

    const answer = response.output_text || (response.output && response.output[0] && response.output[0].content && response.output[0].content[0] && response.output[0].content[0].text) || 'No response from AI';

    return res.type('text').send(answer);
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
});

module.exports = router;
