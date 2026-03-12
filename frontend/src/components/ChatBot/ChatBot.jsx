import React, { useState, useRef, useEffect } from "react";

const ChatBot = ({
  className = "",
  welcomeText = "Ask me anything about where to place your chatbot in the app"
}) => {

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: welcomeText }
  ]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendQuestion = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    const userText = question.trim();

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/chat/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: userText })
      });

      const text = await response.text();

      console.log("ChatBot API response text:", text);

      const botReply = text || "Sorry, I couldn't understand that.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: botReply }
      ]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Please try again." }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      
      <button
        type="button"
        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Close Chat" : "Chat"}
      </button>

      {open && (
        <div className="w-90 h-150 mt-2 bg-white border border-gray-300 shadow-xl rounded-lg flex flex-col">

          <div className="p-3 bg-blue-600 text-white text-sm font-medium">
            AI Assistant
          </div>

          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-3 space-y-2"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`px-3 py-2 text-sm rounded-lg max-w-xs ${
                    msg.role === "assistant"
                      ? "bg-gray-200 text-black"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-xs text-gray-400">Assistant is typing...</div>
            )}
          </div>

          <form
            className="p-2 border-t flex gap-2"
            onSubmit={sendQuestion}
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 border rounded px-2 py-1 text-sm"
              disabled={loading}
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              disabled={loading}
            >
              Send
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default ChatBot;