require("dotenv").config();

const apikey = process.env.OPENAI_API_KEY;
const OpenAI = require("openai");
const client = new OpenAI({
    apiKey: apikey,
    baseURL: "https://api.groq.com/openai/v1"
});

module.exports =  { client };